import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import useSystemStatus from '../hooks/useSystemStatus'
import { FaVideo, FaChartBar, FaPlusCircle, FaClock, FaKeyboard, FaMouse, FaWindowRestore } from 'react-icons/fa'

const InterviewerDashboard = () => {
  // Fetch system status from Python backend
  const { status: systemStatus, loading: systemLoading, error: systemError } = useSystemStatus(2000) // Poll every 2 seconds
  const [recentInterviews, setRecentInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) return
        
        const user = JSON.parse(userStr)
        const response = await fetch(`http://localhost:4000/api/sessions/interviewer/${user._id}`)
        
        if (response.ok) {
          const data = await response.json()
          // Transform data to match UI needs
          const formatted = data.map(session => ({
            id: session.sessionId,
            candidate: session.candidateName || session.candidateEmail || "Guest",
            status: session.status === 'created' ? 'Pending' : session.status.charAt(0).toUpperCase() + session.status.slice(1),
            time: new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(session.createdAt).toLocaleDateString()
          }))
          setRecentInterviews(formatted)
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const stats = [
    { label: 'Active Interviews', value: recentInterviews.filter(i => i.status === 'Active').length, icon: FaVideo, color: 'bg-blue-500' },
    { label: 'Total Reports', value: recentInterviews.filter(i => i.status === 'Completed').length, icon: FaChartBar, color: 'bg-green-500' },
    { label: 'Rooms Created', value: recentInterviews.length, icon: FaPlusCircle, color: 'bg-purple-500' },
    { label: 'Avg. Duration', value: '45m', icon: FaClock, color: 'bg-orange-500' },
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
                {/* 
                <Link
                  to="/interviewer/live-monitoring"
                  className="block w-full btn-secondary text-center py-3"
                >
                  View Live Monitoring
                </Link>
                */}
              </div>
            </div>

            {/* Recent Interviews */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Interviews</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? <p>Loading sessions...</p> : recentInterviews.length === 0 ? <p>No interviews found.</p> : recentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{interview.candidate}</p>
                      <p className="text-sm text-gray-600">Room: {interview.id} | {interview.date}</p>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          interview.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : interview.status === 'Completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {interview.status}
                      </span>
                      
                      {interview.status === 'Completed' && (
                         <Link 
                           to={`/interviewer/report/${interview.id}`}
                           className="text-xs text-blue-600 hover:underline"
                         >
                           View Report
                         </Link>
                      )}
                       {interview.status === 'Active' && (
                         <Link 
                           to={`/interviewer/live-monitoring/${interview.id}`}
                           className="text-xs text-green-600 hover:underline"
                         >
                           Monitor
                         </Link>
                      )}
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
