import { Link, useLocation } from 'react-router-dom'
import { 
  FaHome, 
  FaPlusCircle, 
  FaVideo, 
  FaChartBar, 
  FaSignOutAlt 
} from 'react-icons/fa'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/interviewer/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/interviewer/create-room', icon: FaPlusCircle, label: 'Create Room' },
    { path: '/interviewer/live-monitoring', icon: FaVideo, label: 'Live Monitoring' },
    { path: '/interviewer/report', icon: FaChartBar, label: 'Reports' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold">Interview System</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-4 transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="mr-3 text-lg" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-6 border-t border-gray-700">
        <Link
          to="/"
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <FaSignOutAlt className="mr-3" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
