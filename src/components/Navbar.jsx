import { FaUserCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserName(user.name || "User")
      } catch (e) {
        console.error("Error parsing user from local storage", e)
      }
    }
  }, [])

  return (
    <div className="bg-white shadow-md h-16 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">{userName}</span>
        <FaUserCircle className="text-3xl text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
      </div>
    </div>
  )
}

export default Navbar


