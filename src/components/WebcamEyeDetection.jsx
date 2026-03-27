import { useEffect, useRef, useState } from 'react'
import { FaEye, FaHeadSideVirus, FaVideo } from 'react-icons/fa'
import { FaceMesh } from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'
import { detectFaceAndEyes, getNoseCoordinates } from '../utils/mediapipeDetection'

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
  
  const faceMeshRef = useRef(null)
  const cameraRef = useRef(null)

  useEffect(() => {
    // Initialize MediaPipe Face Mesh (आपके Python code जैसा)
    const initializeDetection = () => {
      if (!videoRef.current) return

      // Initialize Face Mesh with your exact settings
      faceMeshRef.current = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        }
      })

      faceMeshRef.current.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      })

      // On results callback (आपके while loop जैसा)
      faceMeshRef.current.onResults((results) => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // Set canvas dimensions
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480

        // Draw video frame (cv2.imshow जैसा)
        ctx.save()
        ctx.scale(-1, 1) // Flip horizontally (cv2.flip जैसा)
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
        ctx.restore()

        // Detect using your logic
        const detection = detectFaceAndEyes(
          results,
          canvas.width,
          canvas.height
        )

        // Update state
        setDetectionStatus(prev => ({
          ...detection,
          blinkCount: prev.blinkCount // Keep previous blink count
        }))

        // Notify parent
        if (onDetectionUpdate) {
          onDetectionUpdate(detection)
        }

        // Draw nose point (आपके code जैसा - cv2.circle)
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const face = results.multiFaceLandmarks[0]
          const noseCoords = getNoseCoordinates(face, canvas.width, canvas.height)
          
          if (noseCoords) {
            // Draw nose point (green circle - आपके code जैसा)
            ctx.fillStyle = '#00ff00'
            ctx.beginPath()
            ctx.arc(noseCoords.x, noseCoords.y, 5, 0, 2 * Math.PI)
            ctx.fill()

            // Draw text (आपके cv2.putText जैसा)
            ctx.fillStyle = '#ffff00'
            ctx.font = 'bold 20px Arial'
            ctx.fillText(`Eye: ${detection.eyeMovement}`, 30, 40)
            
            ctx.fillStyle = '#ff0000'
            ctx.fillText(`Head: ${detection.headPosition}`, 30, 70)
          }
        }
      })

      // Initialize camera
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMeshRef.current.send({ image: videoRef.current })
        },
        width: 640,
        height: 480
      })

      cameraRef.current.start()
      setIsDetecting(true)
    }

    // Start detection
    if (videoRef.current) {
      initializeDetection()
    }

    // Cleanup
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop()
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close()
      }
      setIsDetecting(false)
    }
  }, [onDetectionUpdate])

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