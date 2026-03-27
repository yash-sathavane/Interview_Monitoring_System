import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { FaDownload, FaEye, FaHeadSideVirus, FaClock, FaExclamationTriangle, FaKeyboard, FaMouse, FaExchangeAlt } from 'react-icons/fa'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const FinalReport = () => {
  const { sessionId } = useParams()
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // First try to fetch the report directly
        let response = await fetch(`http://localhost:4000/api/sessions/report/${sessionId}`)
        
        if (response.status === 404) {
          // If report doesn't exist yet (maybe just finished), we might need to wait or handle it
          // For now, assume it exists or show error
          throw new Error("Report not found. Ensure the session has ended.")
        }

        if (!response.ok) {
          throw new Error("Failed to fetch report")
        }

        const data = await response.json()
        setReportData(data)
      } catch (err) {
        console.error("Error fetching report:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchReport()
    }
  }, [sessionId])

  const getRiskColor = (level) => {
    switch (level) {
      case 'SAFE':
        return 'bg-green-100 text-green-700'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700'
      case 'HIGH':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleDownload = () => {
    if (!reportData) return
    
    // Trigger backend download
    window.location.href = `http://localhost:4000/api/sessions/report/${reportData.sessionId}/download`
  }

  if (loading) return <div className="p-10 text-center">Loading report...</div>
  if (error) return <div className="p-10 text-center text-red-600">Error: {error}</div>
  if (!reportData) return <div className="p-10 text-center">No report data found.</div>

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Interview Report</h1>
              <p className="text-gray-600">Final summary of the interview session</p>
            </div>

            <div className="card mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{reportData.candidateName}</h2>
                  <p className="text-gray-600 mt-1">Session ID: {reportData.sessionId}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${getRiskColor(reportData.riskLevel)}`}>
                  {reportData.riskLevel} Risk
                </div>
              </div>

              {/* Interview Duration */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <FaClock className="text-2xl text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Interview Duration</p>
                    <p className="text-xl font-bold text-gray-800">{reportData.duration}</p>
                  </div>
                </div>
              </div>

              {/* Suspicion Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Overall Suspicion Score</h3>
                  <span className="text-2xl font-bold text-gray-800">{reportData.suspicionScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      reportData.suspicionScore < 30
                        ? 'bg-green-500'
                        : reportData.suspicionScore < 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${reportData.suspicionScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Eye Movement Summary */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FaEye className="text-xl text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Eye Movement Summary</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Looking Center</p>
                    <p className="text-2xl font-bold text-blue-600">{reportData.eyeMovementStats?.center || 0}%</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Looking Away</p>
                    <p className="text-2xl font-bold text-yellow-600">{reportData.eyeMovementStats?.away || 0}%</p>
                  </div>
                </div>
              </div>

              {/* Head Position Summary */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FaHeadSideVirus className="text-xl text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Head Position Summary</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Center</p>
                    <p className="text-2xl font-bold text-blue-600">{reportData.headPositionStats?.center || 0}%</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Down</p>
                    <p className="text-2xl font-bold text-yellow-600">{reportData.headPositionStats?.down || 0}%</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Side</p>
                    <p className="text-2xl font-bold text-orange-600">{reportData.headPositionStats?.side || 0}%</p>
                  </div>
                </div>
              </div>

               {/* System Activity Stats */}
               <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FaKeyboard className="text-xl text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">System Activity</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center mb-1">
                        <FaExchangeAlt className="mr-2 text-red-600"/>
                        <p className="text-sm text-gray-600">Tab Switches</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{reportData.tabSwitchCount}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                     <div className="flex items-center mb-1">
                        <FaKeyboard className="mr-2 text-gray-600"/>
                        <p className="text-sm text-gray-600">Keyboard Events</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{reportData.keyboardEvents}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-1">
                        <FaMouse className="mr-2 text-gray-600"/>
                        <p className="text-sm text-gray-600">Mouse Events</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{reportData.mouseEvents}</p>
                  </div>
                </div>
              </div>

              {/* Final Risk Level */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-3">
                  <FaExclamationTriangle className="text-2xl text-yellow-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Final Risk Assessment</h3>
                </div>
                <div className={`inline-block px-6 py-3 rounded-lg font-bold text-lg ${getRiskColor(reportData.riskLevel)}`}>
                  {reportData.riskLevel} Risk Level
                </div>
                <p className="text-gray-600 mt-3 text-sm">
                  Based on the analysis of eye movements, head position, and behavioral patterns during the interview.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  <FaDownload />
                  <span>Download PDF Report</span>
                </button>
                <Link
                  to="/interviewer/dashboard"
                  className="flex-1 btn-secondary text-center py-3"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default FinalReport
