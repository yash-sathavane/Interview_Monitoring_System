import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import InterviewerDashboard from './pages/InterviewerDashboard'
import CreateRoom from './pages/CreateRoom'
import LiveMonitoring from './pages/LiveMonitoring'
import FinalReport from './pages/FinalReport'
import CandidateJoin from './pages/CandidateJoin'
import CandidateMonitoring from './pages/CandidateMonitoring'

function App() {
  const [userRole, setUserRole] = useState(null)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUserRole={setUserRole} />} />
        <Route path="/interviewer/dashboard" element={<InterviewerDashboard />} />
        <Route path="/interviewer/create-room" element={<CreateRoom />} />
        <Route path="/interviewer/live-monitoring" element={<LiveMonitoring />} />
        <Route path="/interviewer/report" element={<FinalReport />} />
        <Route path="/candidate/join" element={<CandidateJoin />} />
        <Route path="/candidate/monitoring" element={<CandidateMonitoring />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
