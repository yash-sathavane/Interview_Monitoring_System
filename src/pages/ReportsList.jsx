import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { FaFileAlt, FaSearch, FaDownload } from 'react-icons/fa'

const ReportsList = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) return
        
        const user = JSON.parse(userStr)
        // Fetch real reports from the new endpoint
        const response = await fetch(`http://localhost:4000/api/sessions/reports/interviewer/${user._id}`)
        
        if (response.ok) {
          const data = await response.json()
          
          setReports(data.map(r => ({
            id: r.sessionId,
            candidate: r.candidateName,
            date: new Date(r.generatedAt).toLocaleDateString(),
            duration: r.duration,
            riskLevel: r.riskLevel || "SAFE",
            suspicionScore: r.suspicionScore
          })))
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const filteredReports = reports.filter(report => 
    (report.candidate || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.id || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8 mt-16">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Interview Reports</h1>
              <p className="text-gray-600 mt-2">View and download analysis reports for completed interviews.</p>
            </div>
            
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search candidate..." 
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-gray-600 font-semibold text-sm">Candidate</th>
                    <th className="px-6 py-3 text-gray-600 font-semibold text-sm">Session ID</th>
                    <th className="px-6 py-3 text-gray-600 font-semibold text-sm">Date</th>
                    <th className="px-6 py-3 text-gray-600 font-semibold text-sm">Status</th>
                    <th className="px-6 py-3 text-gray-600 font-semibold text-sm">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-4 text-center">Loading reports...</td></tr>
                  ) : filteredReports.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-4 text-center">No reports found.</td></tr>
                  ) : (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{report.candidate}</td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">{report.id}</td>
                        <td className="px-6 py-4 text-gray-600">{report.date}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/interviewer/report/${report.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                            View <FaFileAlt className="ml-1" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ReportsList
