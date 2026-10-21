import React, { useContext, useEffect, useState } from 'react'
import logo2 from "../assets/logo2.png"
import { IoSearchSharp } from "react-icons/io5"
import { TiHome } from "react-icons/ti"
import { FaUserGroup } from "react-icons/fa6"
import { IoNotificationsSharp } from "react-icons/io5"
import { FiMessageCircle } from "react-icons/fi"
import dp from "../assets/dp.webp"
import { userDataContext } from '../context/UserContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate, NavLink } from 'react-router-dom'

function Nav() {
  let [activeSearch, setActiveSearch] = useState(false)
  let { userData, setUserData, handleGetProfile } = useContext(userDataContext)
  let [showPopup, setShowPopup] = useState(false)
  let navigate = useNavigate()
  let { serverUrl } = useContext(authDataContext)
  let [searchInput, setSearchInput] = useState("")
  let [searchData, setSearchData] = useState([])
  let [searchLoading, setSearchLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      let result = await axios.get(
        serverUrl + "/api/auth/logout",
        { withCredentials: true }
      )
      setUserData(null)
      navigate("/login")
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = async () => {
    let query = searchInput.trim()

    // Don't call backend when search box is empty
    if (!query) {
      setSearchData([])
      setSearchLoading(false)
      return
    }

    try {
      setSearchLoading(true)

      let result = await axios.get(
        `${serverUrl}/api/user/search?query=${encodeURIComponent(query)}`,
        { withCredentials: true }
      )

      console.log("SEARCH DATA:", result.data)

      if (Array.isArray(result.data)) {
        setSearchData(result.data)
      } else if (Array.isArray(result.data.users)) {
        setSearchData(result.data.users)
      } else if (Array.isArray(result.data.data)) {
        setSearchData(result.data.data)
      } else {
        setSearchData([])
      }

    } catch (error) {
      console.log(
        "Search error:",
        error.response?.data || error.message
      )
      setSearchData([])
    } finally {
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [searchInput])

  const handleCloseSearch = () => {
    setActiveSearch(false)
    setSearchInput("")
    setSearchData([])
  }

  const handleProfileClick = (userName) => {
    setSearchData([])
    setSearchInput("")
    setActiveSearch(false)
    handleGetProfile(userName)
  }

  return (
    <div className='w-full h-[72px] bg-white fixed top-0 left-0 z-[80] border-b border-gray-200 shadow-sm'>
      <div className='w-full h-full max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8 flex items-center justify-between'>

        {/* Left section */}
        <div className='flex items-center gap-3 relative'>

          <div
            className='cursor-pointer shrink-0'
            onClick={() => {
              handleCloseSearch()
              navigate("/")
            }}
          >
            <img
              src={logo2}
              alt="ProConnect"
              className='w-[46px] h-[46px] object-contain'
            />
          </div>

          {/* Desktop search */}
          <div className='hidden lg:flex relative w-[300px] xl:w-[380px]'>
            <div className='w-full h-[42px] bg-[#f4f6f8] border border-gray-200 rounded-full flex items-center px-4 gap-2 focus-within:border-[#0a66c2] focus-within:bg-white transition'>
              <IoSearchSharp className='w-5 h-5 text-gray-500 shrink-0' />
              <input
                type='text'
                className='w-full h-full bg-transparent outline-none border-0 text-sm text-gray-800 placeholder:text-gray-500'
                placeholder='Search users...'
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
              />
              {searchInput && (
                <button
                  type='button'
                  className='text-gray-400 hover:text-gray-700 text-lg'
                  onClick={() => setSearchInput("")}
                >
                  ×
                </button>
              )}
            </div>

            {/* Desktop search results */}
            {searchData.length > 0 && (
              <div className='absolute top-[52px] left-0 w-[360px] xl:w-[450px] max-h-[430px] bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden'>
                <div className='px-5 py-4 border-b border-gray-100'>
                  <div className='text-sm font-semibold text-gray-800'>
                    Search results
                  </div>
                  <div className='text-xs text-gray-500 mt-1'>
                    People matching "{searchInput}"
                  </div>
                </div>

                <div className='max-h-[350px] overflow-y-auto p-2'>
                  {searchData.map((sea, index) => (
                    <div
                      key={sea?._id || index}
                      className='flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition'
                      onClick={() => handleProfileClick(sea.userName)}
                    >
                      <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0'>
                        <img
                          src={sea?.profileImage || dp}
                          alt=''
                          className='w-full h-full object-cover'
                        />
                      </div>

                      <div className='min-w-0'>
                        <div className='text-[15px] font-semibold text-gray-900 truncate'>
                          {`${sea?.firstName || ""} ${sea?.lastName || ""}`}
                        </div>
                        <div className='text-[13px] text-gray-500 truncate mt-0.5'>
                          {sea?.headline || "ProConnect member"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchLoading && searchInput.trim() && (
              <div className='absolute top-[52px] left-0 w-[360px] xl:w-[450px] bg-white rounded-2xl border border-gray-200 shadow-xl p-5'>
                <div className='text-sm text-gray-500'>
                  Searching...
                </div>
              </div>
            )}

            {!searchLoading && searchInput.trim() && searchData.length === 0 && (
              <div className='absolute top-[52px] left-0 w-[360px] xl:w-[450px] bg-white rounded-2xl border border-gray-200 shadow-xl p-5'>
                <div className='text-sm font-semibold text-gray-700'>
                  No users found
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Try searching with a different name or username.
                </div>
              </div>
            )}
          </div>

          {/* Mobile search icon */}
          <button
            type='button'
            className='lg:hidden w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition'
            onClick={() => setActiveSearch(true)}
          >
            <IoSearchSharp className='w-5 h-5 text-gray-600' />
          </button>

          {/* Mobile search */}
          {activeSearch && (
            <div className='lg:hidden fixed top-0 left-0 w-full h-[72px] bg-white border-b border-gray-200 px-3 flex items-center gap-2 z-[90]'>
              <button
                type='button'
                className='w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600'
                onClick={handleCloseSearch}
              >
                ←
              </button>

              <div className='flex-1 h-[42px] bg-[#f4f6f8] border border-gray-200 rounded-full flex items-center px-4 gap-2'>
                <IoSearchSharp className='w-5 h-5 text-gray-500' />
                <input
                  autoFocus
                  type='text'
                  className='w-full h-full bg-transparent outline-none text-sm'
                  placeholder='Search users...'
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
                {searchInput && (
                  <button
                    type='button'
                    className='text-gray-400 hover:text-gray-700 text-lg'
                    onClick={() => setSearchInput("")}
                  >
                    ×
                  </button>
                )}
              </div>

              {searchData.length > 0 && (
                <div className='absolute top-[64px] left-3 right-3 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden'>
                  <div className='px-4 py-3 border-b border-gray-100'>
                    <div className='text-sm font-semibold text-gray-800'>
                      Search results
                    </div>
                  </div>

                  <div className='max-h-[420px] overflow-y-auto p-2'>
                    {searchData.map((sea, index) => (
                      <div
                        key={sea?._id || index}
                        className='flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer'
                        onClick={() => handleProfileClick(sea.userName)}
                      >
                        <div className='w-11 h-11 rounded-full overflow-hidden bg-gray-100 shrink-0'>
                          <img
                            src={sea?.profileImage || dp}
                            alt=''
                            className='w-full h-full object-cover'
                          />
                        </div>

                        <div className='min-w-0'>
                          <div className='text-sm font-semibold text-gray-900 truncate'>
                            {`${sea?.firstName || ""} ${sea?.lastName || ""}`}
                          </div>
                          <div className='text-xs text-gray-500 truncate'>
                            {sea?.headline || "ProConnect member"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!searchLoading && searchInput.trim() && searchData.length === 0 && (
                <div className='absolute top-[64px] left-3 right-3 bg-white rounded-2xl border border-gray-200 shadow-xl p-5'>
                  <div className='text-sm font-semibold text-gray-700'>
                    No users found
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right section */}
        <div className='flex items-center gap-1 sm:gap-3'>

          {/* Home */}
          <div
            className='hidden lg:flex min-w-[70px] h-[58px] flex-col items-center justify-center cursor-pointer text-gray-600 hover:text-[#0a66c2] transition'
            onClick={() => navigate("/")}
          >
            <TiHome className='w-6 h-6' />
            <div className='text-[11px] font-medium mt-0.5'>
              Home
            </div>
          </div>

          {/* Network */}
          <div
            className='hidden md:flex min-w-[80px] h-[58px] flex-col items-center justify-center text-gray-600 hover:text-[#0a66c2] cursor-pointer transition'
            onClick={() => navigate("/network")}
          >
            <FaUserGroup className='w-5 h-5' />
            <div className='text-[11px] font-medium mt-1'>
              My Network
            </div>
          </div>

          {/* Notifications */}
          <div
            className='flex min-w-[60px] h-[58px] flex-col items-center justify-center text-gray-600 hover:text-[#0a66c2] cursor-pointer transition'
            onClick={() => navigate("/notification")}
          >
            <IoNotificationsSharp className='w-5 h-5' />
            <div className='hidden md:block text-[11px] font-medium mt-1'>
              Notifications
            </div>
          </div>

          {/* Messages */}

          <NavLink
            to="/chat"
            className={({ isActive }) => `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition ${isActive
                ? "text-[#0a66c2] bg-blue-50"
                : "text-gray-600 hover:text-[#0a66c2] hover:bg-gray-50"
              }`}
          >
            <FiMessageCircle className='w-5 h-5' />
            <span className='text-xs font-medium'>Messages</span>
          </NavLink>


          {/* Profile */}
          <div className='relative'>
            <div
              className='w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden cursor-pointer border-2 border-white ring-1 ring-gray-200 hover:ring-[#0a66c2] transition'
              onClick={() => setShowPopup(prev => !prev)}
            >
              <img
                src={userData?.profileImage || dp}
                alt=''
                className='w-full h-full object-cover'
              />
            </div>

            {/* Profile popup */}
            {showPopup && (
              <>
                <div
                  className='fixed inset-0 z-[-1]'
                  onClick={() => setShowPopup(false)}
                ></div>

                <div className='absolute right-0 top-[54px] w-[290px] bg-white rounded-2xl border border-gray-200 shadow-xl p-5 z-[100]'>

                  <div className='flex items-center gap-3 pb-5 border-b border-gray-100'>
                    <div className='w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0'>
                      <img
                        src={userData?.profileImage || dp}
                        alt=''
                        className='w-full h-full object-cover'
                      />
                    </div>

                    <div className='min-w-0'>
                      <div className='text-[16px] font-bold text-gray-900 truncate'>
                        {`${userData?.firstName || ""} ${userData?.lastName || ""}`}
                      </div>
                      <div className='text-[13px] text-gray-500 truncate mt-1'>
                        {userData?.headline || "ProConnect member"}
                      </div>
                    </div>
                  </div>

                  <div className='pt-4'>
                    <button
                      className='w-full h-10 rounded-full border-2 border-[#0a66c2] text-[#0a66c2] font-semibold text-sm hover:bg-blue-50 transition'
                      onClick={() => {
                        setShowPopup(false)
                        handleGetProfile(userData?.userName)
                      }}
                    >
                      View Profile
                    </button>
                  </div>

                  <div className='py-4 border-b border-gray-100'>
                    <div
                      className='flex items-center gap-3 px-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer transition'
                      onClick={() => {
                        setShowPopup(false)
                        navigate("/network")
                      }}
                    >
                      <FaUserGroup className='w-5 h-5' />
                      <span className='text-sm font-medium'>
                        My Network
                      </span>
                    </div>
                  </div>

                  <button
                    className='w-full h-10 mt-4 rounded-full border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition'
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nav