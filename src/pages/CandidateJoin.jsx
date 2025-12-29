import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaKey, FaLock, FaSignInAlt } from 'react-icons/fa'

const CandidateJoin = () => {
  const [roomId, setRoomId] = useState('')
  const [roomPassword, setRoomPassword] = useState('')
  const navigate = useNavigate()

  const handleJoin = (e) => {
    e.preventDefault()
    if (roomId && roomPassword) {
      navigate('/candidate/monitoring')
    } else {
      alert('Please enter both Room ID and Password')
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
                Room Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  className="input-field pl-10 font-mono"
                  placeholder="Enter Password"
                  required
                />
              </div>
            </div>

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
