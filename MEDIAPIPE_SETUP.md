# MediaPipe Eye & Head Detection Setup

## ✅ Installation

```bash
cd C:\Users\Aastha\Desktop\interview-monitoring-system
npm install
```

## 🚀 Your Python Code Converted to JavaScript

आपका Python code अब React में convert हो गया है:

### Python Code (Original):
```python
# Eye detection
if nose_x < 0.45:
    eye_status = "LOOKING RIGHT"
elif nose_x > 0.55:
    eye_status = "LOOKING LEFT"
else:
    eye_status = "LOOKING CENTER"

# Head detection
if nose_y > 0.6:
    head_status = "HEAD DOWN"
elif nose_y < 0.4:
    head_status = "HEAD UP"
else:
    head_status = "HEAD STRAIGHT"
```

### JavaScript Code (Converted):
```javascript
// Eye detection (same logic)
if (nose_x < 0.45) {
  eyeMovement = "Looking Away" // Looking Right
} else if (nose_x > 0.55) {
  eyeMovement = "Looking Away" // Looking Left
} else {
  eyeMovement = "Looking Center"
}

// Head detection (same logic)
if (nose_y > 0.6) {
  headPosition = "Down"
} else if (nose_y < 0.4) {
  headPosition = "Up"
} else {
  headPosition = "Center"
}
```

## 📁 Files Created

1. **`src/utils/mediapipeDetection.js`** - Your detection logic
2. **`src/components/MediaPipeDetection.jsx`** - React component
3. **Updated pages** - LiveMonitoring & CandidateMonitoring

## 🎯 Features

✅ **Eye Direction Detection** - Nose X position se (0.45, 0.55 thresholds)
✅ **Head Position Detection** - Nose Y position se (0.4, 0.6 thresholds)
✅ **Real-time Detection** - Live webcam feed
✅ **Visual Overlay** - Green circle on nose (like your cv2.circle)
✅ **Status Display** - Eye and Head status text

## 🔧 How It Works

1. **MediaPipe Face Mesh** loads automatically
2. **Camera** starts (640x480, same as your code)
3. **Detection** runs on every frame
4. **Nose landmark** (index 1) se eye & head detect hota hai
5. **Results** real-time update hote hain

## 🎨 Visual Output

- **Green circle** on nose point (like cv2.circle)
- **Cyan text** for eye status (like cv2.putText)
- **Red text** for head status
- **Mirror effect** (like cv2.flip)

## ⚙️ Configuration

Thresholds adjust karne ke liye `src/utils/mediapipeDetection.js` mein:

```javascript
// Eye detection thresholds
if (nose_x < 0.45) {  // Adjust 0.45
  eyeMovement = "Looking Away"
} else if (nose_x > 0.55) {  // Adjust 0.55
  eyeMovement = "Looking Away"
}

// Head detection thresholds
if (nose_y > 0.6) {  // Adjust 0.6
  headPosition = "Down"
} else if (nose_y < 0.4) {  // Adjust 0.4
  headPosition = "Up"
}
```

## 🚀 Run

```bash
npm run dev
```

Browser mein:
1. Webcam permission allow करें
2. Live Monitoring page पर जाएं
3. Real-time detection देखें!

## 📝 Notes

- MediaPipe models CDN se automatically load hote hain
- No local model files needed
- Works in browser directly
- Same logic as your Python code

## 🐛 Troubleshooting

**Webcam नहीं खुल रहा:**
- Browser permissions check करें
- HTTPS use करें (localhost OK है)

**Detection slow है:**
- Browser console check करें
- Camera resolution reduce करें

**Thresholds adjust करना है:**
- `mediapipeDetection.js` file में values change करें


