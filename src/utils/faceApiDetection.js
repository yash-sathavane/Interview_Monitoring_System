// Face-API.js based Eye Detection
// यह file आपके existing code को integrate करने के लिए है

// Option 1: Face-API.js का उपयोग
import * as faceapi from 'face-api.js'

let modelsLoaded = false

export const loadFaceAPIModels = async () => {
  if (modelsLoaded) return true
  
  try {
    const MODEL_URL = '/models'
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ])
    modelsLoaded = true
    return true
  } catch (error) {
    console.error('Error loading models:', error)
    return false
  }
}

export const detectFaceAndEyes = async (videoElement) => {
  if (!modelsLoaded) {
    const loaded = await loadFaceAPIModels()
    if (!loaded) {
      return getDefaultDetection()
    }
  }

  try {
    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()

    if (!detection) {
      return {
        faceDetected: false,
        eyeTracking: false,
        headPosition: 'Center',
        eyeMovement: 'Looking Center',
        blinkCount: 0,
      }
    }

    const landmarks = detection.landmarks
    const leftEye = landmarks.getLeftEye()
    const rightEye = landmarks.getRightEye()

    // Calculate Eye Aspect Ratio (EAR) for blink detection
    const leftEAR = calculateEAR(leftEye)
    const rightEAR = calculateEAR(rightEye)
    const avgEAR = (leftEAR + rightEAR) / 2

    // Calculate head position
    const headPosition = calculateHeadPosition(landmarks)

    // Calculate eye gaze direction
    const eyeGaze = calculateEyeGaze(leftEye, rightEye, landmarks)

    return {
      faceDetected: true,
      eyeTracking: true,
      headPosition: headPosition,
      eyeMovement: eyeGaze,
      blinkCount: avgEAR < 0.25 ? 1 : 0, // Blink threshold
    }
  } catch (error) {
    console.error('Detection error:', error)
    return getDefaultDetection()
  }
}

// Eye Aspect Ratio calculation (for blink detection)
const calculateEAR = (eye) => {
  // Vertical distances
  const vertical1 = Math.abs(eye[1].y - eye[5].y)
  const vertical2 = Math.abs(eye[2].y - eye[4].y)
  // Horizontal distance
  const horizontal = Math.abs(eye[0].x - eye[3].x)
  
  if (horizontal === 0) return 0.3
  
  return (vertical1 + vertical2) / (2 * horizontal)
}

// Head position calculation
const calculateHeadPosition = (landmarks) => {
  const nose = landmarks.getNose()
  const jaw = landmarks.getJawOutline()
  
  if (!nose || !jaw || nose.length < 4 || jaw.length < 9) {
    return 'Center'
  }

  const noseTip = nose[3]
  const jawCenter = jaw[8]
  
  // Calculate vertical difference
  const verticalDiff = noseTip.y - jawCenter.y
  
  // Calculate horizontal alignment
  const leftCheek = landmarks.getLeftCheek()
  const rightCheek = landmarks.getRightCheek()
  
  if (!leftCheek || !rightCheek) return 'Center'
  
  const horizontalDiff = Math.abs(leftCheek[0].x - rightCheek[0].x)
  
  // Thresholds (adjust based on your needs)
  if (verticalDiff > 30) return 'Down'
  if (verticalDiff < -20) return 'Up'
  if (horizontalDiff > 50) return 'Side'
  
  return 'Center'
}

// Eye gaze calculation
const calculateEyeGaze = (leftEye, rightEye, landmarks) => {
  if (!leftEye || !rightEye || leftEye.length < 6 || rightEye.length < 6) {
    return 'Looking Center'
  }

  // Calculate eye centers
  const leftCenter = {
    x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
    y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length,
  }
  
  const rightCenter = {
    x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
    y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length,
  }

  // Calculate average eye position
  const avgX = (leftCenter.x + rightCenter.x) / 2
  const avgY = (leftCenter.y + rightCenter.y) / 2

  // Get face center for reference
  const nose = landmarks.getNose()
  if (!nose || nose.length < 4) return 'Looking Center'
  
  const faceCenterX = nose[3].x
  const faceCenterY = nose[3].y

  // Calculate deviation
  const xDeviation = avgX - faceCenterX
  const yDeviation = avgY - faceCenterY

  // Thresholds (adjust these values)
  const threshold = 20

  if (Math.abs(xDeviation) > threshold || Math.abs(yDeviation) > threshold) {
    return 'Looking Away'
  }

  return 'Looking Center'
}

const getDefaultDetection = () => ({
  faceDetected: false,
  eyeTracking: false,
  headPosition: 'Center',
  eyeMovement: 'Looking Center',
  blinkCount: 0,
})

// ============================================
// यहाँ आप अपना existing code add कर सकते हैं
// ============================================

// Example: अगर आपके पास custom detection function है
export const useCustomDetection = async (videoElement) => {
  // अपना code यहाँ paste करें
  // Example:
  // const result = await yourCustomDetectionFunction(videoElement)
  // return formatDetectionResult(result)
}

// Helper function to format your detection result
const formatDetectionResult = (yourResult) => {
  return {
    faceDetected: yourResult.faceDetected || false,
    eyeTracking: yourResult.eyeTracking || false,
    headPosition: yourResult.headPosition || 'Center',
    eyeMovement: yourResult.eyeMovement || 'Looking Center',
    blinkCount: yourResult.blinkCount || 0,
  }
}


