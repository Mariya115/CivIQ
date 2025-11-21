import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsService } from '../services/reports'
import { useAuth } from '../hooks/useAuth'

export default function ReportForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
    location: null
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">Please login to submit civic reports</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
        >
          Go to Login
        </button>
      </div>
    )
  }

  const categories = [
    'Waste Management',
    'Water Management', 
    'Air Pollution',
    'Noise Pollution',
    'Road & Infrastructure',
    'Public Safety',
    'Electricity Issues',
    'Drainage & Sewage',
    'Traffic Problems',
    'Street Lighting',
    'Parks & Recreation',
    'Public Transport',
    'Building Violations',
    'Environmental Issues',
    'Health & Sanitation',
    'Other'
  ]

  const getCurrentLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
          setLocationLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationLoading(false)
        }
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.category) {
      alert('Please fill in title and category')
      return
    }
    
    setLoading(true)
    
    try {
      const reportData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        points_awarded: 15,
        status: 'reported'
      }
      
      console.log('Submitting report data:', reportData)
      const { data, error } = await reportsService.createReport(reportData)
      
      if (error) {
        console.error('Full error object:', error)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
        alert('Error submitting report. Check console for details.')
      } else {
        console.log('Report created successfully:', data)
        setSuccess(true)
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          image: null,
          location: null
        })
        setTimeout(() => navigate('/my-reports'), 2000)
      }
    } catch (err) {
      console.error('Submit error:', err)
      alert('Error submitting report')
    }
    
    setLoading(false)
  }

  const handleImageUpload = (e) => {
    setFormData({...formData, image: e.target.files[0]})
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Report Civic Issue</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Issue Title</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Brief description of the issue"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full p-3 border rounded-lg h-32"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed description of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {locationLoading ? 'Getting Location...' : 'Get Current Location'}
              </button>
              {formData.location && (
                <span className="text-sm text-green-600">
                  ✓ Location captured
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {success && (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4">
              Report submitted successfully! Redirecting...
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  )
}