import React,{useContext,useEffect,useState} from 'react'
import {authDataContext} from '../context/AuthContext'
import axios from 'axios'
import io from "socket.io-client"
import {userDataContext} from '../context/UserContext'
import {useNavigate} from 'react-router-dom'

// let socket=io("http://localhost:8000")

let socket=io("https://proconnect-backend-r0tp.onrender.com")

function ConnectionButton({userId}) {
  let {serverUrl}=useContext(authDataContext)
  let {userData}=useContext(userDataContext)
  let [status,setStatus]=useState("")
  let navigate=useNavigate()

  const handleSendConnection=async()=>{
    try {
      let result=await axios.post(
        `${serverUrl}/api/connection/send/${userId}`,
        {},
        {withCredentials:true}
      )

      console.log("Connection created:",result.data)

      // Immediately update button
      setStatus("pending")

    } catch(error) {
      console.log(
        "Connection error:",
        error.response?.data || error.message
      )

      // If request already exists, get its current status
      if(error.response?.data?.message==="request already exist"){
        await handleGetStatus()
      }
    }
  }

  const handleRemoveConnection=async()=>{
    try {
      let result=await axios.delete(
        `${serverUrl}/api/connection/remove/${userId}`,
        {withCredentials:true}
      )

      console.log("Connection removed:",result.data)

      // Immediately update button
      setStatus("connect")

    } catch(error) {
      console.log(
        "Remove connection error:",
        error.response?.data || error.message
      )
    }
  }

  const handleGetStatus=async()=>{
    try {
      let result=await axios.get(
        `${serverUrl}/api/connection/getStatus/${userId}`,
        {withCredentials:true}
      )

      console.log("Current connection status:",result.data)

      setStatus(result.data.status)

    } catch(error) {
      console.log(
        "Get status error:",
        error.response?.data || error.message
      )
    }
  }

  useEffect(()=>{
    if(!userData?._id || !userId) return

    socket.emit("register",userData._id)

    handleGetStatus()

    const handleStatusUpdate=({updatedUserId,newStatus})=>{
      if(
        updatedUserId?.toString()===userId?.toString()
      ){
        console.log(
          "Socket status update:",
          updatedUserId,
          newStatus
        )

        setStatus(newStatus)
      }
    }

    socket.on("statusUpdate",handleStatusUpdate)

    return()=>{
      socket.off("statusUpdate",handleStatusUpdate)
    }
  },[userId,userData?._id])

  const handleClick=async()=>{
    if(status==="disconnect"){
      await handleRemoveConnection()
    }else if(status==="received"){
      navigate("/network")
    }else if(status==="pending"){
      return
    }else{
      await handleSendConnection()
    }
  }

  return(
    <button
      onClick={handleClick}
      disabled={status==="pending"}
      className={`min-w-[120px] h-[42px] px-5 rounded-full font-semibold text-sm transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
        status==="disconnect"
          ? "border border-gray-300 text-gray-600 hover:bg-gray-100"
          : status==="pending"
          ? "border border-gray-300 text-gray-500 bg-gray-50"
          : status==="received"
          ? "bg-[#0a66c2] text-white border border-[#0a66c2] hover:bg-[#004182]"
          : "border-2 border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50"
      }`}
    >
      {status==="disconnect"
        ? "Disconnect"
        : status==="pending"
        ? "Pending"
        : status==="received"
        ? "Respond"
        : "Connect"}
    </button>
  )
}

export default ConnectionButton