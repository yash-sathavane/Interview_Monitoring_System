import { useState } from 'react'
import WebcamEyeDetection from '../components/WebcamEyeDetection'
import { FaCheckCircle, FaVideo, FaEye, FaHeadSideVirus } from 'react-icons/fa'

const CandidateMonitoring = () => {
  const [detectionStatus, setDetectionStatus] = useState({
    faceDetected: false,
    eyeTracking: false,
    headPosition: 'Center',
  })

  const handleDetectionUpdate = (data) => {
    setDetectionStatus({
      faceDetected: data.faceDetected,
      eyeTracking: data.eyeTracking,
      headPosition: data.headPosition,
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

          {/* Real Webcam with Eye Detection */}
          <div className="mb-8">
            <WebcamEyeDetection 
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
