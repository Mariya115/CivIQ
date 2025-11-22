import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { t } = useLanguage()
  const { user } = useAuth()

  const getQuickActions = () => {
    const userRole = user?.user_metadata?.role
    
    if (['Municipal Admin', 'Worker', 'NGO'].includes(userRole)) {
      return [
        { nameKey: 'reports', name: 'All Reports', path: '/admin', icon: '📊', bgColor: 'bg-red-500' },
        { nameKey: 'map', path: '/map', icon: '🗺️', bgColor: 'bg-green-500' },
        { nameKey: 'knowledge', path: '/knowledge', icon: '📚', bgColor: 'bg-teal-500' },
        { nameKey: 'events', path: '/events', icon: '📅', bgColor: 'bg-orange-500' }
      ]
    }
    
    return [
      { nameKey: 'reportIssue', name: 'Report Issue', path: '/report', icon: '📝', bgColor: 'bg-red-500' },
      { nameKey: 'map', name: 'Map', path: '/map', icon: '🗺️', bgColor: 'bg-green-500' },
      { nameKey: 'ngos', name: 'NGOs', path: '/ngos', icon: '🏢', bgColor: 'bg-blue-500' },
      { nameKey: 'events', name: 'Events', path: '/events', icon: '📅', bgColor: 'bg-orange-500' },
      { nameKey: 'knowledge', name: 'Knowledge', path: '/knowledge', icon: '📚', bgColor: 'bg-teal-500' },
      { nameKey: 'quiz', name: 'Quiz', path: '/quiz', icon: '🧠', bgColor: 'bg-indigo-500' }
    ]
  }

  const quickActions = getQuickActions()

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center shadow-lg">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className={`${action.bgColor} rounded-xl p-8 text-center text-white shadow-md hover:shadow-lg transition-shadow`}
              >
                <div className="text-6xl mb-4">
                  {action.icon}
                </div>
                <div className="font-bold text-lg">{action.name || t(action.nameKey)}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Leaderboard Button */}
        <div className="flex justify-center mb-8">
          <Link
            to="/leaderboard"
            className="bg-yellow-500 text-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-6xl mb-4 text-center">🏆</div>
            <div className="font-bold text-lg text-center">Leaderboard</div>
          </Link>
        </div>
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-blue-500 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
          💬
        </button>
      </div>
    </div>
  )
}