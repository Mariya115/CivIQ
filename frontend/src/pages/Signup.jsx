import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Citizen',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState('')
  const [mockOtp, setMockOtp] = useState('')
  const navigate = useNavigate()

  // Add page background
  React.useEffect(() => {
    document.body.className = 'page-auth'
    document.body.style.background = 'linear-gradient(45deg, #ff9933 0%, #ffffff 33%, #ffffff 66%, #138808 100%)'
    document.body.style.backgroundSize = '300% 300%'
    document.body.style.animation = 'indiaFlag 8s ease-in-out infinite'
    return () => {
      document.body.className = ''
      document.body.style.background = ''
      document.body.style.backgroundSize = ''
      document.body.style.animation = ''
    }
  }, [])



  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (!formData.phone) {
      setError('Phone number is required')
      return
    }
    
    // Generate and show OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setMockOtp(generatedOtp)
    setShowOTP(true)
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    if (otp !== mockOtp) {
      setError('Invalid OTP. Please try again.')
      setLoading(false)
      return
    }
    
    try {
      await apiService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      })
      
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
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
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Create Account</h1>

      {!showOTP ? (
        <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">First Name</label>
            <input
              type="text"
              placeholder="First name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="+91 9876543210"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Address</label>
          <input
            type="text"
            placeholder="Street address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">City</label>
            <input
              type="text"
              placeholder="City"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">State</label>
            <input
              type="text"
              placeholder="State"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">PIN Code</label>
          <input
            type="text"
            placeholder="PIN Code"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.pincode}
            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
            maxLength={6}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Role</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="Citizen">Citizen</option>
            <option value="Worker">Worker</option>
            <option value="Municipal Admin">Municipal Admin</option>
            <option value="NGO">NGO</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Send OTP
        </button>
      </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 font-medium mb-2">📱 Mock OTP Sent!</p>
            <p className="text-lg font-bold text-yellow-900 tracking-widest">{mockOtp}</p>
            <p className="text-xs text-yellow-600 mt-1">Use this OTP to complete registration</p>
          </div>
          
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Enter OTP</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Verify & Create Account'}
            </button>
          </form>
          
          <button
            onClick={() => { setShowOTP(false); setOtp(''); setMockOtp(''); }}
            className="w-full text-white/80 hover:text-white"
          >
            ← Back to Form
          </button>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in here
          </Link>
        </p>
      </div>
      </div>
    </div>
  )
}