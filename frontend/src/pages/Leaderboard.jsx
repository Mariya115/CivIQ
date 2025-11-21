import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState('weekly')

  const getWeeklyData = (data) => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return data.filter(user => {
      const reports = JSON.parse(localStorage.getItem('civiq_reports') || '[]')
      const userWeeklyReports = reports.filter(r => 
        r.user_email === user.email && 
        new Date(r.created_at) >= oneWeekAgo
      )
      return userWeeklyReports.length > 0 || user.points > 0
    })
  }
  const [leaderboardData, setLeaderboardData] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let points = JSON.parse(localStorage.getItem('civiq_user_points') || '{}')
    let allUsers = JSON.parse(localStorage.getItem('civiq_all_users') || '[]')
    
    // Add sample users and points if empty
    if (allUsers.length === 0) {
      const sampleUsers = [
        { email: 'priya.sharma@email.com', user_metadata: { name: 'Priya Sharma', city: 'Mumbai', role: 'Citizen' }},
        { email: 'rahul.kumar@email.com', user_metadata: { name: 'Rahul Kumar', city: 'Delhi', role: 'Worker' }},
        { email: 'anita.singh@email.com', user_metadata: { name: 'Anita Singh', city: 'Bangalore', role: 'Citizen' }},
        { email: 'vikash.gupta@email.com', user_metadata: { name: 'Vikash Gupta', city: 'Pune', role: 'Municipal Admin' }},
        { email: 'sneha.patel@email.com', user_metadata: { name: 'Sneha Patel', city: 'Ahmedabad', role: 'Citizen' }}
      ]
      
      const samplePoints = {
        'priya.sharma@email.com': 2450,
        'rahul.kumar@email.com': 2380,
        'anita.singh@email.com': 2250,
        'vikash.gupta@email.com': 2100,
        'sneha.patel@email.com': 2050
      }
      
      allUsers = [...allUsers, ...sampleUsers]
      points = { ...points, ...samplePoints }
      
      localStorage.setItem('civiq_all_users', JSON.stringify(allUsers))
      localStorage.setItem('civiq_user_points', JSON.stringify(points))
    }
    
    const reports = JSON.parse(localStorage.getItem('civiq_reports') || '[]')
    
    const data = allUsers.map(u => {
      const userReports = reports.filter(r => r.user_email === u.email)
      const resolvedReports = userReports.filter(r => r.status === 'resolved')
      
      // Calculate points: 50 per report + existing points
      const reportPoints = userReports.length * 50
      const totalPoints = (points[u.email] || 0) + reportPoints
      
      return {
        name: u.user_metadata?.name || 'Anonymous',
        email: u.email,
        points: totalPoints,
        reports: userReports.length,
        resolved: resolvedReports.length,
        city: u.user_metadata?.city || 'Unknown',
        role: u.user_metadata?.role || 'Citizen',
        civicIQ: Math.min(100, Math.floor(totalPoints / 10)),
        isCurrentUser: user?.email === u.email
      }
    }).sort((a, b) => b.points - a.points).map((item, index) => ({
      ...item,
      rank: index + 1,
      badge: index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : index < 10 ? '⭐' : '🌟'
    }))
    
    const filteredData = timeframe === 'weekly' ? getWeeklyData(data) : data
    setLeaderboardData(filteredData)
  }, [user, timeframe])

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold">Civic Champions Leaderboard</h1>
      </div>
      
      <div className="mb-6">
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
          <option value="alltime">All Time</option>
        </select>
      </div>

      {/* Current User Rank */}
      {user && leaderboardData.find(u => u.isCurrentUser) && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your Rank</h3>
              <p className="text-sm opacity-90">{user.user_metadata?.name || 'You'}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">#{leaderboardData.find(u => u.isCurrentUser)?.rank}</div>
              <div className="text-sm opacity-90">{leaderboardData.find(u => u.isCurrentUser)?.points.toLocaleString()} points</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <h2 className="text-xl font-semibold">Top Civic Champions</h2>
          <p className="text-primary-100">Leading the change in civic responsibility</p>
        </div>
        
        <div className="divide-y">
          {leaderboardData.map((user, index) => (
            <div
              key={index}
              className={`p-4 flex items-center justify-between ${
                user.isCurrentUser ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{user.badge}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-lg">#{user.rank}</span>
                    <span className={`font-semibold text-lg ${user.isCurrentUser ? 'text-yellow-700' : ''}`}>
                      {user.name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {user.city} • {user.role} • Reports: {user.reports}
                  </div>
                  <div className="text-lg font-bold text-primary-600 mt-1">
                    {user.points.toLocaleString()} points
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-primary-600">
                  {user.points.toLocaleString()} pts
                </div>
                <div className="text-sm text-gray-500">
                  Civil Points earned
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Keep reporting issues and completing challenges to climb the leaderboard! 🚀
          </p>
        </div>
      </div>
    </div>
  )
}