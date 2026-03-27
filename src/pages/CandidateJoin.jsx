import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaKey, FaLock, FaSignInAlt } from 'react-icons/fa'

const CandidateJoin = () => {
  const [roomId, setRoomId] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [roomPassword, setRoomPassword] = useState('')
  const navigate = useNavigate()

  const handleJoin = async (e) => {
    e.preventDefault()
    if (roomId && candidateName) {
      try {
        const response = await fetch('http://localhost:4000/api/sessions/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
              sessionId: roomId,
              candidateName: candidateName 
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store session ID for use in monitoring page
          localStorage.setItem('currentSessionId', roomId);
          navigate('/candidate/monitoring');
        } else {
          if (response.status === 404) {
             alert('Session not found! Please check the Room ID or ask the interviewer for a new one.');
          } else {
             alert('Failed to join: ' + (data.error || 'Unknown error'));
          }
        }
      } catch (error) {
        console.error('Error joining session:', error);
        alert('Error connecting to server. Please ensure the backend is running.');
      }
    } else {
      alert('Please enter Room ID and Name')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Join Interview Room</h1>
          <p className="text-gray-300">Enter your room credentials to begin</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room ID
              </label>
              <div className="relative">
                <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="input-field pl-10 font-mono"
                  placeholder="Enter Room ID"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <FaSignInAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Password field removed as per new simplified requirement */}


            <button
              type="submit"
              className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center space-x-2"
            >
              <FaSignInAlt />
              <span>Join Room</span>
            </button>
          </form>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Make sure you have a stable internet connection and your webcam is ready before joining.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateJoin


