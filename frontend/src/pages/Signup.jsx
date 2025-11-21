import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Citizen',
    city: '',
    agreeTerms: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.'
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please re-type.'
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select a role.'
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms to continue.'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const { data, error } = await signUp(formData.email, formData.password, formData.name, formData.role, formData.city)
      
      if (error) {
        setErrors({ general: error.message })
      } else {
        setSuccess(true)
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      }
    } catch (err) {
      setErrors({ general: 'Account creation failed. Please try again.' })
    }
    
    setLoading(false)
  }

  const isFormValid = formData.name && formData.email && formData.password && 
                     formData.confirmPassword && formData.role && formData.agreeTerms

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow text-center">
        <div className="text-green-600 text-lg font-semibold mb-2">
          Account created! Redirecting to your dashboard…
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2 text-center">Sign up to CivIQ</h1>
      <p className="text-gray-600 text-center mb-6">
        Create an account to report issues, join local drives & earn CivicIQ points.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{errors.general}</div>
        )}
        
        <div>
          <input
            type="text"
            placeholder="e.g., Mariya Momin"
            className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">Enter your full name as you'd like it displayed.</p>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <input
            type="email"
            placeholder="you@example.com"
            className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : ''}`}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">We'll use this to sign in and send notifications.</p>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Create a strong password"
            className={`w-full p-3 border rounded-lg ${errors.password ? 'border-red-500' : ''}`}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">Min 8 characters, include a number and a letter.</p>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Re-enter your password"
            className={`w-full p-3 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
        
        <div>
          <select
            className={`w-full p-3 border rounded-lg ${errors.role ? 'border-red-500' : ''}`}
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="Citizen">Citizen</option>
            <option value="Municipal Admin">Municipal Admin</option>
            <option value="Worker">Worker</option>
            <option value="NGO">NGO</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Choose the role you represent.</p>
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
        </div>
        
        <div>
          <input
            type="text"
            placeholder="e.g., Bengaluru – Ward 45"
            className="w-full p-3 border rounded-lg"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">This helps show nearby reports and events.</p>
        </div>
        
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="agreeTerms"
            className="mt-1"
            checked={formData.agreeTerms}
            onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
          />
          <label htmlFor="agreeTerms" className="text-sm">
            I agree to the <Link to="/terms" className="text-primary-600 hover:underline">CivIQ Terms & Privacy Policy</Link>
          </label>
        </div>
        {errors.agreeTerms && <p className="text-red-500 text-xs">{errors.agreeTerms}</p>}
        
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="w-full bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
      
      <p className="text-center mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Log in</Link>
      </p>
    </div>
  )
}