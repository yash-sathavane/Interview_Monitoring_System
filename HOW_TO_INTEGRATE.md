# आपका Eye Detection Code कैसे Integrate करें

## Quick Start (3 Steps)

### Step 1: अपना Code Share करें
अगर आपके पास पहले से eye detection code है, तो उसे `src/utils/faceApiDetection.js` file में paste करें।

### Step 2: Function Update करें
`src/components/WebcamEyeDetection.jsx` में `simulateEyeDetection` function को अपने code से replace करें।

### Step 3: Test करें
```bash
npm install
npm run dev
```

---

## Detailed Integration

### Method 1: Face-API.js Use करें (Recommended)

#### 1. Models Download करें:
```bash
# public/models/ folder बनाएं
mkdir public/models

# Models download करें:
# https://github.com/justadudewhohacks/face-api.js-models
# Download करें:
# - tiny_face_detector_model-weights_manifest.json
# - tiny_face_detector_model-shard1
# - face_landmark_68_model-weights_manifest.json  
# - face_landmark_68_model-shard1
```

#### 2. Code Update:
`src/components/WebcamEyeDetection.jsx` में line 67 पर:
```javascript
// Replace this:
const mockDetection = simulateEyeDetection()

// With this:
import { detectFaceAndEyes } from '../utils/faceApiDetection'
const mockDetection = await detectFaceAndEyes(video)
```

---

### Method 2: अपना Custom Code Use करें

#### 1. अपना Function Add करें:
`src/utils/faceApiDetection.js` file के अंत में:

```javascript
// अपना function यहाँ add करें
export const yourCustomDetection = async (videoElement) => {
  // आपका existing code यहाँ paste करें
  // Example:
  // const result = await yourDetectionFunction(videoElement)
  
  // Return format यह होना चाहिए:
  return {
    faceDetected: true/false,
    eyeTracking: true/false,
    headPosition: 'Center' | 'Down' | 'Side' | 'Up',
    eyeMovement: 'Looking Center' | 'Looking Away',
    blinkCount: number,
  }
}
```

#### 2. WebcamEyeDetection में Use करें:
`src/components/WebcamEyeDetection.jsx` में:
```javascript
import { yourCustomDetection } from '../utils/faceApiDetection'

// simulateEyeDetection function में:
const detectionResult = await yourCustomDetection(video)
return detectionResult
```

---

### Method 3: MediaPipe Use करें

#### 1. Install:
```bash
npm install @mediapipe/face_mesh @mediapipe/camera_utils
```

#### 2. Code:
`src/utils/faceApiDetection.js` में MediaPipe code add करें।

---

## Return Format (Important!)

आपका detection function यह format return करना चाहिए:

```javascript
{
  faceDetected: boolean,        // Face detect हुआ या नहीं
  eyeTracking: boolean,         // Eye tracking active है या नहीं
  headPosition: string,         // 'Center', 'Down', 'Side', 'Up'
  eyeMovement: string,          // 'Looking Center', 'Looking Away'
  blinkCount: number,           // Total blink count
}
```

---

## Example: Simple Integration

अगर आपके पास simple function है:

```javascript
// src/utils/faceApiDetection.js में:
export const mySimpleDetection = async (video) => {
  // आपका code
  const face = await detectFace(video)
  const eyes = await detectEyes(face)
  
  return {
    faceDetected: !!face,
    eyeTracking: !!eyes,
    headPosition: calculateHead(face),
    eyeMovement: calculateGaze(eyes),
    blinkCount: countBlinks(eyes),
  }
}

// src/components/WebcamEyeDetection.jsx में:
import { mySimpleDetection } from '../utils/faceApiDetection'

const simulateEyeDetection = async () => {
  return await mySimpleDetection(video)
}
```

---

## Troubleshooting

### Webcam नहीं खुल रहा:
- Browser permissions check करें
- HTTPS use करें (localhost OK है)

### Detection slow है:
- Model size कम करें
- Frame rate reduce करें
- Use `tiny_face_detector` instead of `ssd_mobilenet`

### Eye detection accurate नहीं:
- Threshold values adjust करें
- Lighting improve करें
- Camera quality check करें

---

## Support

अगर आपको help चाहिए:
1. अपना existing code share करें
2. Error messages share करें
3. मैं उसे integrate करने में help करूंगा!

---

## File Locations

- **Main Component**: `src/components/WebcamEyeDetection.jsx`
- **Detection Utils**: `src/utils/faceApiDetection.js`
- **Live Monitoring**: `src/pages/LiveMonitoring.jsx`
- **Candidate View**: `src/pages/CandidateMonitoring.jsx`
