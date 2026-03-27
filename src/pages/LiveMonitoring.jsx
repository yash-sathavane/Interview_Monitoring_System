import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { FaExclamationTriangle, FaEye, FaHeadSideVirus, FaStop, FaKeyboard, FaMouse, FaWindowRestore, FaVideo, FaLink } from 'react-icons/fa'

const LiveMonitoring = () => {
  const { sessionId } = useParams()
  const [timer, setTimer] = useState(0)
  const navigate = useNavigate()
  const [candidateName, setCandidateName] = useState("Guest Candidate")

  // Real-time detection data from webcam (Remote)
  const [status, setStatus] = useState({
    webcam: 'Waiting...',
    eyeMovement: 'Normal',
    headPosition: 'Center',
    blinkCount: 0,
    suspicionScore: 0,
    faceDetected: false,
    eyeTracking: false,
    tabStatus: 'Same Tab',
    keyboardStatus: 'Normal',
    mouseStatus: 'Normal'
  })

  const [alerts, setAlerts] = useState([])

  // Poll for remote candidate data
  useEffect(() => {
    if (!sessionId) return;

    // Fetch initial session details for candidate name
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/sessions/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.candidateEmail) {
            setCandidateName(data.candidateEmail);
          }
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
      }
    };
    fetchSessionDetails();

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/monitoring/${sessionId}`);
        const data = await response.json();
        
        console.log("Monitoring Data Received:", data && data.length); // Debug log

        if (data && data.length > 0) {
          const latest = data[0]; // Assuming sorted by newest first
          setStatus(prev => ({
            ...prev,
            webcam: 'Active',
            eyeMovement: latest.eyeMovement || 'Normal',
            headPosition: latest.headPosition || 'Normal',
            tabStatus: latest.tabStatus || 'Same Tab',
            keyboardStatus: latest.keyboardStatus || 'Normal',
            mouseStatus: latest.mouseStatus || 'Normal',
            faceDetected: latest.eyeMovement !== 'Unknown' && latest.headPosition !== 'Unknown',
            lastImage: latest.image || prev.lastImage
          }));
        }
      } catch (error) {
        console.error("Error fetching monitoring data:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId]);

  // Timer
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

  const handleEndInterview = async () => {
    if (window.confirm('Are you sure you want to end this interview?')) {
      try {
        await fetch('http://localhost:4000/api/sessions/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
        navigate(`/interviewer/report/${sessionId}`);
      } catch (error) {
        console.error("Error ending session:", error);
      }
    }
  }

  // Monitor system status changes and update suspicion score & alerts
  useEffect(() => {
    // Calculate suspicion score including system monitoring
    let score = 0
    
    // Webcam-based detection
    if (status.eyeMovement === 'Looking Away') score += 20
    if (status.headPosition !== 'Center') score += 15
    // if (status.blinkCount > 50) score += 10 // Blink count not synced yet
    
    // System monitoring
    if (status.tabStatus === 'Switched') score += 25 // Tab switching is suspicious
    if (status.keyboardStatus === 'Typing' && status.eyeMovement === 'Looking Away') score += 15 // Typing while looking away
    if (status.mouseStatus === 'Moving' && status.eyeMovement === 'Looking Away') score += 10 // Mouse activity while looking away

    setStatus(prev => ({
      ...prev,
      suspicionScore: Math.min(score, 100),
    }))

    // Generate alerts
    const newAlerts = [];
    const now = new Date().toLocaleTimeString();
    const nowTs = Date.now();

    if (status.tabStatus === 'Switched') {
      newAlerts.push({
        id: nowTs + 1,
        type: 'danger',
        message: 'Tab/Window switch detected',
        timestamp: now,
      });
    }

    if (status.eyeMovement === 'Looking Away') {
      newAlerts.push({
        id: nowTs + 2,
        type: 'warning',
        message: 'Eye looking away detected',
        timestamp: now,
      });
    }

    if (status.headPosition !== 'Center' && status.headPosition !== 'Normal') {
      newAlerts.push({
        id: nowTs + 3,
        type: 'warning',
        message: `Head ${status.headPosition ? status.headPosition.toLowerCase() : 'movement'} detected`,
        timestamp: now,
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => {
        // Filter out duplicates (same message within 2 seconds)
        const filteredNew = newAlerts.filter(newA => 
          !prev.some(oldA => oldA.message === newA.message && Math.abs(new Date('1970/01/01 ' + oldA.timestamp) - new Date('1970/01/01 ' + newA.timestamp)) < 2000)
        );
        return [...filteredNew, ...prev].slice(0, 10);
      });
    }

  }, [status.tabStatus, status.keyboardStatus, status.mouseStatus, status.eyeMovement, status.headPosition])

  const inviteLink = `http://localhost:3000/candidate/join?roomId=${sessionId}`

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    alert('Invite link copied to clipboard!')
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
                <p className="text-gray-600 mt-1">Candidate: {candidateName}</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Room ID</p>
                  <p className="font-mono font-bold text-lg">{sessionId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Interview Timer</p>
                  <p className="font-mono font-bold text-lg text-blue-600">
                    {formatTime(timer)}
                  </p>
                </div>
                <button
                  onClick={copyLink}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center space-x-2 font-semibold transition-colors"
                >
                  <FaLink />
                  <span>Copy Invite Link</span>
                </button>
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
                    status.webcam === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {status.webcam}
                  </span>
                </div>
                
                {/* Placeholder for Remote Stream */}
                <div className="bg-gray-900 h-64 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                    {status.lastImage ? (
                      <img 
                        src={status.lastImage} 
                        alt="Live Candidate Feed" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                          <FaVideo className="text-4xl mx-auto mb-2" />
                          {status.webcam === 'Active' ? (
                            <>
                              <p>Remote Video Stream Active</p>
                              <p className="text-xs text-green-500 mt-1">Receiving Live Data</p>
                            </>
                          ) : (
                            <>
                              <p>Waiting for Candidate...</p>
                              <p className="text-xs text-gray-500 mt-1">Share the Invite Link to start monitoring</p>
                            </>
                          )}
                      </div>
                    )}
                </div>
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

              {/* System Monitoring Status */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">System Monitoring</h3>
                <div className="space-y-3">
                  {/* Keyboard Status */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FaKeyboard className={`text-xl ${
                        status.keyboardStatus === 'Typing' ? 'text-yellow-600' : 'text-gray-400'
                      }`} />
                      <span className="text-gray-700 font-medium">Keyboard</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      status.keyboardStatus === 'Typing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {status.keyboardStatus}
                    </span>
                  </div>

                  {/* Mouse Status */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FaMouse className={`text-xl ${
                        status.mouseStatus === 'Moving' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className="text-gray-700 font-medium">Mouse</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      status.mouseStatus === 'Moving'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {status.mouseStatus}
                    </span>
                  </div>

                  {/* Tab Status */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FaWindowRestore className={`text-xl ${
                        status.tabStatus === 'Switched' ? 'text-red-600' : 'text-gray-400'
                      }`} />
                      <span className="text-gray-700 font-medium">Tab/Window</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      status.tabStatus === 'Switched'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {status.tabStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Real-time Analysis */}
            <div className="space-y-4">
              {/* Suspicion Score */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Suspicion Score</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                        status.suspicionScore > 50 
                          ? 'text-red-600 bg-red-200' 
                          : status.suspicionScore > 20
                          ? 'text-yellow-600 bg-yellow-200'
                          : 'text-green-600 bg-green-200'
                      }`}>
                        {status.suspicionScore > 50 ? 'High Risk' : status.suspicionScore > 20 ? 'Medium Risk' : 'Low Risk'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {status.suspicionScore}/100
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${status.suspicionScore}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        status.suspicionScore > 50 
                          ? 'bg-red-500' 
                          : status.suspicionScore > 20
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Alert Log */}
              <div className="card flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Alert Log</h3>
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                    {alerts.length} New
                  </span>
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {alerts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No alerts detected yet.</p>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          alert.type === 'danger'
                            ? 'bg-red-50 border-red-500'
                            : 'bg-yellow-50 border-yellow-500'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <FaExclamationTriangle className={`mt-1 ${
                              alert.type === 'danger' ? 'text-red-500' : 'text-yellow-500'
                            }`} />
                            <div>
                              <p className="font-medium text-gray-800">{alert.message}</p>
                              <p className="text-xs text-gray-500">{alert.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default LiveMonitoring
