import React,{useContext,useEffect,useRef,useState} from 'react'
import {useNavigate,useParams} from 'react-router-dom'
import axios from 'axios'
import io from 'socket.io-client'
import {authDataContext} from '../context/AuthContext'
import {userDataContext} from '../context/UserContext'
import Nav from '../components/Nav'
import dp from "../assets/dp.webp"
import {FiArrowLeft,FiSend,FiMessageCircle} from "react-icons/fi"

// const socket=io("http://localhost:8000")
const socket=io("https://proconnect-backend-r0tp.onrender.com")

function Chat(){
  const {userId}=useParams()
  const navigate=useNavigate()

  const {serverUrl}=useContext(authDataContext)
  const {userData}=useContext(userDataContext)

  const [messages,setMessages]=useState([])
  const [message,setMessage]=useState("")
  const [receiver,setReceiver]=useState(null)
  const [connections,setConnections]=useState([])
  const [loading,setLoading]=useState(true)
  const [sending,setSending]=useState(false)
  const messagesEndRef=useRef(null)

  const getConnections=async()=>{
    try{
      setLoading(true)

      const result=await axios.get(
        `${serverUrl}/api/connection/`,
        {withCredentials:true}
      )

      console.log("Connections:",result.data)

      if(Array.isArray(result.data)){
        setConnections(result.data)

        if(userId){
          const selectedUser=result.data.find(
            user=>user?._id?.toString()===userId?.toString()
          )

          if(selectedUser){
            setReceiver(selectedUser)
          }else{
            setReceiver(null)
          }
        }
      }else{
        setConnections([])
        setReceiver(null)
      }

    }catch(error){
      console.log(
        "Get connections error:",
        error.response?.data || error.message
      )
      setConnections([])
      setReceiver(null)
    }finally{
      setLoading(false)
    }
  }

  const getMessages=async()=>{
    try{
      const result=await axios.get(
        `${serverUrl}/api/message/${userId}`,
        {withCredentials:true}
      )

      if(Array.isArray(result.data)){
        setMessages(result.data)
      }else{
        setMessages([])
      }

    }catch(error){
      console.log(
        "Get messages error:",
        error.response?.data || error.message
      )
      setMessages([])
    }
  }

  const handleSendMessage=async()=>{
    if(!message.trim() || !userData?._id || !userId || sending){
      return
    }

    const messageText=message.trim()

    try{
      setSending(true)

      const result=await axios.post(
        `${serverUrl}/api/message/send`,
        {
          receiver:userId,
          message:messageText
        },
        {withCredentials:true}
      )

      if(result.data){
        setMessages(prev=>[...prev,result.data])

        socket.emit("sendMessage",{
          sender:userData._id,
          receiver:userId,
          message:messageText
        })

        setMessage("")
      }

    }catch(error){
      console.log(
        "Send message error:",
        error.response?.data || error.message
      )
    }finally{
      setSending(false)
    }
  }

  const handleKeyDown=(e)=>{
    if(e.key==="Enter" && !e.shiftKey){
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(()=>{
    if(!userData?._id) return

    socket.emit("register",userData._id)

    const handleNewMessage=(newMessage)=>{
      if(
        newMessage.sender?.toString()===userId?.toString() &&
        newMessage.receiver?.toString()===userData._id?.toString()
      ){
        setMessages(prev=>[...prev,newMessage])
      }
    }

    socket.on("newMessage",handleNewMessage)

    return()=>{
      socket.off("newMessage",handleNewMessage)
    }
  },[userData?._id,userId])

  useEffect(()=>{
    if(!userData?._id) return

    getConnections()

    if(userId){
      getMessages()
    }else{
      setMessages([])
    }
  },[userId,userData?._id])

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({
      behavior:"smooth"
    })
  },[messages])

  return(
    <div className='w-full min-h-screen bg-[#f4f6f8]'>
      <Nav/>

      <div className='pt-[85px] px-3 sm:px-5 pb-5'>
        <div className='w-full max-w-[900px] h-[calc(100vh-105px)] mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col'>

          {!userId ? (
            <>
              <div className='h-[75px] shrink-0 border-b border-gray-200 flex items-center px-5 gap-3'>
                <div className='w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center'>
                  <FiMessageCircle className='w-6 h-6 text-[#0a66c2]'/>
                </div>

                <div>
                  <div className='text-xl font-bold text-gray-900'>
                    Messages
                  </div>

                  <div className='text-sm text-gray-500'>
                    Message your connections
                  </div>
                </div>
              </div>

              <div className='flex-1 overflow-y-auto'>
                {loading ? (
                  <div className='h-full flex items-center justify-center text-gray-500'>
                    Loading connections...
                  </div>
                ) : connections.length===0 ? (
                  <div className='h-full flex flex-col items-center justify-center text-center px-5'>
                    <FiMessageCircle className='w-12 h-12 text-gray-300 mb-3'/>

                    <div className='font-semibold text-gray-800'>
                      No connections yet
                    </div>

                    <div className='text-sm text-gray-500 mt-1'>
                      Connect with people first to start messaging.
                    </div>
                  </div>
                ) : (
                  <div className='p-2'>
                    {connections.map((user,index)=>(
                      <button
                        key={user._id || index}
                        onClick={()=>navigate(`/chat/${user._id}`)}
                        className='w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition text-left'
                      >
                        <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0'>
                          <img
                            src={user.profileImage || dp}
                            alt=''
                            className='w-full h-full object-cover'
                          />
                        </div>

                        <div className='min-w-0'>
                          <div className='font-semibold text-gray-900 truncate'>
                            {user.firstName} {user.lastName}
                          </div>

                          <div className='text-sm text-gray-500 truncate'>
                            {user.headline || user.userName}
                          </div>
                        </div>

                        <div className='ml-auto text-[#0a66c2] text-sm font-semibold'>
                          Message
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className='h-[75px] shrink-0 border-b border-gray-200 flex items-center px-4 sm:px-6 gap-3'>
                <button
                  onClick={()=>navigate("/chat")}
                  className='w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition'
                >
                  <FiArrowLeft className='w-5 h-5 text-gray-700'/>
                </button>

                <div className='w-11 h-11 rounded-full overflow-hidden bg-gray-100 shrink-0'>
                  <img
                    src={receiver?.profileImage || dp}
                    alt=''
                    className='w-full h-full object-cover'
                  />
                </div>

                <div className='min-w-0'>
                  <div className='font-bold text-gray-900 truncate'>
                    {receiver
                      ? `${receiver.firstName || ""} ${receiver.lastName || ""}`
                      : "Loading user..."}
                  </div>

                  <div className='text-sm text-gray-500 truncate'>
                    {receiver?.headline || receiver?.userName || ""}
                  </div>
                </div>
              </div>

              {/* MESSAGES */}
              <div className='flex-1 overflow-y-auto px-4 sm:px-6 py-5 bg-[#f8fafc]'>
                {loading ? (
                  <div className='h-full flex items-center justify-center text-gray-500'>
                    Loading messages...
                  </div>
                ) : messages.length===0 ? (
                  <div className='h-full flex flex-col items-center justify-center text-center'>
                    <div className='w-16 h-16 rounded-full overflow-hidden bg-gray-100 mb-3'>
                      <img
                        src={receiver?.profileImage || dp}
                        alt=''
                        className='w-full h-full object-cover'
                      />
                    </div>

                    <div className='font-semibold text-gray-800'>
                      Start a conversation
                    </div>

                    <div className='text-sm text-gray-500 mt-1'>
                      Send a message to your connection.
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col gap-3'>
                    {messages.map((msg,index)=>{
                      const isMine=
                        msg.sender?._id?.toString()===userData?._id?.toString() ||
                        msg.sender?.toString()===userData?._id?.toString()

                      return(
                        <div
                          key={msg._id || index}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-[14px] leading-5 ${
                              isMine
                                ? "bg-[#0a66c2] text-white rounded-br-md"
                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      )
                    })}

                    <div ref={messagesEndRef}></div>
                  </div>
                )}
              </div>

              {/* MESSAGE INPUT */}
              <div className='border-t border-gray-200 bg-white p-3 sm:p-4'>
                <div className='flex items-end gap-2'>
                  <textarea
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Write a message...'
                    rows={1}
                    className='flex-1 min-h-[44px] max-h-[110px] resize-none rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100'
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sending}
                    className='w-11 h-11 shrink-0 rounded-full bg-[#0a66c2] text-white flex items-center justify-center hover:bg-[#004182] disabled:bg-gray-300 disabled:cursor-not-allowed transition'
                  >
                    <FiSend className='w-5 h-5'/>
                  </button>
                </div>

                <div className='text-[11px] text-gray-400 mt-2 ml-2'>
                  Press Enter to send
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default Chat