# System Monitoring Integration Guide

This document explains how the system-level monitoring (keyboard, mouse, tab switching) is integrated into the interview monitoring system.

## Architecture Overview

The system uses a **separation of concerns** approach:

- **Python Backend**: Handles all system-level monitoring (keyboard, mouse, window switching)
- **React Frontend**: Displays the status received from Python via HTTP polling
- **Communication**: HTTP REST API with polling mechanism

```
┌─────────────────┐         HTTP Polling         ┌──────────────────┐
│  React Frontend │  <──────────────────────────> │  Python Backend  │
│  (Display Only) │                                │  (Monitoring)    │
└─────────────────┘                                └──────────────────┘
                                                           │
                                                           │
                                                    ┌──────▼──────┐
                                                    │  System     │
                                                    │  (pynput,   │
                                                    │   pygetwin) │
                                                    └─────────────┘
```

## Components

### 1. Python Backend (`python_backend/`)

#### Files:
- **`system_monitor.py`**: Core monitoring logic using `pynput` and `pygetwindow`
- **`app.py`**: Flask API server exposing `/system-status` endpoint
- **`requirements.txt`**: Python dependencies

#### Features:
- **Keyboard Monitoring**: Detects typing activity using `pynput.keyboard`
- **Mouse Monitoring**: Tracks mouse movement and clicks using `pynput.mouse`
- **Tab/Window Switching**: Detects application/window changes using `pygetwindow`
- **Thread-Safe**: Uses locks for concurrent access
- **State Management**: Tracks activity timestamps and thresholds

#### API Endpoints:

**GET `/system-status`**
```json
{
  "keyboard": "Normal | Typing",
  "mouse": "Normal | Moving",
  "tab": "Same Tab | Switched"
}
```

**GET `/health`**
```json
{
  "status": "ok",
  "monitor_active": true
}
```

### 2. React Frontend Integration

#### Custom Hook: `src/hooks/useSystemStatus.js`

A reusable React hook that:
- Polls the Python API at configurable intervals (default: 1000ms)
- Manages loading and error states
- Provides automatic cleanup on component unmount

**Usage:**
```javascript
import useSystemStatus from '../hooks/useSystemStatus'

const { status, loading, error } = useSystemStatus(1000, 'http://localhost:5000')
// status.keyboard, status.mouse, status.tab
```

#### Integrated Pages:

1. **`LiveMonitoring.jsx`**: 
   - Displays real-time system status cards
   - Updates suspicion score based on system monitoring
   - Generates alerts for tab switching events

2. **`InterviewerDashboard.jsx`**:
   - Shows system monitoring status overview
   - Displays connection status

## Setup Instructions

### Step 1: Install Python Dependencies

```bash
cd python_backend
pip install -r requirements.txt
```

**Required packages:**
- `flask==3.0.0` - Web framework
- `flask-cors==4.0.0` - CORS support
- `pynput==1.7.6` - Keyboard and mouse monitoring
- `pygetwindow==0.0.9` - Window/tab detection

### Step 2: Start Python Backend

```bash
cd python_backend
python app.py
```

The server will start on `http://localhost:5000`

**Important Notes:**
- On Windows, you may need to run as Administrator for system-level monitoring
- The service runs continuously in the background
- CORS is enabled for React frontend access

### Step 3: Start React Frontend

```bash
npm install  # If not already done
npm run dev
```

The React app will start on `http://localhost:5173` (or similar Vite port)

### Step 4: Verify Integration

1. Open the React app in your browser
2. Navigate to **Interviewer Dashboard** or **Live Monitoring**
3. You should see system monitoring status cards
4. Try typing, moving mouse, or switching windows to see status updates

## How It Works

### Keyboard Monitoring

- **Detection**: Listens for key press events using `pynput.keyboard.Listener`
- **State Logic**: 
  - On key press → Status changes to "Typing"
  - After 2 seconds of inactivity → Status returns to "Normal"

### Mouse Monitoring

- **Detection**: Tracks mouse movement and click events using `pynput.mouse.Listener`
- **State Logic**:
  - On mouse move/click → Status changes to "Moving"
  - After 3 seconds of inactivity → Status returns to "Normal"

### Tab/Window Switching

- **Detection**: Periodically checks active window using `pygetwindow.getActiveWindow()`
- **State Logic**:
  - When active window changes → Status changes to "Switched"
  - After 2 seconds → Status returns to "Same Tab"
  - Checks every 0.5 seconds

