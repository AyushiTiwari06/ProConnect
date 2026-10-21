import React, { useContext, useState } from 'react'
import logo from "../assets/logo.png"
import {useNavigate} from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/UserContext'

function Login() {
  let [show,setShow]=useState(false)
  let {serverUrl}=useContext(authDataContext)
  let {userData,setUserData}=useContext(userDataContext)
  let navigate=useNavigate()
  let [email,setEmail]=useState("")
  let [password,setPassword]=useState("")
  let [loading,setLoading]=useState(false)
  let [err,setErr]=useState("")

  const handleSignIn=async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl+"/api/auth/login",{
        email,
        password
      },{withCredentials:true})
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setEmail("")
      setPassword("")
    } catch (error) {
      setErr(error.response.data.message)
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#f4f6f8] flex flex-col'>

      {/* Logo */}
      <div className='w-full h-[80px] bg-white flex items-center px-6 sm:px-10 border-b border-gray-200'>
        <img
          src={logo}
          alt=""
          className='w-[120px] sm:w-[135px]'
        />
      </div>

      {/* Login Area */}
      <div className='flex-1 flex items-center justify-center px-4 py-10'>

        <form
          className='w-full max-w-[430px] bg-white rounded-2xl shadow-lg border border-gray-200 p-7 sm:p-9'
          onSubmit={handleSignIn}
        >

          <div className='mb-8'>

            <h1 className='text-gray-900 text-[30px] sm:text-[34px] font-bold'>
              Welcome back
            </h1>

            <p className='text-gray-500 text-[15px] mt-2'>
              Sign in to continue to ProConnect
            </p>

          </div>

          {/* Email */}
          <div className='mb-5'>

            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Email
            </label>

            <input
              type="email"
              placeholder='Enter your email'
              required
              className='w-full h-[50px] border border-gray-300 focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-[16px] px-4 rounded-lg transition'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

          </div>

          {/* Password */}
          <div className='mb-3'>

            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Password
            </label>

            <div className='w-full h-[50px] border border-gray-300 focus-within:border-[#0a66c2] focus-within:ring-2 focus-within:ring-blue-100 rounded-lg relative transition'>

              <input
                type={show?"text":"password"}
                placeholder='Enter your password'
                required
                className='w-full h-full border-none outline-none text-gray-800 text-[16px] px-4 pr-20 rounded-lg'
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

          {/* Error */}
          {err &&
            <div className='mt-3 px-3 py-2 rounded-lg bg-red-50 border border-red-100'>
              <p className='text-center text-red-500 text-sm'>
                *{err}
              </p>
            </div>
          }

          {/* Sign In */}
          <button
            className='w-full h-[50px] rounded-full bg-[#0a66c2] hover:bg-[#004182] mt-7 text-white font-semibold transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm'
            disabled={loading}
          >
            {loading?"Loading...":"Sign In"}
          </button>

          {/* Divider */}
          <div className='flex items-center gap-3 my-6'>

            <div className='flex-1 h-px bg-gray-200'></div>

            <span className='text-xs text-gray-400'>
              OR
            </span>

            <div className='flex-1 h-px bg-gray-200'></div>

          </div>

          {/* Sign Up */}
          <p
            className='text-center text-sm text-gray-600'
          >
            Want to create a new account?

            <span
              className='text-[#0a66c2] font-semibold cursor-pointer ml-1 hover:underline'
              onClick={()=>navigate("/signup")}
            >
              Sign Up
            </span>

          </p>

        </form>

      </div>

      {/* Footer */}
      <div className='text-center text-xs text-gray-400 pb-6'>
        © 2026 ProConnect
      </div>

    </div>
  )
}

export default Login
