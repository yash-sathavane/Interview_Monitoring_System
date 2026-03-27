# Quick Start Commands

## Step 1: Install Python Dependencies

Open a terminal in the project root and run:

```bash
cd python_backend
pip install -r requirements.txt
```

## Step 2: Start Python Backend

Keep the terminal open and run:

```bash
python app.py
```

**Expected output:**
```
System monitor started successfully
Starting Flask server on http://localhost:5000
API Endpoints:
  GET  /system-status - Get current system status
  GET  /health - Health check
  POST /start-monitor - Start monitoring
  POST /stop-monitor - Stop monitoring
 * Running on http://0.0.0.0:5000
```

**Note:** On Windows, if you get permission errors, run as Administrator:
- Right-click PowerShell/Command Prompt → "Run as Administrator"
- Then run: `cd python_backend && python app.py`

## Step 3: Start React Frontend

Open a **NEW terminal window** (keep Python backend running) and run:

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 4: Open in Browser

1. Open your browser
2. Navigate to: `http://localhost:5173`
3. Login and go to **Interviewer Dashboard** or **Live Monitoring**
4. You should see system monitoring status cards

## All-in-One Commands (Windows PowerShell)

### Terminal 1 - Python Backend:
```powershell
cd python_backend
pip install -r requirements.txt
python app.py
```

### Terminal 2 - React Frontend:
```powershell
npm install
npm run dev
```

## Verify It's Working

1. **Check Python Backend**: Open `http://localhost:5000/health` in browser
   - Should return: `{"status":"ok","monitor_active":true}`

2. **Check System Status**: Open `http://localhost:5000/system-status` in browser
   - Should return: `{"keyboard":"Normal","mouse":"Normal","tab":"Same Tab"}`

3. **Check React App**: Open `http://localhost:5173`
   - Should show the login page
   - Navigate to dashboard to see system monitoring cards

## Troubleshooting

**Python backend won't start:**
- Make sure port 5000 is not in use
- Run as Administrator on Windows
- Check if all dependencies are installed: `pip list`

**React frontend won't start:**
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 5173 is available

**System monitoring not working:**
- Ensure Python backend is running
- Check browser console for errors
- Verify CORS is enabled (already configured)


