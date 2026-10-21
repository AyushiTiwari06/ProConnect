import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { RxCross1 } from "react-icons/rx"
import dp from "../assets/dp.webp"
import { userDataContext } from '../context/UserContext'

function Notification() {
  let {serverUrl}=useContext(authDataContext)
  let [notificationData,setNotificationData]=useState([])
  let {userData}=useContext(userDataContext)

  const handleGetNotification=async ()=>{
    try {
      let result=await axios.get(serverUrl+"/api/notification/get",{withCredentials:true})
      setNotificationData(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handledeleteNotification=async (id)=>{
    try {
      let result=await axios.delete(serverUrl+`/api/notification/deleteone/${id}`,{withCredentials:true})
      await handleGetNotification()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClearAllNotification=async ()=>{
    try {
      let result=await axios.delete(serverUrl+"/api/notification",{withCredentials:true})
      await handleGetNotification()
    } catch (error) {
      console.log(error)
    }
  }

  const handleMessage=(type)=>{
    if(type=="like"){
      return "liked your post"
    }else if(type=="comment"){
      return "commented on your post"
    }else{
      return "Accept your connection"
    }
  }

  useEffect(()=>{
    handleGetNotification()
  },[])

  return (
    <div className='w-full min-h-screen bg-[#f4f6f8] pt-[100px] px-4 sm:px-6 pb-[50px] flex flex-col items-center'>
      <Nav/>

      <div className='w-full max-w-[900px]'>
        <div className='w-full bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden'>
          <div className='px-5 sm:px-7 py-5 flex items-center justify-between border-b border-gray-200'>
            <div>
              <h1 className='text-[22px] sm:text-[24px] font-bold text-gray-900'>
                Notifications
              </h1>
              <p className='text-sm text-gray-500 mt-1'>
                {notificationData.length} {notificationData.length===1 ? "notification" : "notifications"}
              </p>
            </div>

            {notificationData.length>0 &&
              <button
                className='px-4 sm:px-5 h-[40px] rounded-full border border-red-300 text-red-500 font-semibold text-sm hover:bg-red-50 transition'
                onClick={handleClearAllNotification}
              >
                Clear all
              </button>
            }
          </div>

          {notificationData.length>0 ? (
            <div className='flex flex-col'>
              {notificationData.map((noti,index)=>(
                <div
                  className='w-full px-5 sm:px-7 py-5 flex items-start justify-between gap-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition'
                  key={index}
                >
                  <div className='flex items-start gap-4 min-w-0'>
                    <div className='w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm'>
                      <img
                        src={noti.relatedUser.profileImage || dp}
                        alt=""
                        className='w-full h-full object-cover'
                      />
                    </div>

                    <div className='min-w-0'>
                      <div className='text-[15px] sm:text-[17px] text-gray-800 leading-6'>
                        <span className='font-bold'>
                          {`${noti.relatedUser.firstName} ${noti.relatedUser.lastName}`}
                        </span>
                        <span className='text-gray-600 ml-1'>
                          {handleMessage(noti.type)}
                        </span>
                      </div>

                      {noti.relatedPost &&
                        <div className='mt-3 flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-2.5 max-w-[600px]'>
                          {noti.relatedPost.image &&
                            <div className='w-[75px] h-[50px] rounded-lg overflow-hidden shrink-0 bg-gray-200'>
                              <img
                                src={noti.relatedPost.image}
                                alt=""
                                className='w-full h-full object-cover'
                              />
                            </div>
                          }

                          <div className='text-sm text-gray-600 line-clamp-2'>
                            {noti.relatedPost.description}
                          </div>
                        </div>
                      }
                    </div>
                  </div>

                  <button
                    className='w-[36px] h-[36px] rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition shrink-0'
                    onClick={()=>handledeleteNotification(noti._id)}
                  >
                    <RxCross1 className='w-[18px] h-[18px]'/>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className='px-6 py-16 text-center'>
              <div className='w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center'>
                <div className='w-7 h-7 rounded-full border-2 border-[#0a66c2] flex items-center justify-center'>
                  <span className='text-[#0a66c2] text-sm'>✓</span>
                </div>
              </div>

              <h2 className='text-lg font-semibold text-gray-800 mt-5'>
                No notifications
              </h2>

              <p className='text-sm text-gray-500 mt-2'>
                You're all caught up. New activity will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notification
