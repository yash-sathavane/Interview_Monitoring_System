import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import WebcamEyeDetection from '../components/WebcamEyeDetection'
import { FaExclamationTriangle, FaEye, FaHeadSideVirus, FaStop } from 'react-icons/fa'

const LiveMonitoring = () => {
  const [timer, setTimer] = useState(0)
  const navigate = useNavigate()

  // Real-time detection data from webcam
  const [status, setStatus] = useState({
    webcam: 'Active',
    eyeMovement: 'Looking Center',
    headPosition: 'Center',
    blinkCount: 0,
    suspicionScore: 0,
    faceDetected: false,
    eyeTracking: false,
  })

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Eye looking away detected', timestamp: '15:32:14' },
    { id: 2, type: 'warning', message: 'Head down detected', timestamp: '15:31:45' },
    { id: 3, type: 'danger', message: 'Excessive blinking', timestamp: '15:30:22' },
    { id: 4, type: 'warning', message: 'Suspicious behavior', timestamp: '15:29:10' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndInterview = () => {
    if (window.confirm('Are you sure you want to end this interview?')) {
      navigate('/interviewer/report')
    }
  }

  // Handle detection updates from WebcamEyeDetection component
  const handleDetectionUpdate = (detectionData) => {
    setStatus(prev => ({
      ...prev,
      faceDetected: detectionData.faceDetected,
      eyeTracking: detectionData.eyeTracking,
      eyeMovement: detectionData.eyeMovement,
      headPosition: detectionData.headPosition,
      blinkCount: detectionData.blinkCount,
      webcam: detectionData.faceDetected ? 'Active' : 'Inactive',
    }))

    // Calculate suspicion score based on detection
    let score = 0
    if (detectionData.eyeMovement === 'Looking Away') score += 20
    if (detectionData.headPosition !== 'Center') score += 15
    if (detectionData.blinkCount > 50) score += 10

    setStatus(prev => ({
      ...prev,
      suspicionScore: Math.min(score, 100),
    }))

    // Generate alerts based on detection
    if (detectionData.eyeMovement === 'Looking Away') {
      const newAlert = {
        id: Date.now(),
        type: 'warning',
        message: 'Eye looking away detected',
        timestamp: new Date().toLocaleTimeString(),
      }
      setAlerts(prev => [newAlert, ...prev].slice(0, 10)) // Keep last 10 alerts
    }

    if (detectionData.headPosition !== 'Center') {
      const newAlert = {
        id: Date.now() + 1,
        type: 'warning',
        message: `Head ${detectionData.headPosition.toLowerCase()} detected`,
        timestamp: new Date().toLocaleTimeString(),
      }
      setAlerts(prev => [newAlert, ...prev].slice(0, 10))
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8 mt-16">
          {/* Top Bar */}
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Live Monitoring</h1>
                <p className="text-gray-600 mt-1">Candidate: Alice Johnson</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Room ID</p>
                  <p className="font-mono font-bold text-lg">ABC123</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Interview Timer</p>
                  <p className="font-mono font-bold text-lg text-blue-600">
                    {formatTime(timer)}
                  </p>
                </div>
                <button
                  onClick={handleEndInterview}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FaStop />
                  <span>End Interview</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Status Cards */}
            <div className="space-y-4">
              {/* Webcam Status with Real Detection */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Webcam Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    status.faceDetected 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {status.faceDetected ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <WebcamEyeDetection 
                  onDetectionUpdate={handleDetectionUpdate}
                  isCandidate={false}
                />
              </div>

              {/* Eye Movement */}
              <div className="card">
                <div className="flex items-center mb-4">
                  <FaEye className="text-2xl text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Eye Movement</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Current Status:</span>
                    <span className="font-semibold text-gray-800">{status.eyeMovement}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className={`p-3 rounded-lg text-center ${
                      status.eyeMovement === 'Looking Center' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600'
                    }`}>
                      Looking Center
                    </div>
                    <div className={`p-3 rounded-lg text-center ${
                      status.eyeMovement === 'Looking Away' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-50 text-gray-600'
                    }`}>
                      Looking Away
                    </div>
                  </div>
                </div>
              </div>

              {/* Head Position */}
              <div className="card">
                <div className="flex items-center mb-4">
                  <FaHeadSideVirus className="text-2xl text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Head Position</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Current Status:</span>
                    <span className="font-semibold text-gray-800">{status.headPosition}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {['Center', 'Down', 'Side'].map((pos) => (
                      <div
                        key={pos}
                        className={`p-3 rounded-lg text-center text-sm ${
                          status.headPosition === pos
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {pos}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Blink Count & Suspicion Score */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Blink Count</h3>
                  <p className="text-3xl font-bold text-blue-600">{status.blinkCount}</p>
                  <p className="text-sm text-gray-600 mt-1">Total blinks</p>
                </div>
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Suspicion Score</h3>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-gray-800">{status.suspicionScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          status.suspicionScore < 30
                            ? 'bg-green-500'
                            : status.suspicionScore < 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${status.suspicionScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Alerts Panel */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Alerts</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'danger'
                        ? 'bg-red-50 border-red-500'
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start">
                      <FaExclamationTriangle
                        className={`mt-1 mr-3 ${
                          alert.type === 'danger' ? 'text-red-600' : 'text-yellow-600'
                        }`}
                      />
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          alert.type === 'danger' ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{alert.timestamp}</p>
                      </div>
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

export default LiveMonitoring
