import { useEffect, useRef, useState } from 'react'
import { FaEye, FaHeadSideVirus, FaVideo } from 'react-icons/fa'

const WebcamEyeDetection = ({ onDetectionUpdate, isCandidate = false }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionStatus, setDetectionStatus] = useState({
    faceDetected: false,
    eyeTracking: false,
    headPosition: 'Center',
    eyeMovement: 'Looking Center',
    blinkCount: 0,
  })

  useEffect(() => {
    let stream = null
    let animationFrame = null

    const startWebcam = async () => {
      try {
        // Request webcam access
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'user'
          }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setIsDetecting(true)
          startDetection()
        }
      } catch (error) {
        console.error('Error accessing webcam:', error)
        alert('Webcam access denied. Please allow camera permissions.')
      }
    }

    const startDetection = () => {
      // Load face-api.js models (you'll need to install: npm install face-api.js)
      // For now, using a simple detection simulation
      detectEyes()
    }

    const detectEyes = () => {
      if (!videoRef.current || !canvasRef.current) return

      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      // Set canvas dimensions
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480

      const detect = async () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Real eye detection (Replace simulateEyeDetection with your actual detection)
          const detectionResult = await simulateEyeDetection()

          // Update detection status
          setDetectionStatus(prev => ({
            ...detectionResult,
            blinkCount: detectionResult.blinkCount > prev.blinkCount 
              ? detectionResult.blinkCount 
              : prev.blinkCount + (detectionResult.blinkCount > 0 ? 1 : 0)
          }))
          
          // Notify parent component
          if (onDetectionUpdate) {
            onDetectionUpdate({
              ...detectionResult,
              blinkCount: detectionStatus.blinkCount + (detectionResult.blinkCount > 0 ? 1 : 0)
            })
          }

          // Draw detection overlay (optional)
          drawDetectionOverlay(ctx, detectionResult)
        }

        if (isDetecting) {
          animationFrame = requestAnimationFrame(detect)
        }
      }

      detect()
    }

    const simulateEyeDetection = async () => {
      // Option 1: Use Face-API.js (uncomment when models are loaded)
      // import { detectFaceAndEyes } from '../utils/faceApiDetection'
      // return await detectFaceAndEyes(video)
      
      // Option 2: Use your custom detection code
      // import { useCustomDetection } from '../utils/faceApiDetection'
      // return await useCustomDetection(video)
      
      // Option 3: Temporary simulation (remove when real detection is ready)
      return {
        faceDetected: true,
        eyeTracking: true,
        headPosition: Math.random() > 0.7 ? 'Down' : Math.random() > 0.5 ? 'Side' : 'Center',
        eyeMovement: Math.random() > 0.8 ? 'Looking Away' : 'Looking Center',
        blinkCount: detectionStatus.blinkCount + (Math.random() > 0.95 ? 1 : 0),
      }
    }

    const drawDetectionOverlay = (ctx, detection) => {
      // Draw face detection box
      if (detection.faceDetected) {
        ctx.strokeStyle = '#00ff00'
        ctx.lineWidth = 2
        ctx.strokeRect(50, 50, 200, 250)
        
        // Draw eye points
        ctx.fillStyle = detection.eyeMovement === 'Looking Center' ? '#00ff00' : '#ff0000'
        ctx.beginPath()
        ctx.arc(120, 150, 5, 0, 2 * Math.PI) // Left eye
        ctx.arc(180, 150, 5, 0, 2 * Math.PI) // Right eye
        ctx.fill()
      }
    }

    startWebcam()

    // Cleanup
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      setIsDetecting(false)
    }
  }, [])

  return (
    <div className="relative">
      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto"
          style={{ transform: 'scaleX(-1)' }} // Mirror effect
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>

      {!isCandidate && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <FaVideo className={detectionStatus.faceDetected ? 'text-green-500' : 'text-gray-400'} />
            <span className="text-sm">
              Face: {detectionStatus.faceDetected ? 'Detected' : 'Not Detected'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FaEye className={detectionStatus.eyeTracking ? 'text-green-500' : 'text-gray-400'} />
            <span className="text-sm">
              Eyes: {detectionStatus.eyeMovement}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default WebcamEyeDetection
