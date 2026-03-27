// MediaPipe Face Mesh Detection
// Your Python code converted to JavaScript

import { FaceMesh } from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'

let faceMesh = null
let camera = null
let detectionCallback = null

// Initialize MediaPipe Face Mesh (same as your Python code)
export const initializeMediaPipe = (onResults) => {
  detectionCallback = onResults

  faceMesh = new FaceMesh({
    locateFile: (file) => {
      // Use local files served from public folder
      return `/mediapipe/face_mesh/${file}`
    }
  })

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  })

  faceMesh.onResults((results) => {
    if (onResults) {
      onResults(results)
    }
  })

  return faceMesh
}

// Start camera with detection
export const startCameraDetection = (videoElement, onDetection) => {
  if (!faceMesh) {
    initializeMediaPipe((results) => {
      const detection = processDetection(results, videoElement)
      if (onDetection) {
        onDetection(detection)
      }
    })
  }

  camera = new Camera(videoElement, {
    onFrame: async () => {
      await faceMesh.send({ image: videoElement })
    },
    width: 640,
    height: 480,
  })

  camera.start()
  return camera
}

// Process detection results (converted from your Python code)
const processDetection = (results, videoElement) => {
  let eyeStatus = "NO FACE"
  let headStatus = "HEAD STRAIGHT"
  let faceDetected = false
  let eyeMovement = "Looking Center"
  let headPosition = "Center"

  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const face = results.multiFaceLandmarks[0]
    faceDetected = true

    // Nose landmark (index 1 in MediaPipe)
    const nose = face[1]
    const nose_x = nose.x
    const nose_y = nose.y

    // ---------- EYE / GAZE DIRECTION (Your Logic) ----------
    if (nose_x < 0.45) {
      eyeStatus = "LOOKING RIGHT"
      eyeMovement = "Looking Away"
    } else if (nose_x > 0.55) {
      eyeStatus = "LOOKING LEFT"
      eyeMovement = "Looking Away"
    } else {
      eyeStatus = "LOOKING CENTER"
      eyeMovement = "Looking Center"
    }

    // ---------- HEAD POSITION (Your Logic) ----------
    if (nose_y > 0.6) {
      headStatus = "HEAD DOWN"
      headPosition = "Down"
    } else if (nose_y < 0.4) {
      headStatus = "HEAD UP"
      headPosition = "Up"
    } else {
      headStatus = "HEAD STRAIGHT"
      headPosition = "Center"
    }
  }

  return {
    faceDetected: faceDetected,
    eyeTracking: faceDetected,
    headPosition: headPosition,
    eyeMovement: eyeMovement,
    blinkCount: 0, // You can add blink detection later
    // Additional data for drawing
    nosePoint: results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0
      ? {
          x: results.multiFaceLandmarks[0][1].x,
          y: results.multiFaceLandmarks[0][1].y,
        }
      : null,
    faceLandmarks: results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0
      ? results.multiFaceLandmarks[0]
      : null,
  }
}

// Stop camera
export const stopCamera = () => {
  if (camera) {
    camera.stop()
    camera = null
  }
}

// Cleanup
export const cleanup = () => {
  stopCamera()
  faceMesh = null
  detectionCallback = null
}