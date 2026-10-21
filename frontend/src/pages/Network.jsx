import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import dp from "../assets/dp.webp"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { RxCrossCircled } from "react-icons/rx"
import io from "socket.io-client"

const socket=io("https://proconnect-backend-r0tp.onrender.com")
// let socket=io("http://localhost:5173")

function Network() {
  let {serverUrl}=useContext(authDataContext)
  let [connections,setConnections]=useState([])

  const handleGetRequests=async ()=>{
    try {
      let result=await axios.get(`${serverUrl}/api/connection/requests`,{withCredentials:true})
      setConnections(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleAcceptConnection=async (requestId)=>{
    try {
      let result = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`,{},{withCredentials:true})
      setConnections(connections.filter((con)=>con._id!=requestId))
    } catch (error) {
      console.log(error)
    }
  }

  const handleRejectConnection=async (requestId)=>{
    try {
      let result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`,{},{withCredentials:true})
      setConnections(connections.filter((con)=>con._id===requestId))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    handleGetRequests()
  },[])

  return (
    <div className='w-full min-h-screen bg-[#f4f6f8] pt-[100px] px-4 sm:px-6 pb-[50px] flex flex-col items-center'>
      <Nav/>

      <div className='w-full max-w-[900px]'>
        <div className='w-full bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden'>
          <div className='px-6 sm:px-8 py-6 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-[22px] sm:text-[24px] font-bold text-gray-900'>
                  Invitations
                </h1>
                <p className='text-sm text-gray-500 mt-1'>
                  Manage your connection requests
                </p>
              </div>

              <div className='min-w-[42px] h-[42px] px-3 rounded-full bg-blue-50 text-[#0a66c2] flex items-center justify-center font-bold'>
                {connections.length}
              </div>
            </div>
          </div>

          {connections.length>0 ? (
            <div className='flex flex-col'>
              {connections.map((connection,index)=>(
                <div
                  className='w-full min-h-[100px] px-5 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition'
                  key={index}
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm'>
                      <img
                        src={connection.sender.profileImage || dp}
                        alt=""
                        className='w-full h-full object-cover'
                      />
                    </div>

                    <div>
                      <div className='text-[16px] sm:text-[18px] font-semibold text-gray-800'>
                        {`${connection.sender.firstName} ${connection.sender.lastName}`}
                      </div>
                      <div className='text-sm text-gray-500 mt-1'>
                        Wants to connect with you
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 self-end sm:self-auto'>
                    <button
                      className='w-[44px] h-[44px] rounded-full bg-blue-50 text-[#0a66c2] flex items-center justify-center hover:bg-[#0a66c2] hover:text-white transition'
                      onClick={()=>handleAcceptConnection(connection._id)}
                    >
                      <IoIosCheckmarkCircleOutline className='w-[28px] h-[28px]'/>
                    </button>

                    <button
                      className='w-[44px] h-[44px] rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition'
                      onClick={()=>handleRejectConnection(connection._id)}
                    >
                      <RxCrossCircled className='w-[27px] h-[27px]'/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='px-6 py-16 text-center'>
              <div className='w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center'>
                <IoIosCheckmarkCircleOutline className='w-9 h-9 text-[#0a66c2]'/>
              </div>
              <h2 className='text-lg font-semibold text-gray-800 mt-5'>
                No invitations yet
              </h2>
              <p className='text-sm text-gray-500 mt-2'>
                When someone sends you a connection request, it will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Network
