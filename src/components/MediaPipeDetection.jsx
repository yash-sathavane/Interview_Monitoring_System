import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { startCameraDetection, stopCamera, cleanup } from '../utils/mediapipeDetection'
import { FaEye, FaHeadSideVirus, FaVideo } from 'react-icons/fa'

const MediaPipeDetection = forwardRef(({ onDetectionUpdate, isCandidate = false }, ref) => {
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

  useImperativeHandle(ref, () => ({
    getSnapshot: () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        // Ensure video has data
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg', 0.5);
        }
      }
      return null;
    }
  }));

  useEffect(() => {
    let isMounted = true

    const handleDetection = (detection) => {
      if (!isMounted) return

      setDetectionStatus(prev => ({
        ...detection,
        blinkCount: prev.blinkCount, // Keep previous blink count
      }))

      // Notify parent component
      if (onDetectionUpdate) {
        onDetectionUpdate(detection)
      }

      // Draw on canvas
      drawDetection(detection)
    }

    const drawDetection = (detection) => {
      if (!canvasRef.current || !videoRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const video = videoRef.current

      // Set canvas size
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw nose point (like your Python code)
      if (detection.nosePoint) {
        const noseX = detection.nosePoint.x * canvas.width
        const noseY = detection.nosePoint.y * canvas.height

        // Draw green circle on nose (like cv2.circle in your code)
        ctx.fillStyle = '#00ff00'
        ctx.beginPath()
        ctx.arc(noseX, noseY, 5, 0, 2 * Math.PI)
        ctx.fill()

        // Draw eye status text (like cv2.putText)
        ctx.fillStyle = '#00ffff'
        ctx.font = 'bold 20px Arial'
        ctx.fillText(`Eye: ${detection.eyeMovement}`, 30, 40)

        // Draw head status text
        ctx.fillStyle = '#ff0000'
        ctx.fillText(`Head: ${detection.headPosition}`, 30, 70)
      }
    }

    const startDetection = async () => {
      if (!videoRef.current) return

      try {
        // Start MediaPipe detection
        startCameraDetection(videoRef.current, handleDetection)
        setIsDetecting(true)
      } catch (error) {
        console.error('Error starting detection:', error)
        alert('Error starting camera detection. Please check browser permissions.')
      }
    }

    // Start detection when component mounts
    startDetection()

    // Cleanup on unmount
    return () => {
      isMounted = false
      cleanup()
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
          style={{ transform: 'scaleX(-1)' }} // Mirror effect (like cv2.flip)
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
          <div className="flex items-center space-x-2">
            <FaHeadSideVirus className="text-blue-500" />
            <span className="text-sm">
              Head: {detectionStatus.headPosition}
            </span>
          </div>
        </div>
      )}

      {!isDetecting && (
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">Starting camera detection...</p>
        </div>
      )}
    </div>
  )
});

export default MediaPipeDetection


