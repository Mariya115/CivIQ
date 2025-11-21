import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const { error } = await signIn(formData.email, formData.password)
      if (error) {
        if (error.message.includes('rate') || error.status === 429) {
          setError('Please wait a moment before trying again')
        } else {
          setError(error.message)
        }
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Login temporarily unavailable')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In to CivIQ</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <button className="w-full bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700">
          Sign In
        </button>
      </form>
      <p className="text-center mt-4">
        Don't have an account? <Link to="/signup" className="text-primary-600">Sign up</Link>
      </p>
    </div>
  )
}