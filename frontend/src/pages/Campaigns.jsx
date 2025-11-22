import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Campaigns() {
  const { user } = useAuth()
  const [userRegistrations, setUserRegistrations] = useState([])
  const [showRegistration, setShowRegistration] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', commitment: '' })
  const [success, setSuccess] = useState(false)

  const campaigns = [
    {
      id: 1,
      title: "Swachh Bharat Digital Drive",
      description: "Join the nationwide digital cleanup initiative - report waste, organize cleanups",
      organizer: "Government of India",
      participants: 15420,
      endDate: "2025-02-15",
      points: 30,
      image: "🇮🇳"
    },
    {
      id: 2,
      title: "Clean Ganga Mission",
      description: "Help monitor and report pollution along river Ganga",
      organizer: "National Mission for Clean Ganga",
      participants: 8930,
      endDate: "2025-03-01",
      points: 25,
      image: "🌊"
    },
    {
      id: 3,
      title: "Zero Waste Cities Initiative",
      description: "Transform your city into a zero-waste model through community action",
      organizer: "Ministry of Environment",
      participants: 12500,
      endDate: "2025-04-22",
      points: 40,
      image: "♻️"
    }
  ]

  useEffect(() => {
    if (user) {
      const registrations = JSON.parse(localStorage.getItem('civiq_campaign_registrations') || '[]')
      setUserRegistrations(registrations.filter(r => r.userEmail === user.email))
    }
  }, [user])

  const isRegistered = (campaignId) => {
    return userRegistrations.some(r => r.campaignId === campaignId)
  }

  const handleJoinCampaign = (campaign) => {
    if (!user) {
      alert('Please login to join campaigns')
      return
    }
    if (isRegistered(campaign.id)) {
      alert('You are already registered for this campaign!')
      return
    }
    setSelectedCampaign(campaign)
    setShowRegistration(true)
  }

  const handleRegistration = (e) => {
    e.preventDefault()
    
    const registration = {
      id: Date.now().toString(),
      campaignId: selectedCampaign.id,
      campaignTitle: selectedCampaign.title,
      userEmail: user.email,
      ...formData,
      registeredAt: new Date().toISOString(),
      points: selectedCampaign.points
    }
    
    const existingRegistrations = JSON.parse(localStorage.getItem('civiq_campaign_registrations') || '[]')
    existingRegistrations.push(registration)
    localStorage.setItem('civiq_campaign_registrations', JSON.stringify(existingRegistrations))
    
    // Award points
    const points = JSON.parse(localStorage.getItem('civiq_user_points') || '{}')
    points[user.email] = (points[user.email] || 0) + selectedCampaign.points
    localStorage.setItem('civiq_user_points', JSON.stringify(points))
    
    setUserRegistrations([...userRegistrations, registration])
    setSuccess(true)
    setTimeout(() => {
      setShowRegistration(false)
      setSuccess(false)
      setFormData({ fullName: '', email: '', phone: '', commitment: '' })
    }, 2000)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Active Campaigns</h1>
      <p className="text-gray-600 mb-8">
        Join nationwide initiatives and make a collective impact on civic issues
      </p>
      
      <div className="grid gap-6">
        {campaigns.map(campaign => (
          <div key={campaign.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{campaign.image}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                    <p className="text-gray-600 mb-2">{campaign.description}</p>
                    <p className="text-sm text-gray-500">
                      Organized by {campaign.organizer}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleJoinCampaign(campaign)}
                  disabled={isRegistered(campaign.id)}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    isRegistered(campaign.id)
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isRegistered(campaign.id) ? '✓ Joined' : 'Join Campaign'}
                </button>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                <span>👥 {campaign.participants.toLocaleString()} participants</span>
                <div className="text-right">
                  <div>🏆 +{campaign.points} points</div>
                  <div>📅 Ends {campaign.endDate}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Want to Start Your Own Campaign?</h2>
        <p className="mb-6">
          NGOs and community leaders can create campaigns to mobilize citizens for specific causes
        </p>
        <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Create Campaign
        </button>
      </div>
      
      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Join Campaign</h2>
            
            {success ? (
              <div className="text-center py-8">
                <div className="text-green-600 text-4xl mb-4">✓</div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Successfully joined!</h3>
                <p className="text-sm text-gray-600 mb-2">+{selectedCampaign?.points} points added to your account</p>
                <p className="text-sm text-gray-600 mb-2">Welcome email sent to:</p>
                <a 
                  href={`mailto:${formData.email}?subject=Campaign Registration - ${selectedCampaign?.title}&body=Welcome to ${selectedCampaign?.title}! You've earned ${selectedCampaign?.points} points. Campaign details and next steps will be shared soon.`}
                  className="text-primary-600 hover:text-primary-800 hover:underline transition-colors text-sm"
                  title="Click to open email"
                >
                  {formData.email}
                </a>
              </div>
            ) : (
              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-lg"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-3 border rounded-lg hover:border-primary-400 focus:border-primary-500 transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = ''}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    className="w-full p-3 border rounded-lg"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Commitment Level</label>
                  <select
                    required
                    className="w-full p-3 border rounded-lg"
                    value={formData.commitment}
                    onChange={(e) => setFormData({...formData, commitment: e.target.value})}
                  >
                    <option value="">Select commitment</option>
                    <option value="1-2 hours/week">1-2 hours/week</option>
                    <option value="3-5 hours/week">3-5 hours/week</option>
                    <option value="5+ hours/week">5+ hours/week</option>
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
                  >
                    Join Campaign
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegistration(false)}
                    className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}