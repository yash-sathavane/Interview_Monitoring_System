# Key Code Snippets

## 1. Python System Monitor Logic (`python_backend/system_monitor.py`)
```python
class SystemMonitor:
    def __init__(self):
        self.keyboard_state = "Normal"
        self.mouse_state = "Normal"
        self.tab_state = "Same Tab"
        # ... (initialization)

    def _window_monitor_loop(self):
        while self.running:
            try:
                win = gw.getActiveWindow()
                if win and win.title:
                    with self.lock:
                        if self.last_active_window is None:
                            self.last_active_window = win.title
                        elif win.title != self.last_active_window:
                            self.tab_state = "Switched"
                            self.last_active_window = win.title
            except Exception:
                pass
            time.sleep(self.WINDOW_CHECK_INTERVAL)

    def _on_keyboard_press(self, key):
        with self.lock:
            self.keyboard_state = "Typing"
            self.last_keyboard_activity = time.time()
```

## 2. React MediaPipe Component (`src/components/MediaPipeDetection.jsx`)
```javascript
const MediaPipeDetection = ({ onDetectionUpdate }) => {
  // ... setup code
  const handleDetection = (detection) => {
      // Logic to update state and notify parent
      if (onDetectionUpdate) {
        onDetectionUpdate(detection)
      }
      drawDetection(detection)
  }
  // ... logic to start camera and load model
}
```

## 3. Backend Monitoring Controller (`backend/controllers/monitoringController.cjs`)
```javascript
exports.saveMonitoringData = async (req, res) => {
  try {
    const { sessionId, eyeMovement, tabStatus, ...rest } = req.body;
    
    const newRecord = new Monitoring({
      sessionId,
      eyeMovement: eyeMovement || "Normal",
      tabStatus: tabStatus || "Same Tab",
      // ... mapped fields
    });

    await newRecord.save();
    res.status(201).json({ message: "Data saved" });
  } catch (error) {
    // Error handling
  }
};
```

## 4. User Model (`backend/models/User.cjs`)
```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "interviewer", "candidate"],
    default: "candidate"
  }
}, { timestamps: true });
```
