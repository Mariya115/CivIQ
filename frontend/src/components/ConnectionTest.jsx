import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export default function ConnectionTest() {
  const [status, setStatus] = useState('Testing...')
  const [data, setData] = useState(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      const result = await apiService.testConnection()
      setStatus('✅ Connected')
      setData(result)
    } catch (error) {
      setStatus('❌ Connection Failed')
      setData({ error: error.message })
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold mb-2">Backend Connection</h3>
      <p className="mb-2">{status}</p>
      {data && (
        <pre className="text-xs bg-gray-100 p-2 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
      <button 
        onClick={testConnection}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Test Again
      </button>
    </div>
  )
}