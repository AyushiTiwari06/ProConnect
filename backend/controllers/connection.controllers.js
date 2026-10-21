import Connection from "../models/connection.model.js"
import User from "../models/user.model.js"
import {io,userSocketMap} from "../index.js"
import Notification from "../models/notification.model.js"

export const sendConnection=async(req,res)=>{
  try {
    let {id}=req.params
    let sender=req.userId

    if(sender==id){
      return res.status(400).json({message:"you can not send request yourself"})
    }

    let user=await User.findById(sender)

    if(!user){
      return res.status(404).json({message:"user not found"})
    }

    if(user.connection.includes(id)){
      return res.status(400).json({message:"you are already connected"})
    }

    let existingConnection=await Connection.findOne({
      $or:[
        {
          sender:sender,
          receiver:id,
          status:"pending"
        },
        {
          sender:id,
          receiver:sender,
          status:"pending"
        }
      ]
    })

    if(existingConnection){
      return res.status(400).json({message:"request already exist"})
    }

    let newRequest=await Connection.create({
      sender,
      receiver:id,
      status:"pending"
    })

    let receiverSocketId=userSocketMap.get(id.toString())
    let senderSocketId=userSocketMap.get(sender.toString())

    if(receiverSocketId){
      io.to(receiverSocketId).emit("statusUpdate",{
        updatedUserId:sender.toString(),
        newStatus:"received"
      })
    }

    if(senderSocketId){
      io.to(senderSocketId).emit("statusUpdate",{
        updatedUserId:id.toString(),
        newStatus:"pending"
      })
    }

    return res.status(200).json(newRequest)

  } catch(error) {
    console.log("sendConnection error:",error)

    return res.status(500).json({
      message:`sendconnection error ${error.message}`
    })
  }
}

export const acceptConnection=async(req,res)=>{
  try {
    let {connectionId}=req.params
    let userId=req.userId

    let connection=await Connection.findById(connectionId)

    if(!connection){
      return res.status(400).json({
        message:"connection does not exist"
      })
    }

    if(connection.status!="pending"){
      return res.status(400).json({
        message:"request under process"
      })
    }

    if(connection.receiver.toString()!=userId.toString()){
      return res.status(403).json({
        message:"you are not authorized to accept this request"
      })
    }

    connection.status="accepted"

    await Notification.create({
      receiver:connection.sender,
      type:"connectionAccepted",
      relatedUser:userId
    })

    await connection.save()

    await User.findByIdAndUpdate(userId,{
      $addToSet:{
        connection:connection.sender
      }
    })

    await User.findByIdAndUpdate(connection.sender,{
      $addToSet:{
        connection:userId
      }
    })

    let receiverSocketId=userSocketMap.get(userId.toString())
    let senderSocketId=userSocketMap.get(connection.sender.toString())

    if(receiverSocketId){
      io.to(receiverSocketId).emit("statusUpdate",{
        updatedUserId:connection.sender.toString(),
        newStatus:"disconnect"
      })
    }

    if(senderSocketId){
      io.to(senderSocketId).emit("statusUpdate",{
        updatedUserId:userId.toString(),
        newStatus:"disconnect"
      })
    }

    return res.status(200).json({
      message:"connection accepted"
    })

  } catch(error) {
    console.log("acceptConnection error:",error)

    return res.status(500).json({
      message:`connection accepted error ${error.message}`
    })
  }
}

export const rejectConnection=async(req,res)=>{
  try {
    let {connectionId}=req.params

    let connection=await Connection.findById(connectionId)

    if(!connection){
      return res.status(400).json({
        message:"connection does not exist"
      })
    }

    if(connection.status!="pending"){
      return res.status(400).json({
        message:"request under process"
      })
    }

    if(connection.receiver.toString()!=req.userId.toString()){
      return res.status(403).json({
        message:"you are not authorized to reject this request"
      })
    }

    connection.status="rejected"
    await connection.save()

    let senderSocketId=userSocketMap.get(
      connection.sender.toString()
    )

    if(senderSocketId){
      io.to(senderSocketId).emit("statusUpdate",{
        updatedUserId:req.userId.toString(),
        newStatus:"connect"
      })
    }

    return res.status(200).json({
      message:"connection rejected"
    })

  } catch(error) {
    console.log("rejectConnection error:",error)

    return res.status(500).json({
      message:`connection rejected error ${error.message}`
    })
  }
}

export const getConnectionStatus=async(req,res)=>{
  try {
    const targetUserId=req.params.userId
    const currentUserId=req.userId

    let currentUser=await User.findById(currentUserId)

    if(!currentUser){
      return res.status(404).json({
        message:"user not found"
      })
    }

    let isConnected=currentUser.connection.some(
      id=>id.toString()===targetUserId.toString()
    )

    if(isConnected){
      return res.json({
        status:"disconnect"
      })
    }

    let pendingRequest=await Connection.findOne({
      $or:[
        {
          sender:currentUserId,
          receiver:targetUserId,
          status:"pending"
        },
        {
          sender:targetUserId,
          receiver:currentUserId,
          status:"pending"
        }
      ]
    })

    if(pendingRequest){

      if(
        pendingRequest.sender.toString()===
        currentUserId.toString()
      ){
        return res.json({
          status:"pending"
        })
      }

      return res.json({
        status:"received",
        requestId:pendingRequest._id
      })
    }

    return res.json({
      status:"connect"
    })

  } catch(error) {
    console.log("getConnectionStatus error:",error)

    return res.status(500).json({
      message:"getConnectionStatus error"
    })
  }
}

export const removeConnection=async(req,res)=>{
  try {
    const myId=req.userId
    const otherUserId=req.params.userId

    await User.findByIdAndUpdate(myId,{
      $pull:{
        connection:otherUserId
      }
    })

    await User.findByIdAndUpdate(otherUserId,{
      $pull:{
        connection:myId
      }
    })

    let receiverSocketId=userSocketMap.get(
      otherUserId.toString()
    )

    let senderSocketId=userSocketMap.get(
      myId.toString()
    )

    if(receiverSocketId){
      io.to(receiverSocketId).emit("statusUpdate",{
        updatedUserId:myId.toString(),
        newStatus:"connect"
      })
    }

    if(senderSocketId){
      io.to(senderSocketId).emit("statusUpdate",{
        updatedUserId:otherUserId.toString(),
        newStatus:"connect"
      })
    }

    return res.json({
      message:"Connection removed successfully"
    })

  } catch(error) {
    console.log("removeConnection error:",error)

    return res.status(500).json({
      message:"removeConnection error"
    })
  }
}

export const getConnectionRequests=async(req,res)=>{
  try {
    const userId=req.userId

    const requests=await Connection.find({
      receiver:userId,
      status:"pending"
    }).populate(
      "sender",
      "firstName lastName email userName profileImage headline"
    )

    return res.status(200).json(requests)

  } catch(error) {
    console.error(
      "Error in getConnectionRequests controller:",
      error
    )

    return res.status(500).json({
      message:"Server error"
    })
  }
}

export const getUserConnections=async(req,res)=>{
  try {
    const userId=req.userId

    const user=await User.findById(userId).populate(
      "connection",
      "firstName lastName userName profileImage headline connection"
    )

    return res.status(200).json(user.connection)

  } catch(error) {
    console.error(
      "Error in getUserConnections controller:",
      error
    )

    return res.status(500).json({
      message:"Server error"
    })
  }
}