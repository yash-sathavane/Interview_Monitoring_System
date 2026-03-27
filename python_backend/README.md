# Python System Monitoring Backend

This Python backend service monitors system-level activities (keyboard, mouse, and tab/window switching) for the interview monitoring system.

## Features

- **Keyboard Monitoring**: Detects typing activity using `pynput`
- **Mouse Monitoring**: Tracks mouse movement and clicks using `pynput`
- **Tab/Window Switching**: Detects when user switches between applications or browser tabs using `pygetwindow`
- **RESTful API**: Exposes `/system-status` endpoint for React frontend

## Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Windows-specific requirements:**
   - On Windows, `pynput` may require additional permissions
   - If you encounter permission issues, run the script as Administrator or grant necessary permissions

## Running the Service

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### GET `/system-status`
Returns the current system status:
```json
{
  "keyboard": "Normal | Typing",
  "mouse": "Normal | Moving",
  "tab": "Same Tab | Switched"
}
```

### GET `/health`
Health check endpoint:
```json
{
  "status": "ok",
  "monitor_active": true
}
```

### POST `/start-monitor`
Manually start the monitoring service.

### POST `/stop-monitor`
Stop the monitoring service.

## How It Works

1. **Keyboard Monitoring**: Listens for key presses. If a key is pressed, status changes to "Typing". After 2 seconds of inactivity, it returns to "Normal".

2. **Mouse Monitoring**: Tracks mouse movement and clicks. If the mouse moves or is clicked, status changes to "Moving". After 3 seconds of inactivity, it returns to "Normal".

3. **Tab/Window Switching**: Periodically checks the active window. If the active window changes, status changes to "Switched" for 1 second, then returns to "Same Tab".

## Integration with React

The React frontend should poll the `/system-status` endpoint periodically (e.g., every 500ms-1s) to get real-time updates.

Example fetch:
```javascript
fetch('http://localhost:5000/system-status')
  .then(res => res.json())
  .then(data => {
    console.log(data.keyboard, data.mouse, data.tab);
  });
```

## Security Notes

- This service monitors system-level activities and should only be used in controlled environments
- The service runs on `0.0.0.0:5000` by default - adjust for production use
- Consider adding authentication/authorization for production deployments

## Troubleshooting

- **Permission Errors**: On Windows, you may need to run as Administrator
- **Import Errors**: Ensure all dependencies are installed: `pip install -r requirements.txt`
- **CORS Issues**: The Flask app includes CORS middleware, but ensure the React app is configured correctly

