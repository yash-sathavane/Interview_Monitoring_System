# Setup Instructions - MediaPipe Eye Detection

## आपका Python Code अब React में Ready है! 🎉

### Step 1: Dependencies Install करें

```bash
cd C:\Users\Aastha\Desktop\interview-monitoring-system
npm install
```

यह automatically install करेगा:
- `@mediapipe/face_mesh` - आपका MediaPipe Face Mesh
- `@mediapipe/camera_utils` - Camera handling
- `@mediapipe/drawing_utils` - Drawing utilities

### Step 2: App Run करें

```bash
npm run dev
```

### Step 3: Browser में Test करें

1. Browser में `http://localhost:3000` खोलें
2. Login करें (Interviewer role select करें)
3. "Live Monitoring" page पर जाएं
4. Webcam permission allow करें
5. Real-time detection देखें!

---

## आपका Code कैसे Integrate हुआ

### Python Code → JavaScript Conversion:

#### 1. MediaPipe Initialization:
```python
# Python (आपका code)
mp_face = mp.solutions.face_mesh
face_mesh = mp_face.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)
```

```javascript
// JavaScript (React में)
faceMeshRef.current = new FaceMesh({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
})
```

#### 2. Eye Detection Logic:
```python
# Python (आपका code)
if nose_x < 0.45:
    eye_status = "LOOKING RIGHT"
elif nose_x > 0.55:
    eye_status = "LOOKING LEFT"
else:
    eye_status = "LOOKING CENTER"
```

```javascript
// JavaScript (same logic)
if (nose_x < 0.45) {
  return 'LOOKING RIGHT'
} else if (nose_x > 0.55) {
  return 'LOOKING LEFT'
} else {
  return 'LOOKING CENTER'
}
```

#### 3. Head Position Detection:
```python
# Python (आपका code)
if nose_y > 0.6:
    head_status = "HEAD DOWN"
elif nose_y < 0.4:
    head_status = "HEAD UP"
else:
    head_status = "HEAD STRAIGHT"
```

```javascript
// JavaScript (same logic)
if (nose_y > 0.6) {
  return 'HEAD DOWN'
} else if (nose_y < 0.4) {
  return 'HEAD UP'
} else {
  return 'HEAD STRAIGHT'
}
```

---

## Files Created/Updated

1. **`src/utils/mediapipeDetection.js`**
   - आपका detection logic
   - Eye direction detection
   - Head position detection

2. **`src/components/WebcamEyeDetection.jsx`**
   - MediaPipe integration
   - Real-time webcam feed
   - Detection visualization

3. **`package.json`**
   - MediaPipe dependencies added

---

## Features

✅ **Real-time Eye Detection** - आपके Python code जैसा
✅ **Head Position Detection** - Same logic
✅ **Live Visualization** - Nose point और text display
✅ **Automatic Updates** - Parent components को notify करता है

---

## Troubleshooting

### Webcam नहीं खुल रहा:
- Browser permissions check करें
- HTTPS use करें (localhost OK है)

### Detection slow है:
- Browser console check करें
- Internet connection check करें (models CDN से load होते हैं)

### Eye/Head detection accurate नहीं:
- Threshold values adjust करें (`mediapipeDetection.js` में)
- Lighting improve करें
- Camera quality check करें

---

## Customization

अगर आप thresholds change करना चाहते हैं:

`src/utils/mediapipeDetection.js` में:
```javascript
// Eye detection thresholds
if (nose_x < 0.45) {  // Change 0.45
  return 'LOOKING RIGHT'
} else if (nose_x > 0.55) {  // Change 0.55
  return 'LOOKING LEFT'
}

// Head detection thresholds
if (nose_y > 0.6) {  // Change 0.6
  return 'HEAD DOWN'
} else if (nose_y < 0.4) {  // Change 0.4
  return 'HEAD UP'
}
```

---

## Next Steps

1. ✅ Dependencies install करें
2. ✅ App run करें
3. ✅ Test करें
4. ✅ Thresholds adjust करें (अगर जरूरत हो)

**Enjoy your real-time eye and head detection! 🚀**
