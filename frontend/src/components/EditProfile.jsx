import React,{useContext,useRef,useState} from 'react'
import {RxCross1} from "react-icons/rx"
import {userDataContext} from '../context/UserContext'
import dp from "../assets/dp.webp"
import {FiPlus,FiCamera} from "react-icons/fi"
import axios from 'axios'
import {authDataContext} from '../context/AuthContext'

function EditProfile(){
  let {
    edit,
    setEdit,
    userData,
    setUserData,
    setProfileData
  }=useContext(userDataContext)

  let {serverUrl}=useContext(authDataContext)

  let [firstName,setFirstName]=useState(userData.firstName || "")
  let [lastName,setLastName]=useState(userData.lastName || "")
  let [userName,setUserName]=useState(userData.userName || "")
  let [headline,setHeadline]=useState(userData.headline || "")
  let [location,setLocation]=useState(userData.location || "")
  let [gender,setGender]=useState(userData.gender || "")
  let [skills,setSkills]=useState(userData.skills || [])
  let [newSkills,setNewSkills]=useState("")
  let [education,setEducation]=useState(userData.education || [])
  let [newEducation,setNewEducation]=useState({
    college:"",
    degree:"",
    fieldOfStudy:""
  })
  let [experience,setExperience]=useState(userData.experience || [])
  let [newExperience,setNewExperience]=useState({
    title:"",
    company:"",
    description:""
  })

  let [frontendProfileImage,setFrontendProfileImage]=useState(
    userData.profileImage || dp
  )
  let [backendProfileImage,setBackendProfileImage]=useState(null)
  let [frontendCoverImage,setFrontendCoverImage]=useState(
    userData.coverImage || null
  )
  let [backendCoverImage,setBackendCoverImage]=useState(null)
  let [saving,setSaving]=useState(false)

  const profileImage=useRef()
  const coverImage=useRef()

  function addSkill(e){
    e.preventDefault()

    if(newSkills.trim() && !skills.includes(newSkills.trim())){
      setSkills([...skills,newSkills.trim()])
      setNewSkills("")
    }
  }

  function removeSkill(skill){
    setSkills(skills.filter((item)=>item!==skill))
  }

  function addEducation(e){
    e.preventDefault()

    if(
      newEducation.college.trim() ||
      newEducation.degree.trim() ||
      newEducation.fieldOfStudy.trim()
    ){
      setEducation([...education,newEducation])
      setNewEducation({
        college:"",
        degree:"",
        fieldOfStudy:""
      })
    }
  }

  function removeEducation(index){
    setEducation(education.filter((_,i)=>i!==index))
  }

  function addExperience(e){
    e.preventDefault()

    if(
      newExperience.title.trim() ||
      newExperience.company.trim() ||
      newExperience.description.trim()
    ){
      setExperience([...experience,newExperience])
      setNewExperience({
        title:"",
        company:"",
        description:""
      })
    }
  }

  function removeExperience(index){
    setExperience(experience.filter((_,i)=>i!==index))
  }

  const handleProfileImage=(e)=>{
    let file=e.target.files[0]

    if(file){
      setBackendProfileImage(file)
      setFrontendProfileImage(URL.createObjectURL(file))
    }
  }

  const handleCoverImage=(e)=>{
    let file=e.target.files[0]

    if(file){
      setBackendCoverImage(file)
      setFrontendCoverImage(URL.createObjectURL(file))
    }
  }

  const handleSaveProfile=async()=>{
    try{
      setSaving(true)

      let formData=new FormData()

      formData.append("firstName",firstName)
      formData.append("lastName",lastName)
      formData.append("userName",userName)
      formData.append("headline",headline)
      formData.append("location",location)
      formData.append("skills",JSON.stringify(skills))
      formData.append("education",JSON.stringify(education))
      formData.append("experience",JSON.stringify(experience))

      if(backendProfileImage){
        formData.append("profileImage",backendProfileImage)
      }

      if(backendCoverImage){
        formData.append("coverImage",backendCoverImage)
      }

      let result=await axios.put(
        serverUrl+"/api/user/updateprofile",
        formData,
        {withCredentials:true}
      )

      setUserData(result.data)
      setProfileData(result.data)
      setEdit(false)

    }catch(error){
      console.log(
        "Update profile error:",
        error.response?.data || error.message
      )
    }finally{
      setSaving(false)
    }
  }

  return(
    <div className='fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5'>

      <div className='w-full max-w-[720px] max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl'>

        {/* HEADER */}
        <div className='sticky top-0 z-20 bg-white border-b border-gray-200 px-5 sm:px-7 py-4 flex items-center justify-between'>
          <div>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-900'>
              Edit Profile
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Update your professional information
            </p>
          </div>

          <button
            type='button'
            onClick={()=>setEdit(false)}
            className='w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition'
          >
            <RxCross1 className='text-gray-600'/>
          </button>
        </div>

        {/* COVER */}
        <div className='relative'>
          <div className='h-[150px] sm:h-[190px] bg-gradient-to-r from-[#0a66c2] via-[#168bd6] to-[#38bdf8] overflow-hidden'>
            {frontendCoverImage &&
              <img
                src={frontendCoverImage}
                alt=''
                className='w-full h-full object-cover'
              />
            }
          </div>

          <button
            type='button'
            onClick={()=>coverImage.current.click()}
            className='absolute right-4 top-4 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition'
          >
            <FiCamera className='text-gray-700'/>
          </button>

          <input
            ref={coverImage}
            type='file'
            accept='image/*'
            hidden
            onChange={handleCoverImage}
          />

          {/* PROFILE IMAGE */}
          <div className='absolute -bottom-[55px] left-5 sm:left-7'>
            <div className='relative w-[110px] h-[110px] sm:w-[125px] sm:h-[125px] rounded-full bg-white p-1 shadow-xl'>
              <img
                src={frontendProfileImage || dp}
                alt=''
                className='w-full h-full rounded-full object-cover'
              />

              <button
                type='button'
                onClick={()=>profileImage.current.click()}
                className='absolute right-1 bottom-1 w-9 h-9 rounded-full bg-[#0a66c2] text-white flex items-center justify-center border-2 border-white hover:bg-[#004182] transition'
              >
                <FiCamera/>
              </button>
            </div>

            <input
              ref={profileImage}
              type='file'
              accept='image/*'
              hidden
              onChange={handleProfileImage}
            />
          </div>
        </div>

        <div className='px-5 sm:px-7 pt-[75px] pb-7 space-y-7'>

          {/* BASIC INFORMATION */}
          <section>
            <h3 className='text-lg font-bold text-gray-900 mb-4'>
              Basic Information
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

              <div>
                <label className='text-sm font-semibold text-gray-700'>
                  First Name
                </label>
                <input
                  value={firstName}
                  onChange={(e)=>setFirstName(e.target.value)}
                  className='w-full mt-2 h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100'
                />
              </div>

              <div>
                <label className='text-sm font-semibold text-gray-700'>
                  Last Name
                </label>
                <input
                  value={lastName}
                  onChange={(e)=>setLastName(e.target.value)}
                  className='w-full mt-2 h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100'
                />
              </div>

              <div>
                <label className='text-sm font-semibold text-gray-700'>
                  Username
                </label>
                <input
                  value={userName}
                  onChange={(e)=>setUserName(e.target.value)}
                  className='w-full mt-2 h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100'
                />
              </div>

              <div>
                <label className='text-sm font-semibold text-gray-700'>
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e)=>setLocation(e.target.value)}
                  className='w-full mt-2 h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100'
                />
              </div>

              <div className='sm:col-span-2'>
                <label className='text-sm font-semibold text-gray-700'>
                  Headline
                </label>
                <input
                  value={headline}
                  onChange={(e)=>setHeadline(e.target.value)}
                  className='w-full mt-2 h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100'
                />
              </div>

              <div>
                <label className='text-sm font-semibold text-gray-700'>
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e)=>setGender(e.target.value)}
                  className='w-full mt-2 h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100'
                >
                  <option value=''>Select Gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </select>
              </div>

            </div>
          </section>

          {/* SKILLS */}
          <section>
            <h3 className='text-lg font-bold text-gray-900 mb-4'>
              Skills
            </h3>

            <div className='flex flex-wrap gap-2 mb-4'>
              {skills.map((skill,index)=>(
                <div
                  key={index}
                  className='flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 text-[#0a66c2] border border-blue-100 font-medium'
                >
                  <span>{skill}</span>

                  <button
                    type='button'
                    onClick={()=>removeSkill(skill)}
                    className='text-[#0a66c2] hover:text-red-500'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <form
              onSubmit={addSkill}
              className='flex gap-2'
            >
              <input
                value={newSkills}
                onChange={(e)=>setNewSkills(e.target.value)}
                placeholder='Add a skill'
                className='flex-1 h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2]'
              />

              <button
                type='submit'
                className='px-4 h-11 rounded-xl bg-[#0a66c2] text-white hover:bg-[#004182] transition'
              >
                <FiPlus/>
              </button>
            </form>
          </section>

          {/* EDUCATION */}
          <section>
            <h3 className='text-lg font-bold text-gray-900 mb-4'>
              Education
            </h3>

            <div className='space-y-3 mb-4'>
              {education.map((edu,index)=>(
                <div
                  key={index}
                  className='p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start justify-between gap-3'
                >
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {edu.college}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {edu.degree}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {edu.fieldOfStudy}
                    </div>
                  </div>

                  <button
                    type='button'
                    onClick={()=>removeEducation(index)}
                    className='text-gray-400 hover:text-red-500 text-xl'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              <input
                value={newEducation.college}
                onChange={(e)=>setNewEducation({
                  ...newEducation,
                  college:e.target.value
                })}
                placeholder='College'
                className='h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2]'
              />

              <input
                value={newEducation.degree}
                onChange={(e)=>setNewEducation({
                  ...newEducation,
                  degree:e.target.value
                })}
                placeholder='Degree'
                className='h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2]'
              />

              <input
                value={newEducation.fieldOfStudy}
                onChange={(e)=>setNewEducation({
                  ...newEducation,
                  fieldOfStudy:e.target.value
                })}
                placeholder='Field of Study'
                className='h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2]'
              />
            </div>

            <button
              type='button'
              onClick={addEducation}
              className='mt-3 px-4 py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] font-semibold hover:bg-blue-50 transition'
            >
              + Add Education
            </button>
          </section>

          {/* EXPERIENCE */}
          <section>
            <h3 className='text-lg font-bold text-gray-900 mb-4'>
              Experience
            </h3>

            <div className='space-y-3 mb-4'>
              {experience.map((ex,index)=>(
                <div
                  key={index}
                  className='p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start justify-between gap-3'
                >
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {ex.title}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {ex.company}
                    </div>
                    <div className='text-sm text-gray-500 mt-1'>
                      {ex.description}
                    </div>
                  </div>

                  <button
                    type='button'
                    onClick={()=>removeExperience(index)}
                    className='text-gray-400 hover:text-red-500 text-xl'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className='space-y-3'>
              <input
                value={newExperience.title}
                onChange={(e)=>setNewExperience({
                  ...newExperience,
                  title:e.target.value
                })}
                placeholder='Job Title'
                className='w-full h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2]'
              />

              <input
                value={newExperience.company}
                onChange={(e)=>setNewExperience({
                  ...newExperience,
                  company:e.target.value
                })}
                placeholder='Company'
                className='w-full h-11 px-4 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2]'
              />

              <textarea
                value={newExperience.description}
                onChange={(e)=>setNewExperience({
                  ...newExperience,
                  description:e.target.value
                })}
                placeholder='Description'
                rows='3'
                className='w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-[#0a66c2] resize-none'
              />
            </div>

            <button
              type='button'
              onClick={addExperience}
              className='mt-3 px-4 py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] font-semibold hover:bg-blue-50 transition'
            >
              + Add Experience
            </button>
          </section>

        </div>

        {/* SAVE */}
        <div className='sticky bottom-0 bg-white border-t border-gray-200 px-5 sm:px-7 py-4 flex justify-end gap-3'>
          <button
            type='button'
            onClick={()=>setEdit(false)}
            disabled={saving}
            className='px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition disabled:opacity-50'
          >
            Cancel
          </button>

          <button
            type='button'
            onClick={handleSaveProfile}
            disabled={saving}
            className='px-6 py-2.5 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182] transition disabled:opacity-60'
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default EditProfile