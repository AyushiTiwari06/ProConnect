import React, { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav.jsx'
import dp from "../assets/dp.webp"
import { FiPlus, FiCamera } from "react-icons/fi"
import { userDataContext } from '../context/UserContext'
import { HiPencil } from "react-icons/hi2"
import EditProfile from '../components/EditProfile.jsx'
import { RxCross1 } from "react-icons/rx"
import { BsImage } from "react-icons/bs"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'
import Post from '../components/Post.jsx'

function Home() {
  let {userData,setUserData,edit,setEdit,postData,setPostData,getPost,handleGetProfile}=useContext(userDataContext)
  let {serverUrl}=useContext(authDataContext)

  let [frontendImage,setFrontendImage]=useState("")
  let [backendImage,setBackendImage]=useState("")
  let [description,setDescription]=useState("")
  let [uploadPost,setUploadPost]=useState(false)
  let image=useRef()
  let [posting,setPosting]=useState(false)
  let [suggestedUser,setSuggestedUser]=useState([])

  function handleImage(e){
    let file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  async function handleUploadPost(){
    setPosting(true)
    try {
      let formdata=new FormData()
      formdata.append("description",description)

      if(backendImage){
        formdata.append("image",backendImage)
      }

      let result=await axios.post(
        serverUrl+"/api/post/create",
        formdata,
        {withCredentials:true}
      )

      console.log(result)
      setPosting(false)
      setUploadPost(false)
      setDescription("")
      setBackendImage("")
      setFrontendImage("")
      getPost()
    } catch (error) {
      setPosting(false)
      console.log(error)
    }
  }

  const handleSuggestedUsers=async ()=>{
    try {
      let result=await axios.get(
        serverUrl+"/api/user/suggestedusers",
        {withCredentials:true}
      )
      setSuggestedUser(
        Array.isArray(result.data) ? result.data : result.data.users || []
      )
    } catch (error) {
      console.log(error)
      setSuggestedUser([])
    }
  }

  useEffect(()=>{
    handleSuggestedUsers()
  },[])

  useEffect(()=>{
    getPost()
  },[uploadPost])

  return (
    <div className='w-full min-h-screen bg-[#f4f6f8] pt-[95px] pb-[50px] px-3 sm:px-5 lg:px-8'>

      {edit && <EditProfile/>}

      <Nav/>

      <div className='max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start justify-center gap-5'>

        {/* LEFT PROFILE CARD */}
        <div className='w-full lg:w-[27%] xl:w-[25%] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>

          <div
            className='h-[120px] bg-gradient-to-r from-[#0a66c2] via-[#168bd6] to-[#38bdf8] relative cursor-pointer'
            onClick={()=>setEdit(true)}
          >
            <img
              src={userData?.coverImage || null}
              alt=""
              className='w-full h-full object-cover'
            />

            <div className='absolute inset-0 bg-black/10'></div>

            <div className='absolute right-4 top-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm'>
              <FiCamera className='w-5 h-5 text-gray-700'/>
            </div>
          </div>

          <div className='relative px-5 pb-5'>

            <div
              className='w-[82px] h-[82px] rounded-full overflow-hidden bg-white p-1 absolute -top-[41px] left-5 shadow-md cursor-pointer'
              onClick={()=>setEdit(true)}
            >
              <img
                src={userData?.profileImage || dp}
                alt=""
                className='w-full h-full rounded-full object-cover'
              />
            </div>

            <div className='absolute left-[78px] top-[24px] w-6 h-6 bg-[#0a66c2] border-[3px] border-white rounded-full flex justify-center items-center cursor-pointer shadow-sm'>
              <FiPlus className='text-white w-3 h-3'/>
            </div>

            <div className='pt-[55px]'>

              <div className='text-[22px] font-bold text-gray-800'>
                {`${userData?.firstName || ""} ${userData?.lastName || ""}`}
              </div>

              <div className='text-[15px] font-medium text-gray-600 mt-1'>
                {userData?.headline || ""}
              </div>

              <div className='text-[13px] text-gray-500 mt-2'>
                {userData?.location || ""}
              </div>

            </div>

            <button
              className='w-full h-[42px] mt-5 rounded-full border border-[#0a66c2] text-[#0a66c2] font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition duration-200'
              onClick={()=>setEdit(true)}
            >
              Edit Profile
              <HiPencil className='w-4 h-4'/>
            </button>

          </div>
        </div>

        {/* POST MODAL BACKDROP */}
        {uploadPost &&
          <div className='w-full h-full bg-black/60 fixed inset-0 z-[100] backdrop-blur-sm'></div>
        }

        {/* CREATE POST MODAL */}
        {uploadPost &&
          <div className='w-[94%] sm:w-[90%] max-w-[560px] max-h-[90vh] overflow-y-auto bg-white shadow-2xl top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-2xl fixed z-[200] p-5 sm:p-6 flex items-start justify-start flex-col gap-5'>

            <div className='w-full flex items-center justify-between border-b border-gray-200 pb-4'>

              <div className='text-[20px] font-bold text-gray-800'>
                Create a post
              </div>

              <div
                className='w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition'
                onClick={()=>setUploadPost(false)}
              >
                <RxCross1 className='w-4 h-4 text-gray-700'/>
              </div>

            </div>

            <div className='flex justify-start items-center gap-3'>

              <div className='w-12 h-12 rounded-full overflow-hidden flex items-center justify-center'>
                <img
                  src={userData?.profileImage || dp}
                  alt=""
                  className='w-full h-full object-cover'
                />
              </div>

              <div>
                <div className='text-[16px] font-semibold text-gray-800'>
                  {`${userData?.firstName || ""} ${userData?.lastName || ""}`}
                </div>
                <div className='text-xs text-gray-500'>
                  Post to your network
                </div>
              </div>

            </div>

            <textarea
              className={`w-full ${frontendImage?"h-[150px]":"h-[250px]"} outline-none border-none p-1 resize-none text-[17px] text-gray-800 placeholder:text-gray-400`}
              placeholder='What do you want to talk about..?'
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
            ></textarea>

            {frontendImage &&
              <div className='w-full h-[240px] overflow-hidden flex justify-center items-center rounded-xl bg-gray-50 border border-gray-200 relative'>
                <img
                  src={frontendImage}
                  alt=""
                  className='max-w-full max-h-full object-contain rounded-lg'
                />
              </div>
            }

            <input
              type="file"
              ref={image}
              hidden
              onChange={handleImage}
            />

            <div className='w-full flex items-center justify-between border-t border-gray-200 pt-4'>

              <div
                className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer'
                onClick={()=>image.current.click()}
              >
                <BsImage className='w-5 h-5 text-[#0a66c2]'/>
                <span className='text-sm font-medium text-gray-600'>
                  Add photo
                </span>
              </div>

              <button
                className='min-w-[100px] h-[42px] px-5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold transition disabled:opacity-50'
                disabled={posting}
                onClick={handleUploadPost}
              >
                {posting?"Posting..." : "Post"}
              </button>

            </div>

          </div>
        }

        {/* MIDDLE FEED */}
        <div className='w-full lg:w-[50%] xl:w-[48%] flex flex-col gap-4'>

          {/* START A POST */}
          <div className='w-full bg-white shadow-sm border border-gray-200 rounded-2xl p-4'>

            <div className='flex items-center gap-3'>

              <div className='w-12 h-12 rounded-full overflow-hidden shrink-0'>
                <img
                  src={userData?.profileImage || dp}
                  alt=""
                  className='w-full h-full object-cover'
                />
              </div>

              <button
                className='flex-1 h-[48px] border border-gray-300 rounded-full flex items-center justify-start px-5 text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition text-sm sm:text-base'
                onClick={()=>setUploadPost(true)}
              >
                Start a post
              </button>

            </div>

            <div className='flex items-center justify-around mt-4 pt-3 border-t border-gray-100'>

              <button
                className='flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition'
                onClick={()=>setUploadPost(true)}
              >
                <BsImage className='text-[#378fe9] w-5 h-5'/>
                <span className='text-sm font-semibold'>Photo</span>
              </button>

              <button
                className='flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition'
                onClick={()=>setUploadPost(true)}
              >
                <FiCamera className='text-[#e7a33e] w-5 h-5'/>
                <span className='text-sm font-semibold'>Post</span>
              </button>

            </div>

          </div>

          {/* POSTS */}
          <div className='flex flex-col gap-4'>

            {Array.isArray(postData) && postData.map((post,index)=>(
              <Post
                key={post._id || index}
                id={post._id}
                description={post.description}
                author={post.author}
                image={post.image}
                like={post.like}
                comment={post.comment}
                createdAt={post.createdAt}
              />
            ))}

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className='w-full lg:w-[25%] xl:w-[27%] hidden lg:block'>

          <div className='w-full bg-white shadow-sm border border-gray-200 rounded-2xl p-5 sticky top-[100px]'>

            <div className='flex items-center justify-between mb-4'>

              <h1 className='text-[18px] text-gray-800 font-bold'>
                People you may know
              </h1>

            </div>

            {suggestedUser.length>0 &&
              <div className='flex flex-col gap-1'>

                {suggestedUser.map((su,index)=>(
                  <div
                    key={su._id || index}
                    className='flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition group'
                    onClick={()=>handleGetProfile(su.userName)}
                  >

                    <div className='w-11 h-11 rounded-full overflow-hidden shrink-0'>
                      <img
                        src={su.profileImage || dp}
                        alt=""
                        className='w-full h-full object-cover'
                      />
                    </div>

                    <div className='min-w-0 flex-1'>

                      <div className='text-[14px] font-semibold text-gray-800 truncate'>
                        {`${su.firstName} ${su.lastName}`}
                      </div>

                      <div className='text-[12px] text-gray-500 truncate mt-0.5'>
                        {su.headline}
                      </div>

                    </div>

                    <button
                      className='shrink-0 w-8 h-8 rounded-full border border-[#0a66c2] text-[#0a66c2] flex items-center justify-center hover:bg-blue-50 transition'
                    >
                      <FiPlus className='w-4 h-4'/>
                    </button>

                  </div>
                ))}

              </div>
            }

            {suggestedUser.length==0 &&
              <div className='text-sm text-gray-500 py-5 text-center'>
                No Suggested Users
              </div>
            }

            {suggestedUser.length>0 &&
              <div className='border-t border-gray-100 mt-4 pt-4 text-center'>
                <button className='text-sm font-semibold text-[#0a66c2] hover:underline'>
                  Show more
                </button>
              </div>
            }

          </div>

        </div>

      </div>

    </div>
  )
}

export default Home