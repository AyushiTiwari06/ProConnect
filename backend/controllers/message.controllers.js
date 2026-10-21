import Message from "../models/message.model.js"
import User from "../models/user.model.js"

export const sendMessage=async(req,res)=>{
  try{
    const {receiver,message}=req.body

    if(!receiver || !message?.trim()){
      return res.status(400).json({
        message:"Receiver and message are required"
      })
    }

    if(req.userId.toString()===receiver.toString()){
      return res.status(400).json({
        message:"You cannot send a message to yourself"
      })
    }

    const senderUser=await User.findById(req.userId)

    if(!senderUser){
      return res.status(404).json({
        message:"Sender not found"
      })
    }

    const isConnected=senderUser.connection.some(
      id=>id.toString()===receiver.toString()
    )

    if(!isConnected){
      return res.status(403).json({
        message:"You can only message your connections"
      })
    }

    const receiverUser=await User.findById(receiver)

    if(!receiverUser){
      return res.status(404).json({
        message:"Receiver not found"
      })
    }

    const newMessage=await Message.create({
      sender:req.userId,
      receiver,
      message:message.trim()
    })

    const populatedMessage=await Message.findById(
      newMessage._id
    ).populate(
      "sender",
      "firstName lastName userName profileImage"
    )

    return res.status(201).json(populatedMessage)

  }catch(error){
    console.log("sendMessage error:",error)

    return res.status(500).json({
      message:"sendMessage error"
    })
  }
}

export const getMessages=async(req,res)=>{
  try{
    const {userId}=req.params
    const currentUser=req.userId

    const messages=await Message.find({
      $or:[
        {
          sender:currentUser,
          receiver:userId
        },
        {
          sender:userId,
          receiver:currentUser
        }
      ]
    })
    .populate(
      "sender",
      "firstName lastName userName profileImage"
    )
    .sort({createdAt:1})

    return res.status(200).json(messages)

  }catch(error){
    console.log("getMessages error:",error)

    return res.status(500).json({
      message:"getMessages error"
    })
  }
}