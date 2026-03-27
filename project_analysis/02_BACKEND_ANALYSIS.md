# Backend Analysis (Node.js)

## Structure
The backend is built with Express.js and follows the MVC (Model-View-Controller) pattern.

### Directory Structure
- `config/`: Database connection (`db.cjs`).
- `controllers/`: Logic for handling requests (`userController`, `monitoringController`, etc.).
- `models/`: Mongoose schemas defining data structure.
- `routes/`: API route definitions mapping URLs to controllers.
- `server.cjs`: Entry point, middleware setup, and server initialization.

## API Endpoints

### 1. User Management (`/api/users`)
- `POST /register`: Creates a new user (Candidate or Interviewer).
- `POST /login`: Authenticates user and returns user details.
- `GET /test-db-connection`: (Added utility) Checks MongoDB connectivity.

### 2. Monitoring (`/api/monitoring`)
- `POST /save`: Receives a snapshot of monitoring data (eye, head, system status) and saves it to MongoDB.
- `GET /session/:sessionId`: Retrieves the latest monitoring logs for a specific session (used by the dashboard).

### 3. Sessions (`/api/sessions`)
- Manages interview sessions (creation, joining, status updates).

### 4. Admin (`/api/admin`)
- Likely for higher-level management (not fully analyzed in snippets but standard pattern).

## Database Connection
- Uses `mongoose` to connect to MongoDB Atlas.
- Connection string is loaded from `.env` file (`MONGO_URI`).
- Includes error handling to log connection failures.

## Key Logic
- **Monitoring Controller**: The `saveMonitoringData` function is the core. It is designed to be hit frequently (e.g., every few seconds) by the candidate's frontend. It stores a granular history of the session.
- **User Controller**: Handles simple email/password authentication. Passwords currently seem to be stored as plain text or simple comparison based on the snippets (Recommendation for production: Add bcrypt hashing).
