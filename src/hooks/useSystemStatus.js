import { useState, useEffect, useRef } from 'react'

/**
 * Custom React hook to fetch system status from Python backend.
 * Polls the /system-status endpoint periodically.
 * 
 * @param {number} pollInterval - Polling interval in milliseconds (default: 1000ms)
 * @param {string} apiUrl - Base URL for the Python API (default: http://127.0.0.1:5000)
 * @returns {Object} System status object with keyboard, mouse, tab, loading, and error states
 */
export const useSystemStatus = (pollInterval = 1000, apiUrl = 'http://127.0.0.1:5000') => {
  const [status, setStatus] = useState({
    keyboard: 'Unknown',
    mouse: 'Unknown',
    tab: 'Unknown',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch(`${apiUrl}/system-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Handle error response from API
      if (data.error) {
        throw new Error(data.error)
      }

      setStatus({
        keyboard: data.keyboard || 'Unknown',
        mouse: data.mouse || 'Unknown',
        tab: data.tab || 'Unknown',
      })
      setError(null)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching system status:', err)
      setError(err.message)
      setLoading(false)
      
      // Set fallback status on error
      setStatus({
        keyboard: 'Error',
        mouse: 'Error',
        tab: 'Error',
      })
    }
  }

  useEffect(() => {
    // Fetch immediately on mount
    fetchSystemStatus()

    // Set up polling interval
    intervalRef.current = setInterval(fetchSystemStatus, pollInterval)

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [pollInterval, apiUrl])

  return {
    status,
    loading,
    error,
    refetch: fetchSystemStatus, // Manual refetch function
  }
}

export default useSystemStatus


