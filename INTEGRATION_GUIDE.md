# Eye Detection Integration Guide

## Existing Eye Detection Code how to Integrate 

### Step 1: our Eye Detection Code Share 

### Step 2: Face-API.js  (Recommended)

#### Installation:
```bash
npm install face-api.js
```

#### Models Download :
1. [face-api.js models](https://github.com/justadudewhohacks/face-api.js-models) से models download 
2. `public/models/` folder 
3. Models copy 
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`

#### Code Update:

`src/utils/eyeDetection.js`  code add :

```javascript
import * as faceapi from 'face-api.js'

let modelsLoaded = false

export const loadModels = async () => {
  if (modelsLoaded) return
  
  const MODEL_URL = '/models'
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  ])
  modelsLoaded = true
}

export const detectEyes = async (videoElement) => {
  await loadModels()
  
  const detection = await faceapi
    .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
  
  if (!detection) {
    return {
      faceDetected: false,
      eyeTracking: false,
      headPosition: 'Center',
      eyeMovement: 'Looking Center',
    }
  }
  
  const landmarks = detection.landmarks
  const leftEye = landmarks.getLeftEye()
  const rightEye = landmarks.getRightEye()
  
  // Calculate eye aspect ratio for blink detection
  const leftEAR = calculateEAR(leftEye)
  const rightEAR = calculateEAR(rightEye)
  const avgEAR = (leftEAR + rightEAR) / 2
  
  // Calculate head position
  const nose = landmarks.getNose()
  const headPosition = calculateHeadPosition(landmarks)
  
  // Calculate eye gaze
  const eyeGaze = calculateEyeGaze(leftEye, rightEye)
  
  return {
    faceDetected: true,
    eyeTracking: true,
    headPosition: headPosition,
    eyeMovement: eyeGaze,
    blinkCount: avgEAR < 0.25 ? 1 : 0, // Simple blink detection
  }
}

// Eye Aspect Ratio calculation
const calculateEAR = (eye) => {
  const vertical1 = Math.abs(eye[1].y - eye[5].y)
  const vertical2 = Math.abs(eye[2].y - eye[4].y)
  const horizontal = Math.abs(eye[0].x - eye[3].x)
  return (vertical1 + vertical2) / (2 * horizontal)
}

// Head position calculation
const calculateHeadPosition = (landmarks) => {
  const nose = landmarks.getNose()
  const jaw = landmarks.getJawOutline()
  
  // Simple calculation - adjust based on your needs
  const noseY = nose[3].y
  const jawY = jaw[8].y
  
  if (noseY > jawY + 30) return 'Down'
  if (noseY < jawY - 30) return 'Up'
  
  const leftCheek = landmarks.getLeftCheek()
  const rightCheek = landmarks.getRightCheek()
  const diff = Math.abs(leftCheek[0].x - rightCheek[0].x)
  
  if (diff > 50) return 'Side'
  return 'Center'
}

// Eye gaze calculation
const calculateEyeGaze = (leftEye, rightEye) => {
  const leftCenter = {
    x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
    y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length,
  }
  const rightCenter = {
    x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
    y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length,
  }
  
  // Simple gaze detection - adjust thresholds
  const gazeX = (leftCenter.x + rightCenter.x) / 2
  const gazeY = (leftCenter.y + rightCenter.y) / 2
  
  // You can add more sophisticated logic here
  return 'Looking Center' // or 'Looking Away', 'Looking Left', 'Looking Right'
}
```

### Step 3: WebcamEyeDetection Component Update करें

`src/components/WebcamEyeDetection.jsx`detectEyes` function update :

```javascript
import { detectEyes } from '../utils/eyeDetection'

// In the detectEyes function, replace simulateEyeDetection with:
const actualDetection = await detectEyes(video)
setDetectionStatus(actualDetection)
```

### Step 4: MediaPipe का उपयोग (Alternative)
 MediaPipe use :

```bash
npm install @mediapipe/face_mesh @mediapipe/camera_utils
```

### Step 5: अपना Custom Code Integrate करें



1. `src/utils/eyeDetection.js` में अपना function add करें
2. `WebcamEyeDetection.jsx` में उसे call करें
3. Return format यह होना चाहिए:
```javascript
{
  faceDetected: boolean,
  eyeTracking: boolean,
  headPosition: 'Center' | 'Down' | 'Side' | 'Up',
  eyeMovement: 'Looking Center' | 'Looking Away' | 'Looking Left' | 'Looking Right',
  blinkCount: number,
}
```



