import React,{useContext,useEffect,useState} from 'react'
import dp from "../assets/dp.webp"
import moment from "moment"
import {FaRegCommentDots} from "react-icons/fa"
import {BiLike,BiSolidLike} from "react-icons/bi"
import axios from 'axios'
import {authDataContext} from '../context/AuthContext'
import {userDataContext} from '../context/UserContext'
import {LuSendHorizontal} from "react-icons/lu"
import {io} from "socket.io-client"
import ConnectionButton from './ConnectionButton'

// let socket=io("http://localhost:8000")

let socket=io("https://proconnect-backend-r0tp.onrender.com")

function Post({id,author,like,comment,description,image,createdAt}){

  let [more,setMore]=useState(false)
  let {serverUrl}=useContext(authDataContext)
  let {userData,handleGetProfile}=useContext(userDataContext)

  let [likes,setLikes]=useState(Array.isArray(like)?like:[])
  let [commentContent,setCommentContent]=useState("")
  let [comments,setComments]=useState(Array.isArray(comment)?comment:[])
  let [showComment,setShowComment]=useState(false)

  const handleLike=async()=>{
    try{
      let result=await axios.get(
        serverUrl+`/api/post/like/${id}`,
        {withCredentials:true}
      )

      setLikes(Array.isArray(result.data.like)?result.data.like:[])
    }catch(error){
      console.log(error)
    }
  }

  const handleComment=async(e)=>{
    e.preventDefault()

    if(!commentContent.trim()) return

    try{
      let result=await axios.post(
        serverUrl+`/api/post/comment/${id}`,
        {
          content:commentContent.trim()
        },
        {withCredentials:true}
      )

      setComments(
        Array.isArray(result.data.comment)
          ? result.data.comment
          : comments
      )

      setCommentContent("")
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    const handleLikeUpdate=({postId,likes})=>{
      if(postId?.toString()===id?.toString()){
        setLikes(Array.isArray(likes)?likes:[])
      }
    }

    const handleCommentAdded=({postId,comm})=>{
      if(postId?.toString()===id?.toString()){
        setComments(Array.isArray(comm)?comm:[])
      }
    }

    socket.on("likeUpdated",handleLikeUpdate)
    socket.on("commentAdded",handleCommentAdded)

    return()=>{
      socket.off("likeUpdated",handleLikeUpdate)
      socket.off("commentAdded",handleCommentAdded)
    }
  },[id])

  return(
    <div className='w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>

      {/* POST HEADER */}
      <div className='px-5 sm:px-6 pt-5 pb-4'>

        <div className='flex justify-between items-start gap-3'>

          <div
            className='flex items-start gap-3 cursor-pointer min-w-0'
            onClick={()=>author?.userName && handleGetProfile(author.userName)}
          >

            {/* PROFILE IMAGE */}
            <div className='w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-full overflow-hidden shrink-0 border border-gray-200'>
              <img
                src={author?.profileImage || dp}
                alt=''
                className='w-full h-full object-cover'
              />
            </div>

            {/* AUTHOR INFO */}
            <div className='min-w-0'>

              <div className='text-[16px] sm:text-[18px] font-bold text-gray-900 truncate'>
                {`${author?.firstName || ""} ${author?.lastName || ""}`}
              </div>

              <div className='text-[13px] sm:text-[14px] text-gray-600 line-clamp-1'>
                {author?.headline || ""}
              </div>

              <div className='text-[12px] sm:text-[13px] text-gray-400 mt-1'>
                {createdAt ? moment(createdAt).fromNow() : ""}
              </div>

            </div>
          </div>

          {/* CONNECTION BUTTON */}
          {userData?._id!=author?._id && author?._id &&
            <div className='shrink-0'>
              <ConnectionButton userId={author._id}/>
            </div>
          }

        </div>
      </div>

      {/* DESCRIPTION */}
      {description &&
        <div className='px-5 sm:px-6 pb-4'>

          <div
            className={`text-[14px] sm:text-[15px] text-gray-800 leading-6 whitespace-pre-wrap ${
              !more ? "max-h-[110px] overflow-hidden" : ""
            }`}
          >
            {description}
          </div>

          {description.length>180 &&
            <button
              type='button'
              onClick={()=>setMore(prev=>!prev)}
              className='mt-2 text-[14px] font-semibold text-[#0a66c2] hover:text-[#004182]'
            >
              {more ? "Show less" : "Read more"}
            </button>
          }

        </div>
      }

      {/* POST IMAGE */}
      {image &&
        <div className='w-full bg-gray-50 flex justify-center border-y border-gray-100'>
          <img
            src={image}
            alt=''
            className='w-full max-h-[520px] object-contain'
          />
        </div>
      }

      {/* LIKE / COMMENT COUNT */}
      <div className='px-5 sm:px-6 py-3 flex items-center justify-between border-b border-gray-200'>

        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <div className='w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center'>
            <BiLike className='w-4 h-4 text-[#0a66c2]'/>
          </div>

          <span>
            {likes.length} {likes.length===1 ? "Like" : "Likes"}
          </span>
        </div>

        <button
          type='button'
          onClick={()=>setShowComment(prev=>!prev)}
          className='text-sm text-gray-500 hover:text-[#0a66c2] transition'
        >
          {comments.length} {comments.length===1 ? "comment" : "comments"}
        </button>

      </div>

      {/* ACTIONS */}
      <div className='px-4 sm:px-5 py-2 flex items-center gap-1 border-b border-gray-100'>

        {/* LIKE */}
        <button
          type='button'
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition ${
            userData?._id && likes.includes(userData._id)
              ? "text-[#0a66c2] bg-blue-50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {userData?._id && likes.includes(userData._id) ? (
            <BiSolidLike className='w-5 h-5'/>
          ):(
            <BiLike className='w-5 h-5'/>
          )}

          <span className='text-sm font-semibold'>
            {userData?._id && likes.includes(userData._id)
              ? "Liked"
              : "Like"
            }
          </span>
        </button>

        {/* COMMENT */}
        <button
          type='button'
          onClick={()=>setShowComment(prev=>!prev)}
          className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition'
        >
          <FaRegCommentDots className='w-5 h-5'/>

          <span className='text-sm font-semibold'>
            Comment
          </span>
        </button>

      </div>

      {/* COMMENTS */}
      {showComment &&
        <div className='px-5 sm:px-6 py-4 bg-gray-50/70'>

          {/* COMMENT INPUT */}
          <form
            onSubmit={handleComment}
            className='flex items-center gap-3 mb-4'
          >

            <div className='w-9 h-9 rounded-full overflow-hidden shrink-0'>
              <img
                src={userData?.profileImage || dp}
                alt=''
                className='w-full h-full object-cover'
              />
            </div>

            <div className='flex-1 flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 focus-within:border-[#0a66c2] focus-within:ring-2 focus-within:ring-blue-50'>

              <input
                type='text'
                placeholder='Write a comment...'
                className='flex-1 outline-none border-none bg-transparent text-sm text-gray-800'
                value={commentContent}
                onChange={(e)=>setCommentContent(e.target.value)}
              />

              <button
                type='submit'
                disabled={!commentContent.trim()}
                className='w-8 h-8 rounded-full flex items-center justify-center text-[#0a66c2] hover:bg-blue-50 disabled:text-gray-300 disabled:hover:bg-transparent transition'
              >
                <LuSendHorizontal className='w-5 h-5'/>
              </button>

            </div>

          </form>

          {/* COMMENT LIST */}
          {comments.length>0 ? (
            <div className='flex flex-col gap-3'>

              {comments.map((com)=>(
                <div
                  key={com._id}
                  className='flex items-start gap-3'
                >

                  <div className='w-9 h-9 rounded-full overflow-hidden shrink-0'>
                    <img
                      src={com?.user?.profileImage || dp}
                      alt=''
                      className='w-full h-full object-cover'
                    />
                  </div>

                  <div className='bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 min-w-0 flex-1'>

                    <div className='text-sm font-semibold text-gray-900'>
                      {`${com?.user?.firstName || ""} ${com?.user?.lastName || ""}`}
                    </div>

                    <div className='text-sm text-gray-700 mt-1 leading-5 break-words'>
                      {com?.content}
                    </div>

                  </div>

                </div>
              ))}

            </div>
          ):(
            <div className='text-center py-5 text-sm text-gray-500'>
              No comments yet. Be the first to comment.
            </div>
          )}

        </div>
      }

    </div>
  )
}

export default Post