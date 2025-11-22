import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Add page background
  React.useEffect(() => {
    document.body.className = 'page-leaderboard'
    return () => document.body.className = ''
  }, [])

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const data = await apiService.getLeaderboard()
      setLeaderboardData(data)
    } catch (error) {
      // Mock leaderboard data with 20 users
      const mockData = [
        { userId: 'USER001', name: 'Aarav Sharma', points: 3250, rank: 1, badge: 'Civic Champion' },
        { userId: 'USER002', name: 'Priya Patel', points: 2890, rank: 2, badge: 'Environmental Hero' },
        { userId: 'USER003', name: 'Rahul Kumar', points: 2650, rank: 3, badge: 'Community Leader' },
        { userId: 'USER004', name: 'Ananya Singh', points: 2420, rank: 4, badge: 'Green Warrior' },
        { userId: 'USER005', name: 'Vikram Reddy', points: 2180, rank: 5, badge: 'Eco Champion' },
        { userId: 'USER006', name: 'Sneha Gupta', points: 1950, rank: 6, badge: 'Active Citizen' },
        { userId: 'USER007', name: 'Arjun Nair', points: 1820, rank: 7, badge: 'Change Maker' },
        { userId: 'USER008', name: 'Kavya Iyer', points: 1690, rank: 8, badge: 'Civic Helper' },
        { userId: 'USER009', name: 'Rohit Joshi', points: 1560, rank: 9, badge: 'Community Helper' },
        { userId: 'USER010', name: 'Meera Agarwal', points: 1430, rank: 10, badge: 'Responsible Citizen' },
        { userId: 'USER011', name: 'Karan Malhotra', points: 1300, rank: 11, badge: 'Civic Volunteer' },
        { userId: 'USER012', name: 'Riya Sharma', points: 1170, rank: 12, badge: 'Green Advocate' },
        { userId: 'USER013', name: 'Aditya Verma', points: 1040, rank: 13, badge: 'Eco Supporter' },
        { userId: 'USER014', name: 'Pooja Rao', points: 910, rank: 14, badge: 'Community Member' },
        { userId: 'USER015', name: 'Siddharth Das', points: 780, rank: 15, badge: 'Civic Participant' },
        { userId: 'USER016', name: 'Nisha Kapoor', points: 650, rank: 16, badge: 'Active Reporter' },
        { userId: 'USER017', name: 'Amit Bhatt', points: 520, rank: 17, badge: 'Civic Contributor' },
        { userId: 'USER018', name: 'Divya Menon', points: 390, rank: 18, badge: 'Green Helper' },
        { userId: 'USER019', name: 'Harsh Pandey', points: 260, rank: 19, badge: 'New Volunteer' },
        { userId: 'USER020', name: 'Tanya Sinha', points: 130, rank: 20, badge: 'Rising Star' }
      ]
      setLeaderboardData(mockData)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white">Civic Champions Leaderboard</h1>
        </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading leaderboard...</p>
        </div>
      )}

      {/* Top 5 Rewards Banner */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-2">🎉 Top 5 Rewards Program</h3>
        <p className="text-sm opacity-90">Top 5 civic champions get exclusive discounts on utility bills!</p>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div className="bg-white/20 p-2 rounded">🥇 20% Off</div>
          <div className="bg-white/20 p-2 rounded">🥈 15% Off</div>
          <div className="bg-white/20 p-2 rounded">🥉 12% Off</div>
          <div className="bg-white/20 p-2 rounded">4th: 10% Off</div>
          <div className="bg-white/20 p-2 rounded">5th: 8% Off</div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <h2 className="text-xl font-semibold">Top Civic Champions</h2>
          <p className="text-primary-100">Leading the change in civic responsibility</p>
        </div>
        
        <div className="divide-y">
          {leaderboardData.map((user, index) => (
            <div
              key={user.userId}
              className={`p-4 flex items-center justify-between ${
                index < 5 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                  {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : index < 5 ? '⭐' : '🌟'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-2xl text-blue-600">#{user.rank}</span>
                    <span className="font-semibold text-lg">{user.name}</span>
                    {index < 5 && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Reward Eligible</span>}
                  </div>
                  <div className="text-sm text-gray-600">
                    ID: {user.userId} • {user.badge}
                  </div>
                  <div className="text-lg font-bold text-green-600 mt-1">
                    {user.points.toLocaleString()} Civic Points
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {user.points.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  Civic Points
                </div>
                {index < 5 && (
                  <div className="text-xs text-green-600 font-medium mt-1">
                    {index === 0 ? '20%' : index === 1 ? '15%' : index === 2 ? '12%' : index === 3 ? '10%' : '8%'} Bill Discount
                  </div>
                )}
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
    </div>
  )
}