### React Polling

- **Frequency**: Polls every 1 second (configurable)
- **Error Handling**: Shows connection error if Python backend is unavailable
- **State Updates**: Automatically updates UI when status changes

## Suspicion Score Integration

The system monitoring data is integrated into the suspicion score calculation:

```javascript
// Base score from webcam detection
let score = 0
if (eyeMovement === 'Looking Away') score += 20
if (headPosition !== 'Center') score += 15

// System monitoring adds to score
if (tab === 'Switched') score += 25  // Tab switching is highly suspicious
if (keyboard === 'Typing' && eyeMovement === 'Looking Away') score += 15
if (mouse === 'Moving' && eyeMovement === 'Looking Away') score += 10
```

## Alerts System

System monitoring events trigger alerts:

- **Tab/Window Switch**: Creates a "danger" level alert
- **Typing while looking away**: Can trigger warnings (combined with webcam data)

## Troubleshooting

### Python Backend Issues

**Problem**: Permission errors on Windows
- **Solution**: Run Python script as Administrator

**Problem**: Import errors
- **Solution**: Ensure all dependencies are installed: `pip install -r requirements.txt`

**Problem**: CORS errors
- **Solution**: Flask-CORS is already configured, but ensure React app URL is allowed

### React Frontend Issues

**Problem**: "Cannot connect to monitoring service"
- **Solution**: 
  1. Ensure Python backend is running on `http://localhost:5000`
  2. Check browser console for CORS errors
  3. Verify firewall isn't blocking the connection

**Problem**: Status not updating
- **Solution**:
  1. Check browser Network tab to see if requests are being made
  2. Verify Python backend `/system-status` endpoint is responding
  3. Check browser console for JavaScript errors

### System Monitoring Not Working

**Problem**: Keyboard/Mouse not detected
- **Solution**: 
  1. Ensure `pynput` has necessary permissions
  2. On Windows, may need to run as Administrator
  3. Check if antivirus is blocking the monitoring

**Problem**: Tab switching not detected
- **Solution**:
  1. `pygetwindow` may have limitations on some systems
  2. Try switching between different applications (not just browser tabs)
  3. Check if window titles are being captured correctly

## Security Considerations

⚠️ **Important Security Notes:**

1. **System-Level Access**: This monitoring requires system-level permissions
2. **Privacy**: Only use in controlled, consent-based environments (interview proctoring)
3. **Network**: The API runs on `0.0.0.0:5000` by default - restrict in production
4. **Authentication**: Consider adding authentication for production use
5. **Data Storage**: Currently no data is stored - add logging if needed

## Production Deployment

For production deployment:

1. **Change API URL**: Update `useSystemStatus` hook to use production API URL
2. **Add Authentication**: Implement API key or JWT authentication
3. **HTTPS**: Use HTTPS for secure communication
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Error Logging**: Implement proper error logging and monitoring
6. **Database**: Consider storing monitoring events for audit trails

## API Configuration

To change the API URL in React:

```javascript
// In useSystemStatus hook call
const { status } = useSystemStatus(1000, 'https://your-api-domain.com')
```

Or create an environment variable:

```javascript
// .env file
VITE_API_URL=http://localhost:5000

// In component
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const { status } = useSystemStatus(1000, apiUrl)
```

## Testing

### Manual Testing Checklist

- [ ] Python backend starts without errors
- [ ] `/system-status` endpoint returns valid JSON
- [ ] React frontend displays system status
- [ ] Keyboard typing is detected
- [ ] Mouse movement is detected
- [ ] Window switching is detected
- [ ] Status updates in real-time
- [ ] Error handling works when backend is down
- [ ] Suspicion score includes system monitoring
- [ ] Alerts are generated for tab switching

## Future Enhancements

Potential improvements:

1. **WebSocket Support**: Replace polling with WebSocket for real-time updates
2. **Browser Tab Detection**: More accurate browser tab switching detection
3. **Application Whitelist**: Allow certain applications during interview
4. **Screenshot Capture**: Capture screenshots on suspicious events
5. **Advanced Analytics**: Track patterns and trends
6. **Multi-platform Support**: Better cross-platform compatibility

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in console/logs
3. Verify all dependencies are installed
4. Ensure proper permissions are granted

---

**Last Updated**: Integration completed with React frontend and Python backend fully connected.


