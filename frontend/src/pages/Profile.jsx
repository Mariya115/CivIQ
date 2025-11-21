import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false
  })
  const [showModal, setShowModal] = useState(null)
  const [userPoints, setUserPoints] = useState(0)
  const [userRank, setUserRank] = useState(0)

  useEffect(() => {
    if (user) {
      const points = JSON.parse(localStorage.getItem('civiq_user_points') || '{}')
      const allUsers = JSON.parse(localStorage.getItem('civiq_all_users') || '[]')
      
      setUserPoints(points[user.email] || 0)
      
      // Calculate user rank
      const sortedUsers = allUsers.map(u => ({
        email: u.email,
        points: points[u.email] || 0
      })).sort((a, b) => b.points - a.points)
      
      const rank = sortedUsers.findIndex(u => u.email === user.email) + 1
      setUserRank(rank || allUsers.length)
    }
  }, [user])

  useEffect(() => {
    const savedSettings = localStorage.getItem('civiq_settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem('civiq_settings', JSON.stringify(newSettings))
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view your profile</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      {/* Civil Points */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">🏆 Civil Points</h2>
            <p className="text-sm opacity-90">Your contribution to civic improvement</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{userPoints}</div>
            <div className="text-sm opacity-90">Rank #{userRank}</div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {user.user_metadata?.name || 'Not provided'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {user.email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {user.user_metadata?.role || 'Citizen'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {user.user_metadata?.city || 'Not provided'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>📧 Email Notifications</span>
            <button
              onClick={() => updateSetting('emailNotifications', !settings.emailNotifications)}
              className={`w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>🔔 Push Notifications</span>
            <button
              onClick={() => updateSetting('pushNotifications', !settings.pushNotifications)}
              className={`w-12 h-6 rounded-full transition-colors ${settings.pushNotifications ? 'bg-primary-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <button 
            onClick={() => setShowModal('privacy')}
            className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
          >
            🔒 Privacy Settings
          </button>
          
          <button 
            onClick={() => setShowModal('help')}
            className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
          >
            ❓ Help & Support
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-white p-6 rounded-lg shadow">
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Privacy Settings Modal */}
      {showModal === 'privacy' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">🔒 Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Profile Visibility</span>
                <select className="border rounded px-2 py-1">
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>Show Activity</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Data Sharing</span>
                <input type="checkbox" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowModal(null)}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg"
              >
                Save
              </button>
              <button 
                onClick={() => setShowModal(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showModal === 'help' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">❓ Help & Support</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                📚 User Guide
              </button>
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                💬 Contact Support
              </button>
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                🐛 Report Bug
              </button>
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                💡 Feature Request
              </button>
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                ❓ FAQ
              </button>
            </div>
            <button 
              onClick={() => setShowModal(null)}
              className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
