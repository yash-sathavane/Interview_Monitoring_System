# Interview Monitoring System - Project Analysis

This document contains a comprehensive analysis of the "Interview Monitoring System" project. It is designed to provide ChatGPT or any AI assistant with full context about the project's architecture, technology stack, database schema, and functionality.

## 1. Project Overview
The **Interview Monitoring System** is a full-stack web application designed to monitor candidates during online interviews. It uses AI and system-level monitoring to detect suspicious behavior.

**Key Features:**
*   **Webcam Monitoring:** Uses MediaPipe/Face API to track eye movements and head position.
*   **System Monitoring:** Uses a Python backend to track tab switching, window focus, keyboard activity, and mouse movement.
*   **Real-time Alerts:** Notifies the interviewer of suspicious activities.
*   **Session Management:** Create and manage interview sessions.
*   **Reporting:** Generates detailed reports with risk analysis after the interview.

## 2. Technology Stack

### Frontend
*   **Framework:** React.js (Vite)
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **AI/CV Libraries:**
    *   `@mediapipe/face_mesh`: For facial landmark detection.
    *   `@mediapipe/camera_utils`: For camera handling.

### Backend (Main)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (Mongoose ODM)
*   **Authentication:** Custom (Simple Email/Password in `userController.cjs`)
*   **Communication:** REST API, CORS enabled.

### Backend (System Monitor)
*   **Language:** Python
*   **Framework:** Flask
*   **Libraries:**
    *   `pynput`: For monitoring keyboard and mouse events.
    *   `pygetwindow` / `pyrect`: For detecting active window/tab changes.

## 3. Project Structure

```
interview-monitoring-system/
├── backend/                  # Node.js Express Server
│   ├── config/               # DB Configuration (db.cjs)
│   ├── controllers/          # Business Logic (user, session, monitoring, etc.)
│   ├── models/               # Mongoose Schemas (User, Session, Monitoring, etc.)
│   ├── routes/               # API Routes
│   ├── server.cjs            # Entry Point
│   └── .env                  # Backend Environment Variables
├── python_backend/           # Python System Monitor Service
│   ├── app.py                # Flask Server Entry Point
│   ├── system_monitor.py     # System Monitoring Logic (pynput)
│   └── requirements.txt      # Python Dependencies
├── src/                      # React Frontend
│   ├── components/           # UI Components (Navbar, Sidebar, WebcamEyeDetection)
│   ├── hooks/                # Custom Hooks (useSystemStatus)
│   ├── pages/                # Pages (Login, Dashboard, LiveMonitoring, etc.)
│   ├── utils/                # Helper functions (eyeDetection.js)
│   ├── App.jsx               # Main Component
│   └── main.jsx              # Entry Point
├── .env                      # Root Environment Variables
└── package.json              # Project Dependencies & Scripts
```

## 4. Database Schema (MongoDB)

### Users Collection (`User.cjs`)
*   **name**: String
*   **email**: String (Unique)
*   **password**: String
*   **role**: Enum ["admin", "interviewer", "candidate"]

### Sessions Collection (`Session.cjs`)
*   **sessionId**: String (Unique)
*   **interviewerId**: ObjectId (Ref: User)
*   **status**: Enum ["created", "active", "completed"]
*   **createdAt**, **endedAt**: Date

### Monitoring Collection (`Monitoring.cjs`)
*   **sessionId**: String
*   **eyeMovement**: String (e.g., "Normal", "Suspicious")
*   **tabStatus**: Enum ["Same Tab", "Switched"]
*   **keyboardStatus**: Enum ["Typing", "Normal"]
*   **mouseStatus**: Enum ["Moving", "Normal"]
*   **timestamp**: Date

### Alerts Collection (`Alert.cjs`)
*   **sessionId**: String
*   **severity**: Enum ["LOW", "MEDIUM", "HIGH"]
*   **keyboard**, **mouse**, **tab**: Status Strings

### Reports Collection (`Report.cjs`)
*   **sessionId**: String
*   **totalAlerts**: Number
*   **riskLevel**: Enum ["SAFE", "SUSPICIOUS", "HIGH RISK"]
*   **finalDecision**: String

## 5. API Endpoints

### Node.js Backend (Port 4000)
*   **Users**:
    *   `POST /api/users/register`: Register new user.
    *   `POST /api/users/login`: Authenticate user.
*   **Sessions**:
    *   `POST /api/sessions/create`: Create new interview session.
    *   `GET /api/sessions/:id`: Get session details.
*   **Monitoring**:
    *   `POST /api/monitoring/log`: Save monitoring data.
    *   `GET /api/monitoring/:sessionId`: Get logs for a session.

### Python Backend (Port 5000)
*   `GET /system-status`: Returns current keyboard, mouse, and active window status.
*   `GET /health`: Health check.
*   `POST /start-monitor`: Start recording system events.
*   `POST /stop-monitor`: Stop recording.

## 6. Setup & Execution

**Prerequisites:**
*   Node.js installed.
*   Python installed.
*   MongoDB Connection String (in `.env`).

**Running the Project:**
The project uses `concurrently` to run all services with one command:
```bash
npm run dev
```
This starts:
1.  **Frontend**: http://localhost:3000
2.  **Backend**: http://localhost:4000
3.  **Python Monitor**: http://localhost:5000
