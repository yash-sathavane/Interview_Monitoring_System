import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MediaPipeDetection from '../components/MediaPipeDetection'
import useSystemStatus from '../hooks/useSystemStatus'
import { FaCheckCircle, FaVideo, FaEye, FaHeadSideVirus } from 'react-icons/fa'

const CandidateMonitoring = () => {
  const navigate = useNavigate()
  const mediaPipeRef = useRef(null)
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('Initializing')
  const [lastSent, setLastSent] = useState(null)
  
  const [detectionStatus, setDetectionStatus] = useState({
    faceDetected: false,
    eyeTracking: false,
    headPosition: 'Center',
    eyeMovement: 'Looking Center'
  })

  // Refs to hold latest status for the interval closure without triggering re-runs
  const detectionStatusRef = useRef(detectionStatus);
  const systemStatusRef = useRef({ keyboard: 'Unknown', mouse: 'Unknown' });

  // Get system status (keyboard, mouse) from local Python service
  const { status: systemStatus } = useSystemStatus(1000)

  // Update refs when state changes
  useEffect(() => {
    detectionStatusRef.current = detectionStatus;
  }, [detectionStatus]);

  useEffect(() => {
    systemStatusRef.current = systemStatus;
  }, [systemStatus]);

  // Session Initialization
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let sessionId = params.get('sessionId');
    
    if (sessionId) {
      localStorage.setItem('currentSessionId', sessionId);
    } else {
      sessionId = localStorage.getItem('currentSessionId');
    }

    setCurrentSessionId(sessionId);

    if (!sessionId) {
      navigate('/candidate/join');
    }
  }, [navigate]);

  // Periodically send monitoring data to backend
  useEffect(() => {
    if (!currentSessionId) return;

    const interval = setInterval(async () => {
      try {
        const snapshot = mediaPipeRef.current ? mediaPipeRef.current.getSnapshot() : null;
        
        // Use refs to get latest values
        const currentDetection = detectionStatusRef.current;
        const currentSystem = systemStatusRef.current;

        const response = await fetch('http://localhost:4000/api/monitoring/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: currentSessionId,
            userId: 'Candidate',
            eyeMovement: currentDetection.eyeMovement || 'Unknown',
            headPosition: currentDetection.headPosition,
            tabStatus: document.hidden ? 'Switched' : 'Same Tab',
            keyboardStatus: currentSystem.keyboard || 'Normal',
            mouseStatus: currentSystem.mouse || 'Normal',
            image: snapshot
          }),
        });
        
        if (response.ok) {
           setConnectionStatus('Connected & Sending');
           setLastSent(new Date().toLocaleTimeString());
        } else {
           setConnectionStatus('Error Sending Data');
        }

      } catch (error) {
        console.error('Error sending monitoring data:', error);
        setConnectionStatus('Connection Failed');
      }
    }, 3000); // Send every 3 seconds

    return () => clearInterval(interval);
  }, [currentSessionId]); // Only re-run if sessionId changes

  const handleDetectionUpdate = (data) => {
    setDetectionStatus({
      faceDetected: data.faceDetected,
      eyeTracking: data.eyeTracking,
      headPosition: data.headPosition,
      eyeMovement: data.eyeMovement
    })
  }

  const statuses = [
    { icon: FaVideo, label: 'Face Detected', active: detectionStatus.faceDetected },
    { icon: FaEye, label: 'Eye Tracking Active', active: detectionStatus.eyeTracking },
    { icon: FaHeadSideVirus, label: 'Head Position Normal', active: detectionStatus.headPosition === 'Center' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Interview Session Active</h1>
          <p className="text-gray-600">Monitoring is active. Please keep your face centered.</p>
          <div className="mt-2 text-sm text-gray-500">
             Session ID: <span className="font-mono font-bold">{currentSessionId || 'Loading...'}</span> | 
             Status: <span className={`font-bold ${connectionStatus.includes('Error') || connectionStatus.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>{connectionStatus}</span> | 
             Last Sent: {lastSent || 'Never'}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Main Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <FaVideo className="text-4xl text-green-600" />
            </div>
            <p className="text-xl text-gray-700 font-medium">
              Monitoring is active. Please keep your face centered and maintain eye contact with the camera.
            </p>
          </div>

          {/* Real Webcam with MediaPipe Eye & Head Detection */}
          <div className="mb-8">
            <MediaPipeDetection 
              ref={mediaPipeRef}
              onDetectionUpdate={handleDetectionUpdate}
              isCandidate={true}
            />
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statuses.map((status, index) => {
              const Icon = status.icon
              return (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-2 ${
                    status.active
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center mb-3">
                    {status.active ? (
                      <FaCheckCircle className="text-3xl text-green-600" />
                    ) : (
                      <Icon className="text-3xl text-gray-400" />
                    )}
                  </div>
                  <p className={`text-center font-semibold ${
                    status.active ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {status.label}
                  </p>
                  {status.active && (
                    <p className="text-center text-sm text-green-600 mt-1">✓ Active</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Interview Guidelines:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Keep your face centered in the camera frame</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Maintain eye contact with the camera</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Ensure good lighting in your environment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Stay in a quiet, distraction-free area</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateMonitoring
