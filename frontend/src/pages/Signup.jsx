import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import {useNavigate} from "react-router-dom"
import { authDataContext } from '../context/AuthContext.jsx'
import axios from "axios"
import { userDataContext } from '../context/UserContext.jsx'

function Signup() {
  let [show,setShow]=useState(false)
  let {serverUrl}=useContext(authDataContext)
  let {userData,setUserData}=useContext(userDataContext)
  let navigate=useNavigate()
  let [firstName,setFirstName]=useState("")
  let [lastName,setLastName]=useState("")
  let [userName,setUserName]=useState("")
  let [email,setEmail]=useState("")
  let [password,setPassword]=useState("")
  let [loading,setLoading]=useState(false)
  let [err,setErr]=useState("")

  const handleSignUp=async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl+"/api/auth/signup",{
        firstName,
        lastName,
        userName,
        email,
        password
      },{withCredentials:true})
      console.log(result)
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setUserName("")
    } catch (error) {
      setErr(error.response?.data?.message || "Unable to connect to server")
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#f4f6f8] flex flex-col'>
      <div className='w-full h-[80px] bg-white flex items-center px-6 sm:px-10 border-b border-gray-200'>
        <img src={logo} alt="" className='w-[120px] sm:w-[135px]'/>
      </div>

      <div className='flex-1 flex items-center justify-center px-4 py-8'>
        <form
          className='w-full max-w-[480px] bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8'
          onSubmit={handleSignUp}
        >
          <div className='mb-7'>
            <h1 className='text-gray-900 text-[30px] sm:text-[34px] font-bold'>
              Create your account
            </h1>
            <p className='text-gray-500 text-[15px] mt-2'>
              Join ProConnect and start building your professional network
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                First name
              </label>
              <input
                type="text"
                placeholder='Enter first name'
                required
                className='w-full h-[50px] border border-gray-300 focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-[15px] px-4 rounded-lg transition'
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Last name
              </label>
              <input
                type="text"
                placeholder='Enter last name'
                required
                className='w-full h-[50px] border border-gray-300 focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-[15px] px-4 rounded-lg transition'
                value={lastName}
                onChange={(e)=>setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className='mt-4'>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Username
            </label>
            <input
              type="text"
              placeholder='Choose a username'
              required
              className='w-full h-[50px] border border-gray-300 focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-[15px] px-4 rounded-lg transition'
              value={userName}
              onChange={(e)=>setUserName(e.target.value)}
            />
          </div>

          <div className='mt-4'>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Email
            </label>
            <input
              type="email"
              placeholder='Enter your email'
              required
              className='w-full h-[50px] border border-gray-300 focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-[15px] px-4 rounded-lg transition'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className='mt-4'>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Password
            </label>

            <div className='w-full h-[50px] border border-gray-300 focus-within:border-[#0a66c2] focus-within:ring-2 focus-within:ring-blue-100 rounded-lg relative transition'>
              <input
                type={show?"text":"password"}
                placeholder='Create a password'
                required
                className='w-full h-full border-none outline-none text-gray-800 text-[15px] px-4 pr-20 rounded-lg'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />

              <span
                className='absolute right-4 top-1/2 -translate-y-1/2 text-[#0a66c2] cursor-pointer font-semibold text-sm hover:text-[#004182]'
                onClick={()=>setShow(prev=>!prev)}
              >
                {show?"Hide":"Show"}
              </span>
            </div>
          </div>

          {err &&
            <div className='mt-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100'>
              <p className='text-center text-red-500 text-sm'>
                *{err}
              </p>
            </div>
          }

          <button
            className='w-full h-[50px] rounded-full bg-[#0a66c2] hover:bg-[#004182] mt-7 text-white font-semibold transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm'
            disabled={loading}
          >
            {loading?"Creating account...":"Create Account"}
          </button>

          <div className='flex items-center gap-3 my-6'>
            <div className='flex-1 h-px bg-gray-200'></div>
            <span className='text-xs text-gray-400'>OR</span>
            <div className='flex-1 h-px bg-gray-200'></div>
          </div>

          <p className='text-center text-sm text-gray-600'>
            Already have an account?
            <span
              className='text-[#0a66c2] font-semibold cursor-pointer ml-1 hover:underline'
              onClick={()=>navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </form>
      </div>

      <div className='text-center text-xs text-gray-400 pb-6'>
        © 2026 ProConnect
      </div>
    </div>
  )
}

export default Signup