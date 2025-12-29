import { FaUserCircle } from 'react-icons/fa'

const Navbar = () => {
  return (
    <div className="bg-white shadow-md h-16 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">John Doe</span>
        <FaUserCircle className="text-3xl text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
      </div>
    </div>
  )
}

export default Navbar
