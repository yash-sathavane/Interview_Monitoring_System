# Frontend Analysis (React)

## Structure
The frontend is a Vite + React application using Tailwind CSS for styling.

### Key Directories
- `src/components/`: Reusable UI components and Logic wrappers (e.g., `MediaPipeDetection`).
- `src/pages/`: Main application views (Login, Dashboard, Monitoring).
- `src/utils/`: Helper functions, specifically for Computer Vision logic.
- `src/hooks/`: Custom hooks (e.g., `useSystemStatus` to poll Python backend).

## Core Components

### 1. MediaPipeDetection (`src/components/MediaPipeDetection.jsx`)
- **Purpose**: Wraps the MediaPipe Face Mesh library to track facial features.
- **Logic**:
    - Initializes the camera.
    - Loads the Face Mesh model.
    - Draws landmarks on a canvas overlay.
    - Calculates `eyeMovement` (Left/Right/Center) and `headPosition`.
- **Output**: Passes detection state up to the parent page via `onDetectionUpdate`.

### 2. CandidateMonitoring Page
- **Purpose**: The main view for the candidate during an interview.
- **Integration**:
    - Renders `<MediaPipeDetection />`.
    - Uses `useSystemStatus` to fetch data from Python (`localhost:5000`).
    - Combines both data sources.
    - Sends data to Node.js backend (`/api/monitoring/save`).

### 3. InterviewerDashboard
- **Purpose**: View for the interviewer.
- **Logic**: Polls the Node.js backend (`/api/monitoring/session/:id`) to display the candidate's live status.

## State Management
- Uses local component state (`useState`) for immediate UI updates.
- Uses `useEffect` for:
    - Polling intervals (fetching system status).
    - Initializing camera.
    - Sending data heartbeats to the server.

## Computer Vision Logic
- **Library**: `@mediapipe/face_mesh`
- **Detection**:
    - **Head**: Likely calculated based on the nose landmark position relative to the frame center.
    - **Eyes**: Likely calculated based on the iris position within the eye landmarks.
