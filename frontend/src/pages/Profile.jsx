import React,{useContext,useEffect,useState} from 'react'
import Nav from '../components/Nav.jsx'
import dp from "../assets/dp.webp"
import {FiPlus,FiCamera} from "react-icons/fi"
import {userDataContext} from '../context/UserContext.jsx'
import {HiPencil} from "react-icons/hi2"
import {authDataContext} from '../context/AuthContext.jsx'
import EditProfile from '../components/EditProfile.jsx'
import Post from '../components/Post.jsx'
import ConnectionButton from '../components/ConnectionButton.jsx'

function Profile(){
  let {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    profileData,
    setProfileData
  }=useContext(userDataContext)

  let [profilePost,setProfilePost]=useState([])
  let {serverUrl}=useContext(authDataContext)

  useEffect(()=>{
    if(Array.isArray(postData) && profileData?._id){
      setProfilePost(
        postData.filter((post)=>post.author?._id==profileData._id)
      )
    }else{
      setProfilePost([])
    }
  },[profileData,postData])

  return(
    <div className='w-full min-h-[100vh] bg-[#f4f6f8] flex flex-col items-center pt-[100px] pb-[50px] px-3 sm:px-5'>
      <Nav/>

      {edit && <EditProfile/>}

      <div className='w-full max-w-[950px] flex flex-col gap-4'>

        {/* PROFILE HEADER */}
        <div className='relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>

          {/* Cover Image */}
          <div className='w-full h-[180px] sm:h-[220px] bg-gradient-to-r from-[#0a66c2] via-[#168bd6] to-[#38bdf8] relative'>
            {profileData?.coverImage &&
              <img
                src={profileData.coverImage}
                alt=""
                className='w-full h-full object-cover'
              />
            }

            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>

            <div className='absolute right-5 top-5 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md'>
              <FiCamera className='w-5 h-5 text-gray-700'/>
            </div>
          </div>

          {/* Profile Information */}
          <div className='px-5 sm:px-8 pb-7 relative'>

            {/* Profile Image */}
            <div className='w-[110px] h-[110px] sm:w-[125px] sm:h-[125px] rounded-full overflow-hidden bg-white p-1 absolute -top-[55px] sm:-top-[62px] left-5 sm:left-8 shadow-lg'>
              <img
                src={profileData?.profileImage || dp}
                alt=""
                className='w-full h-full rounded-full object-cover'
              />
            </div>

            <div className='pt-[70px] sm:pt-[78px]'>
              <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5'>

                <div>
                  <div className='text-[25px] sm:text-[28px] font-bold text-gray-900'>
                    {`${profileData?.firstName || ""} ${profileData?.lastName || ""}`}
                  </div>

                  <div className='text-[16px] sm:text-[17px] font-medium text-gray-600 mt-1'>
                    {profileData?.headline || ""}
                  </div>

                  <div className='text-[14px] text-gray-500 mt-2'>
                    {profileData?.location || ""}
                  </div>

                  <div className='text-[14px] text-[#0a66c2] font-semibold mt-2'>
                    {`${profileData?.connection?.length || 0} ${profileData?.connection?.length === 1 ? "connection" : "connections"}`}
                  </div>
                </div>

                <div className='flex items-center'>
                  {profileData?._id==userData?._id &&
                    <button
                      className='min-w-[145px] h-[42px] px-5 rounded-full border-2 border-[#0a66c2] text-[#0a66c2] font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition'
                      onClick={()=>setEdit(true)}
                    >
                      Edit Profile
                      <HiPencil className='w-4 h-4'/>
                    </button>
                  }

                  {profileData?._id!=userData?._id && profileData?._id &&
                    <div>
                      <ConnectionButton userId={profileData._id}/>
                    </div>
                  }
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* POSTS HEADER */}
        <div className='w-full bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden'>
          <div className='px-6 py-5'>
            <div className='text-[20px] font-bold text-gray-800'>
              Posts
            </div>

            <div className='text-sm text-gray-500 mt-1'>
              {profilePost.length} posts
            </div>
          </div>
        </div>

        {/* POSTS */}
        {profilePost.map((post,index)=>(
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

        {/* SKILLS */}
        {profileData?.skills?.length>0 &&
          <div className='w-full bg-white shadow-sm border border-gray-200 rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-5'>
              <div>
                <div className='text-[20px] font-bold text-gray-800'>
                  Skills
                </div>

                <div className='text-sm text-gray-500 mt-1'>
                  Professional skills and expertise
                </div>
              </div>

              {profileData?._id==userData?._id &&
                <button
                  className='hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] font-semibold hover:bg-blue-50 transition'
                  onClick={()=>setEdit(true)}
                >
                  <FiPlus/>
                  Add Skills
                </button>
              }
            </div>

            <div className='flex flex-wrap gap-3'>
              {profileData?.skills?.map((skill,index)=>(
                <div
                  key={index}
                  className='px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#0a66c2] text-sm font-semibold'
                >
                  {skill}
                </div>
              ))}
            </div>

            {profileData?._id==userData?._id &&
              <button
                className='sm:hidden mt-5 px-4 py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] font-semibold flex items-center gap-2'
                onClick={()=>setEdit(true)}
              >
                <FiPlus/>
                Add Skills
              </button>
            }
          </div>
        }

        {/* EDUCATION */}
        {profileData?.education?.length>0 &&
          <div className='w-full bg-white shadow-sm border border-gray-200 rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <div className='text-[20px] font-bold text-gray-800'>
                  Education
                </div>

                <div className='text-sm text-gray-500 mt-1'>
                  Academic background
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-6'>
              {profileData?.education?.map((edu,index)=>(
                <div
                  key={index}
                  className='flex gap-4'
                >
                  <div className='w-11 h-11 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center'>
                    <span className='text-[#0a66c2] font-bold text-lg'>
                      E
                    </span>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <div className='text-[16px] font-bold text-gray-800'>
                      {edu.college}
                    </div>

                    <div className='text-[14px] text-gray-600'>
                      {edu.degree}
                    </div>

                    <div className='text-[14px] text-gray-500'>
                      {edu.fieldOfStudy}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {profileData?._id==userData?._id &&
              <button
                className='mt-6 px-5 py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] font-semibold hover:bg-blue-50 transition'
                onClick={()=>setEdit(true)}
              >
                Add Education
              </button>
            }
          </div>
        }

        {/* EXPERIENCE */}
        {profileData?.experience?.length>0 &&
          <div className='w-full bg-white shadow-sm border border-gray-200 rounded-2xl p-6'>
            <div className='mb-6'>
              <div className='text-[20px] font-bold text-gray-800'>
                Experience
              </div>

              <div className='text-sm text-gray-500 mt-1'>
                Professional experience
              </div>
            </div>

            <div className='flex flex-col gap-7'>
              {profileData?.experience?.map((ex,index)=>(
                <div
                  key={index}
                  className='flex gap-4'
                >
                  <div className='w-11 h-11 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center'>
                    <span className='text-[#0a66c2] font-bold text-lg'>
                      E
                    </span>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <div className='text-[17px] font-bold text-gray-800'>
                      {ex.title}
                    </div>

                    <div className='text-[15px] font-medium text-gray-600'>
                      {ex.company}
                    </div>

                    <div className='text-[14px] text-gray-500 leading-6 mt-1'>
                      {ex.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {profileData?._id==userData?._id &&
              <button
                className='mt-6 px-5 py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] font-semibold hover:bg-blue-50 transition'
                onClick={()=>setEdit(true)}
              >
                Add Experience
              </button>
            }
          </div>
        }

      </div>
    </div>
  )
}

export default Profile