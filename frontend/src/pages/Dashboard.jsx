import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userPoints, setUserPoints] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    if (user) {
      // Get user points
      const points = JSON.parse(localStorage.getItem('civiq_user_points') || '{}')
      setUserPoints(points[user.email] || 0)
      
      // Get leaderboard
      const allUsers = JSON.parse(localStorage.getItem('civiq_all_users') || '[]')
      const leaderboardData = allUsers.map(u => ({
        name: u.user_metadata?.name || 'Anonymous',
        email: u.email,
        points: points[u.email] || 0,
        role: u.user_metadata?.role || 'Citizen'
      })).sort((a, b) => b.points - a.points).slice(0, 10)
      setLeaderboard(leaderboardData)
    }
  }, [user])

  // Remove auto-redirect to allow manual navigation
  // Show different actions based on user role
  const getQuickActions = () => {
    const userRole = user?.user_metadata?.role
    
    if (['Municipal Admin', 'Worker', 'NGO'].includes(userRole)) {
      return [
        { nameKey: 'adminDashboard', name: 'Admin Dashboard', path: '/admin', icon: '📊', color: 'bg-purple-500' },
        { nameKey: 'map', path: '/map', icon: '🗺️', color: 'bg-green-500' },
        { nameKey: 'reports', name: 'All Reports', path: '/admin', icon: '📝', color: 'bg-red-500' },
        { nameKey: 'knowledge', path: '/knowledge', icon: '📚', color: 'bg-teal-500' }
      ]
    }
    
    return [
      { nameKey: 'reportIssue', path: '/report', icon: '📝', color: 'bg-red-500' },
      { nameKey: 'map', path: '/map', icon: '🗺️', color: 'bg-green-500' },
      { nameKey: 'ngos', path: '/ngos', icon: '🏢', color: 'bg-blue-500' },
      { nameKey: 'events', path: '/events', icon: '📅', color: 'bg-orange-500' },
      { nameKey: 'knowledge', path: '/knowledge', icon: '📚', color: 'bg-teal-500' },
      { nameKey: 'quiz', path: '/quiz', icon: '🧠', color: 'bg-indigo-500' },
      { nameKey: 'leaderboard', path: '/leaderboard', icon: '🏆', color: 'bg-yellow-500' }
    ]
  }

  const quickActions = getQuickActions()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('dashboard')}</h1>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.filter(action => action.nameKey !== 'leaderboard').map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className={`${action.color} text-white p-4 rounded-lg shadow hover:opacity-90 transition-opacity text-center`}
            >
              <div className="text-2xl mb-1">{action.icon}</div>
              <div className="font-semibold text-sm">{action.name || t(action.nameKey)}</div>
            </Link>
          ))}
        </div>
        
        {/* Centered Leaderboard Button */}
        <div className="flex justify-center mt-4">
          <Link
            to="/leaderboard"
            className="bg-yellow-500 text-white p-4 rounded-lg shadow hover:opacity-90 transition-opacity text-center min-w-[200px]"
          >
            <div className="text-2xl mb-1">🏆</div>
            <div className="font-semibold text-sm">Leaderboard</div>
          </Link>
        </div>
      </div>

      {/* User Points Display */}
      {user && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Your Civil Points</h3>
                <p className="text-sm opacity-90">Earn points by reporting and solving civic issues</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{userPoints}</div>
                <div className="text-sm opacity-90">🏆 Points</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Top Contributors */}
      {leaderboard.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🏆 Weekly Top Contributors</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {leaderboard.slice(0, 5).map((contributor, index) => (
              <div key={contributor.email} className={`p-4 flex items-center justify-between ${
                index < leaderboard.length - 1 ? 'border-b' : ''
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{contributor.name}</div>
                    <div className="text-sm text-gray-500">{contributor.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{contributor.points}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
            <div className="p-4 text-center">
              <Link to="/leaderboard" className="text-primary-600 hover:underline font-medium">
                View Full Leaderboard →
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}