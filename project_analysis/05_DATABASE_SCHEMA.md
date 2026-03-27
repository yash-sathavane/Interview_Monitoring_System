# Database Schema Analysis (MongoDB)

The application uses **5 main collections** to store data.

## 1. Users Collection
Stores account information for authentication.
- `name`: String
- `email`: String (Unique)
- `password`: String
- `role`: Enum ["admin", "interviewer", "candidate"]

## 2. Sessions Collection
Represents a scheduled or active interview instance.
- `sessionId`: String (Unique ID for the room)
- `interviewerId`: Reference to User
- `candidateEmail`: String
- `status`: Enum ["created", "active", "completed"]
- `createdAt`: Date
- `endedAt`: Date

## 3. Monitoring Collection (The "Black Box" Data)
Stores the high-frequency logs generated during an interview. This is the bulk of the data.
- `sessionId`: String (Links to Session)
- `userId`: String
- `eyeMovement`: String (e.g., "Looking Left")
- `headPosition`: String (e.g., "Down")
- `tabStatus`: Enum ["Same Tab", "Switched"]
- `keyboardStatus`: Enum ["Typing", "Normal"]
- `mouseStatus`: Enum ["Moving", "Normal"]
- `timestamp`: Date

## 4. Alerts Collection
Stores significant violation events (subset of Monitoring, but filtered for severity).
- `sessionId`: String
- `type`: String (e.g., "Tab Switch")
- `severity`: Enum ["LOW", "MEDIUM", "HIGH"]
- `createdAt`: Date

## 5. Reports Collection
Stores the summarized outcome of an interview session.
- `sessionId`: String
- `totalAlerts`: Number
- `tabSwitchCount`: Number
- `riskLevel`: Enum ["SAFE", "SUSPICIOUS", "HIGH RISK"]
- `finalDecision`: String (e.g., "Pending", "Reject")
