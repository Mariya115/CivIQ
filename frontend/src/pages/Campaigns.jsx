export default function Campaigns() {
  const campaigns = [
    {
      id: 1,
      title: "Swachh Bharat Digital Drive",
      description: "Join the nationwide digital cleanup initiative",
      organizer: "Government of India",
      participants: 15420,
      endDate: "2024-02-15",
      image: "🇮🇳"
    },
    {
      id: 2,
      title: "Clean Ganga Mission",
      description: "Help monitor and report pollution along river Ganga",
      organizer: "National Mission for Clean Ganga",
      participants: 8930,
      endDate: "2024-03-01",
      image: "🌊"
    }
  ]

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
                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                  Join Campaign
                </button>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                <span>👥 {campaign.participants.toLocaleString()} participants</span>
                <span>📅 Ends {campaign.endDate}</span>
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
    </div>
  )
}