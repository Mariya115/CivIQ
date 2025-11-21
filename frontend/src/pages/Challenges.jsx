import { useState } from 'react'

export default function Challenges() {
  const [activeTab, setActiveTab] = useState('active')

  const challenges = [
    {
      id: 1,
      title: "Zero Plastic Week",
      description: "Avoid single-use plastic for 7 days",
      points: 100,
      duration: "7 days",
      participants: 234,
      status: "active"
    },
    {
      id: 2,
      title: "Report 5 Issues",
      description: "Find and report 5 civic issues in your area",
      points: 50,
      duration: "3 days",
      participants: 156,
      status: "active"
    },
    {
      id: 3,
      title: "Clean Drive Volunteer",
      description: "Participate in a community cleanup drive",
      points: 200,
      duration: "1 day",
      participants: 89,
      status: "completed"
    }
  ]

  const filteredChallenges = challenges.filter(c => 
    activeTab === 'active' ? c.status === 'active' : c.status === 'completed'
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Civic Challenges</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'active' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Active Challenges
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'completed' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredChallenges.map(challenge => (
          <div key={challenge.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                <p className="text-gray-600 mb-3">{challenge.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>⏱️ {challenge.duration}</span>
                  <span>👥 {challenge.participants} participants</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  +{challenge.points} pts
                </div>
                {challenge.status === 'active' && (
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Join Challenge
                  </button>
                )}
                {challenge.status === 'completed' && (
                  <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
                    Completed ✓
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}