import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'

export default function Login() {
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Add page background
  React.useEffect(() => {
    document.body.className = 'page-auth'
    return () => document.body.className = ''
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await apiService.login(formData.emailOrPhone, formData.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Government Scheme Images */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{position: 'absolute', top: '50%', left: '-600px', transform: 'translateY(-50%)', animation: 'slideQueue 40s ease-in-out infinite'}}>
          <div className="w-80 h-80 bg-white rounded-full opacity-40 flex items-center justify-center p-4">
            <img src="https://static.pib.gov.in/WriteReadData/userfiles/image/image002Q9EE.png" alt="Swachh Bharat" className="w-20 h-20 object-cover" />
          </div>
        </div>
        
        <div style={{position: 'absolute', top: '50%', left: '-600px', transform: 'translateY(-50%)', animation: 'slideQueue 40s ease-in-out infinite', animationDelay: '10s'}}>
          <div className="w-80 h-80 bg-white rounded-full opacity-40 flex items-center justify-center p-4">
            <img src="https://www.nrilegalservices.com/wp-content/uploads/2017/09/Digital-India.jpg" alt="Digital India" className="w-20 h-20 object-cover" />
          </div>
        </div>
        
        <div style={{position: 'absolute', top: '50%', left: '-600px', transform: 'translateY(-50%)', animation: 'slideQueue 40s ease-in-out infinite', animationDelay: '20s'}}>
          <div className="w-80 h-80 bg-white rounded-full opacity-40 flex items-center justify-center p-4">
            <img src="https://s3-ap-southeast-1.amazonaws.com/olympiadgenius/2017/10/14/de53acd4-b04e-11e7-b774-06cd23bce93b.jpg" alt="3R's" className="w-20 h-20 object-cover" />
          </div>
        </div>
        
        <div style={{position: 'absolute', top: '50%', left: '-600px', transform: 'translateY(-50%)', animation: 'slideQueue 40s ease-in-out infinite', animationDelay: '30s'}}>
          <div className="w-80 h-80 bg-white rounded-full opacity-40 flex items-center justify-center p-4">
            <img src="https://static.pib.gov.in/WriteReadData/userfiles/image/image002Q9EE.png" alt="Swachh Bharat" className="w-20 h-20 object-cover" />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideQueue {
          0% { transform: translateY(-50%) translateX(-600px); }
          100% { transform: translateY(-50%) translateX(calc(100vw + 600px)); }
        }
      `}</style>
      <div className="max-w-md w-full glass-card p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Sign In to CivIQ</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Email or Phone Number
          </label>
          <input
            type="text"
            placeholder="Enter your email or phone"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.emailOrPhone}
            onChange={(e) => setFormData({...formData, emailOrPhone: e.target.value})}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
        
        <div className="mt-4 p-4 bg-white/10 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Demo Accounts:</h3>
          <div className="text-xs text-gray-700 space-y-1">
            <div>Email: <code className="bg-gray-200 px-1 rounded">aarav@example.com</code></div>
            <div>Phone: <code className="bg-gray-200 px-1 rounded">+919000000000</code></div>
            <div>Password: <code className="bg-gray-200 px-1 rounded">password123</code></div>
          </div>
        </div>
      </div>
    </div>
  )
}