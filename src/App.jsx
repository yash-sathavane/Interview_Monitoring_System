import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateRoom from './pages/CreateRoom'
import LiveMonitoring from './pages/LiveMonitoring'
import CandidateJoin from './pages/CandidateJoin'
import CandidateMonitoring from './pages/CandidateMonitoring'
import InterviewerDashboard from './pages/InterviewerDashboard'
import ReportsList from './pages/ReportsList'
import FinalReport from './pages/FinalReport'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Interviewer Routes */}
        <Route path="/interviewer/create-room" element={<CreateRoom />} />
        <Route path="/interviewer/live-monitoring/:sessionId" element={<LiveMonitoring />} />
        <Route path="/interviewer/dashboard" element={<InterviewerDashboard />} />
        <Route path="/interviewer/reports" element={<ReportsList />} />
        <Route path="/interviewer/report/:sessionId" element={<FinalReport />} />

        {/* Candidate Routes */}
        <Route path="/candidate/join" element={<CandidateJoin />} />
        <Route path="/candidate/monitoring" element={<CandidateMonitoring />} />
      </Routes>
    </Router>
  )
}

export default App
