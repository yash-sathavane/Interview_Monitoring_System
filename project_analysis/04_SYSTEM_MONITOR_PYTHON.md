# System Monitor Analysis (Python)

## Purpose
Browsers (JavaScript) cannot access OS-level details like "Which window is active?" or "Is the user typing inside Notepad?". This Python script bridges that gap.

## Technology
- **Flask**: Creates a lightweight HTTP server on `localhost:5000`.
- **pynput**: Hooks into the OS input stream to listen for global keyboard and mouse events.
- **pygetwindow**: Queries the Windows API to get the title of the currently focused window.

## Code Structure (`system_monitor.py`)

### Class `SystemMonitor`
- **State Variables**:
    - `self.keyboard_state`: "Typing" or "Normal".
    - `self.mouse_state`: "Moving" or "Normal".
    - `self.tab_state`: "Same Tab" or "Switched".
- **Threads**:
    - **Window Monitor Loop**: Runs infinitely, checking `gw.getActiveWindow()` every 0.5 seconds. If the window title changes, it marks `tab_state` as "Switched".
    - **Listeners**: `pynput` listeners run in background threads to detect input.

### API (`app.py`)
- **`GET /system-status`**: Returns the current state as JSON:
  ```json
  {
    "keyboard": "Typing",
    "mouse": "Normal",
    "tab": "Same Tab"
  }
  ```
- **`GET /health`**: Simple health check.

## Integration Flow
1. React Frontend calls `fetch('http://localhost:5000/system-status')`.
2. Flask returns the latest state stored in the `SystemMonitor` class instance.
3. React combines this with camera data and sends it to the main backend.
