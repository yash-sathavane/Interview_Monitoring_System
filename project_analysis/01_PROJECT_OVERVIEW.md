# Project Overview: Interview Monitoring System

## Introduction
The Interview Monitoring System is an AI-powered proctoring solution designed to monitor candidates during online interviews. It uses a combination of computer vision (for eye/head tracking) and system-level monitoring (for tab switching, keyboard, and mouse activity) to ensure integrity.

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Computer Vision**: MediaPipe (Face Mesh) for eye and head tracking
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Custom (Email/Password) - *Note: JWT not explicitly seen in snippets but likely structure supports it.*

### System Monitor (Desktop Agent)
- **Language**: Python 3
- **Framework**: Flask (Exposes local API for the frontend)
- **Libraries**:
  - `pynput`: For tracking global keyboard and mouse events.
  - `pygetwindow`: For detecting active window titles (Tab switching detection).

## Architecture

The system consists of three distinct services running concurrently:

1.  **Frontend (Port 3000)**:
    - The user interface for both Interviewers and Candidates.
    - Captures webcam feed and runs MediaPipe locally in the browser for eye/head tracking.
    - Polls the local Python System Monitor service to get system status.
    - Sends aggregated data (Vision + System) to the Node.js Backend.

2.  **Node.js Backend (Port 4000)**:
    - Central API server.
    - Manages Users, Sessions, and stores Monitoring Logs.
    - Connects to MongoDB Atlas.

3.  **Python System Monitor (Port 5000)**:
    - Runs locally on the candidate's machine.
    - Acts as a bridge between the Operating System and the Web Browser.
    - Monitors:
        - Active Window Title (to detect tab switching).
        - Keyboard typing patterns.
        - Mouse movement intensity.
    - Exposes these metrics via a simple REST API (`GET /system-status`).

## Data Flow
1.  **Candidate** logs in and joins a session.
2.  **Frontend** initializes:
    - Webcam (MediaPipe starts tracking eyes/head).
    - Polling to `localhost:5000` (Python Monitor) to get system status.
3.  **Python Monitor** tracks OS-level events in the background.
4.  **Frontend** combines data:
    - `{ eye: "Left", head: "Center", tab: "Switched", keyboard: "Typing" }`
5.  **Frontend** sends this payload to **Backend** (`POST /api/monitoring/save`).
6.  **Backend** saves to **MongoDB**.
7.  **Interviewer** views the **Dashboard**, which fetches this data in real-time.

## Key Features
- **Eye & Head Tracking**: Detects if the candidate looks away or moves their head excessively.
- **Tab Switch Detection**: Detects if the candidate leaves the interview window.
- **Activity Logging**: Records mouse and keyboard intensity.
- **Real-time Dashboard**: Interviewers can see live status updates.
