import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserTie, FaUser, FaLock, FaEnvelope } from 'react-icons/fa'

const Login = ({ setUserRole }) => {
  const [selectedRole, setSelectedRole] = useState('interviewer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (selectedRole === 'interviewer') {
      navigate('/interviewer/dashboard')
    } else {
      navigate('/candidate/join')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Interview Monitoring System</h1>
          <p className="text-gray-300">AI-Based Fake Detection</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole('interviewer')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedRole === 'interviewer'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaUserTie className="mx-auto mb-2 text-2xl" />
                <div className="font-semibold">Interviewer / Admin</div>
              </button>
              <button
                onClick={() => setSelectedRole('candidate')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedRole === 'candidate'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaUser className="mx-auto mb-2 text-2xl" />
                <div className="font-semibold">Candidate</div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3 text-lg font-semibold"
            >
              Login
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Demo Application - No real authentication required
        </p>
      </div>
    </div>
  )
}

export default Login
