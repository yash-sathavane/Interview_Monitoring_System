import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { FaVideo, FaChartBar, FaPlusCircle, FaClock } from 'react-icons/fa'

const InterviewerDashboard = () => {
  const stats = [
    { label: 'Active Interviews', value: '3', icon: FaVideo, color: 'bg-blue-500' },
    { label: 'Total Reports', value: '24', icon: FaChartBar, color: 'bg-green-500' },
    { label: 'Rooms Created', value: '12', icon: FaPlusCircle, color: 'bg-purple-500' },
    { label: 'Avg. Duration', value: '45m', icon: FaClock, color: 'bg-orange-500' },
  ]

  const recentInterviews = [
    { id: 'ABC123', candidate: 'Alice Johnson', status: 'Active', time: '15:30' },
    { id: 'DEF456', candidate: 'Bob Smith', status: 'Completed', time: '14:20' },
    { id: 'GHI789', candidate: 'Charlie Brown', status: 'Active', time: '13:45' },
  ]

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8 mt-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's your overview.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-4 rounded-lg`}>
                      <Icon className="text-white text-2xl" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/interviewer/create-room"
                  className="block w-full btn-primary text-center py-3"
                >
                  Create New Room
                </Link>
                <Link
                  to="/interviewer/live-monitoring"
                  className="block w-full btn-secondary text-center py-3"
                >
                  View Live Monitoring
                </Link>
              </div>
            </div>

            {/* Recent Interviews */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Interviews</h2>
              <div className="space-y-3">
                {recentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{interview.candidate}</p>
                      <p className="text-sm text-gray-600">Room: {interview.id}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          interview.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {interview.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{interview.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default InterviewerDashboard
