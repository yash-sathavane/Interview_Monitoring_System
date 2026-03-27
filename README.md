# Interview Monitoring System - Frontend

A complete React.js frontend for an AI-Based Interview Fake Detection System. This is a UI-only application with no backend integration.

## 🚀 Features

- **Role-based Login**: Separate interfaces for Interviewer/Admin and Candidate
- **Interviewer Dashboard**: Overview with stats and quick actions
- **Room Creation**: Generate unique room IDs and passwords
- **Live Monitoring**: Real-time detection status and alerts
- **Final Reports**: Comprehensive interview analysis
- **Candidate Interface**: Simple join and monitoring screens

## 🛠️ Tech Stack

- **React.js** 18.2.0
- **React Router** 6.20.0
- **Tailwind CSS** 3.3.6
- **React Icons** 4.12.0
- **Vite** 5.0.8

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   └── Sidebar.jsx         # Left sidebar navigation
├── pages/
│   ├── Login.jsx           # Login page with role selection
│   ├── InterviewerDashboard.jsx
│   ├── CreateRoom.jsx      # Room creation page
│   ├── LiveMonitoring.jsx  # Live detection monitoring
│   ├── FinalReport.jsx     # Interview summary report
│   ├── CandidateJoin.jsx   # Candidate room join
│   └── CandidateMonitoring.jsx
├── App.jsx                  # Main app with routing
├── main.jsx                 # React entry point
└── index.css                # Tailwind CSS styles
```

## 🎨 Pages Overview

### 1. Login Page (`/`)
- Role selection (Interviewer/Admin or Candidate)
- Email and password inputs
- Modern dark theme with blue accents

### 2. Interviewer Dashboard (`/interviewer/dashboard`)
- Statistics cards
- Quick actions
- Recent interviews list
- Sidebar navigation

### 3. Create Room (`/interviewer/create-room`)
- Generate room ID and password
- Copy to clipboard functionality
- Start monitoring button

### 4. Live Monitoring (`/interviewer/live-monitoring`)
- Real-time status cards (Webcam, Eye Movement, Head Position)
- Blink count and suspicion score
- Live alerts panel with timestamps
- Interview timer
- End interview button

### 5. Final Report (`/interviewer/report`)
- Interview duration
- Overall suspicion score
- Eye movement summary
- Head position summary
- Blink count statistics
- Risk level assessment
- Download report button

### 6. Candidate Join (`/candidate/join`)
- Room ID and password input
- Join room button

### 7. Candidate Monitoring (`/candidate/monitoring`)
- Status indicators
- Camera preview placeholder
- Interview guidelines
- No alerts visible to candidate

## 🎯 Key Features

- ✅ **No Backend Required**: All data is dummy/static
- ✅ **No Authentication**: UI-only navigation
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Modern UI**: Material-inspired design with Tailwind CSS
- ✅ **Smooth Navigation**: React Router for seamless page transitions
- ✅ **Professional Look**: Interview/proctoring system aesthetics

## 🎨 Design System

- **Primary Color**: Blue (#3b82f6)
- **Dark Theme**: Gray-900 background
- **Cards**: White with shadow
- **Icons**: React Icons library
- **Typography**: System fonts with Tailwind defaults

## 📝 Notes

- This is a **frontend-only** application
- No real authentication or data persistence
- All data is static/dummy for demonstration
- Perfect for UI/UX demonstration and prototyping

## 🚀 Development

The app runs on `http://localhost:3000` by default.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📄 License

This project is for demonstration purposes only.


