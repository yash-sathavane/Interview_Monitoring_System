import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { FaCopy, FaCheck, FaVideo } from 'react-icons/fa'

const CreateRoom = () => {
  const [roomCreated, setRoomCreated] = useState(false)
  const [roomId, setRoomId] = useState('')
  const [roomPassword, setRoomPassword] = useState('')
  const [copiedId, setCopiedId] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)
  const navigate = useNavigate()

  const generateRoom = () => {
    // Generate dummy room ID and password
    const id = Math.random().toString(36).substring(2, 8).toUpperCase()
    const password = Math.floor(1000 + Math.random() * 9000).toString()
    
    setRoomId(id)
    setRoomPassword(password)
    setRoomCreated(true)
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    if (type === 'id') {
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    } else {
      setCopiedPassword(true)
      setTimeout(() => setCopiedPassword(false), 2000)
    }
  }

  const handleStartMonitoring = () => {
    navigate('/interviewer/live-monitoring')
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8 mt-16">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Detection Room</h1>
            <p className="text-gray-600 mb-8">Generate a new room for interview monitoring</p>

            {!roomCreated ? (
              <div className="card text-center">
                <FaVideo className="mx-auto text-6xl text-blue-500 mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to Create a Room?
                </h2>
                <p className="text-gray-600 mb-8">
                  Click the button below to generate a unique room ID and password for your interview session.
                </p>
                <button
                  onClick={generateRoom}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  Create Detection Room
                </button>
              </div>
            ) : (
              <div className="card">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <FaCheck className="text-3xl text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Room Created Successfully!</h2>
                  <p className="text-gray-600">Share these details with the candidate</p>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Room ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room ID
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={roomId}
                        readOnly
                        className="input-field flex-1 font-mono text-lg font-bold"
                      />
                      <button
                        onClick={() => copyToClipboard(roomId, 'id')}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        title="Copy Room ID"
                      >
                        {copiedId ? (
                          <FaCheck className="text-green-600" />
                        ) : (
                          <FaCopy className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Room Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room Password
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={roomPassword}
                        readOnly
                        className="input-field flex-1 font-mono text-lg font-bold"
                      />
                      <button
                        onClick={() => copyToClipboard(roomPassword, 'password')}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        title="Copy Password"
                      >
                        {copiedPassword ? (
                          <FaCheck className="text-green-600" />
                        ) : (
                          <FaCopy className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Make sure to share both Room ID and Password with the candidate. 
                    They will need these to join the interview session.
                  </p>
                </div>

                <button
                  onClick={handleStartMonitoring}
                  className="w-full btn-primary py-3 text-lg font-semibold"
                >
                  Start Monitoring
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default CreateRoom
