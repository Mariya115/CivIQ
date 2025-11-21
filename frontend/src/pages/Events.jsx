import { useState } from 'react'

const events = [
  {
    id: 1,
    title: "SayTrees — Urban Tree Plantation Drive",
    date: "2025-12-15",
    city: "Bengaluru",
    organizer: "SankalpTaru / SayTrees",
    description: "Plant 200 native saplings in Ward 45. Tools and saplings provided.",
    slots: 80,
    points: 20,
    microcopy: "Register to plant trees and earn +20 volunteer points.",
    buttons: ["Register", "Volunteer Details"]
  },
  {
    id: 2,
    title: "Chintan — Neighborhood Waste Cleanup",
    date: "2025-11-20",
    city: "Delhi",
    organizer: "Chintan",
    description: "Community cleaning & segregation training around Vivek Vihar market.",
    slots: 100,
    points: 15,
    microcopy: "Bring gloves. Earn +15 points and a participation certificate.",
    buttons: ["Join Drive", "View Map"]
  },
  {
    id: 3,
    title: "Greenpeace — Beach Cleanup & Awareness",
    date: "2025-12-05",
    city: "Chennai",
    organizer: "Greenpeace India",
    description: "Beach cleanup followed by a short awareness session on plastics.",
    slots: 120,
    points: 15,
    microcopy: "Limited slots — register early to reserve your kit.",
    buttons: ["Register", "Share Event"]
  },
  {
    id: 4,
    title: "WWF-India — Urban Wildlife Awareness Walk",
    date: "2025-11-28",
    city: "Pune",
    organizer: "WWF-India",
    description: "Guided walk highlighting urban biodiversity and how to protect habitats.",
    slots: 60,
    points: 10,
    microcopy: "Ideal for families — earn +10 points per volunteer.",
    buttons: ["Register", "Learn More"]
  },
  {
    id: 5,
    title: "TERI — Water Conservation Workshop",
    date: "2025-12-10",
    city: "New Delhi",
    organizer: "TERI",
    description: "Hands-on workshop on rainwater harvesting and household water savings.",
    slots: 50,
    points: 25,
    microcopy: "Seats limited — certificate on completion.",
    buttons: ["Register", "Reserve Seat"]
  },
  {
    id: 6,
    title: "Kalpavriksh — Community Composting Drive",
    date: "2025-11-30",
    city: "Pune",
    organizer: "Kalpavriksh",
    description: "Set up community compost pits and training for apartment complexes.",
    slots: 40,
    points: 20,
    microcopy: "Learn to compost kitchen waste; families welcome.",
    buttons: ["Join", "Request Compost Kit"]
  },
  {
    id: 7,
    title: "Development Alternatives — Green Tech Demo Day",
    date: "2025-12-18",
    city: "New Delhi",
    organizer: "Development Alternatives",
    description: "Showcase of low-cost green tech solutions for neighbourhoods.",
    slots: 150,
    points: 10,
    microcopy: "See affordable solutions for clean living.",
    buttons: ["Register", "Notify Me"]
  },
  {
    id: 8,
    title: "Community Flood Response Drill",
    date: "2025-11-22",
    city: "Mumbai",
    organizer: "Local Municipality + NGOs",
    description: "Simulation of local flood response, first-aid & evacuation routes.",
    slots: 200,
    points: 30,
    microcopy: "Essential for residents in low-lying wards.",
    buttons: ["Volunteer", "Event Map"]
  }
]

const tooltips = {
  "Register": "Sign up to volunteer (required fields: name, phone)",
  "Join Drive": "Register and add to the participant list",
  "Volunteer": "Immediate sign-up for volunteering",
  "Volunteer Details": "See volunteer requirements and details",
  "View Map": "Open event location on map",
  "Share Event": "Share event link on social media",
  "Learn More": "View detailed event information",
  "Reserve Seat": "Sign up to volunteer (required fields: name, phone)",
  "Join": "Register and add to the participant list",
  "Request Compost Kit": "Request materials for composting",
  "Notify Me": "Get notified about similar events",
  "Event Map": "Open event location on map"
}

export default function Events() {
  const [showRegistration, setShowRegistration] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    volunteers: 1,
    availability: '',
    remarks: ''
  })
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const handleEventAction = (event, buttonText) => {
    if (["Register", "Join Drive", "Volunteer", "Join", "Reserve Seat"].includes(buttonText)) {
      setSelectedEvent(event)
      setShowRegistration(true)
    } else if (buttonText === "View Map" || buttonText === "Event Map") {
      alert(`Opening map for ${event.title} in ${event.city}`)
    } else if (buttonText === "Share Event") {
      navigator.share?.({
        title: event.title,
        text: event.description,
        url: window.location.href
      }) || alert("Event link copied!")
    } else {
      alert(`${buttonText} functionality coming soon!`)
    }
  }

  const handleRegistration = (e) => {
    e.preventDefault()
    
    // Store registration
    const registration = {
      id: Date.now().toString(),
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      ...formData,
      registeredAt: new Date().toISOString()
    }
    
    const existingRegistrations = JSON.parse(localStorage.getItem('civiq_registrations') || '[]')
    existingRegistrations.push(registration)
    localStorage.setItem('civiq_registrations', JSON.stringify(existingRegistrations))
    
    setRegistrationSuccess(true)
    setTimeout(() => {
      setShowRegistration(false)
      setRegistrationSuccess(false)
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        volunteers: 1,
        availability: '',
        remarks: ''
      })
    }, 2000)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Events & Campaigns</h1>
        <p className="text-gray-600">Join environmental initiatives and earn volunteer points</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">{event.title}</h3>
            
            <div className="text-sm text-gray-600 mb-3 space-y-1">
              <div>📅 {formatDate(event.date)} · 📍 {event.city}</div>
              <div>🏢 {event.organizer}</div>
            </div>
            
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">{event.description}</p>
            
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <div className="text-sm font-medium text-green-800">
                🎯 {event.slots} volunteers needed
              </div>
              <div className="text-xs text-green-600 mt-1">{event.microcopy}</div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {event.buttons.map((buttonText, index) => (
                <button
                  key={index}
                  onClick={() => handleEventAction(event, buttonText)}
                  title={tooltips[buttonText]}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    index === 0 
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {buttonText}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Register as Volunteer</h2>
            
            {registrationSuccess ? (
              <div className="text-center py-8">
                <div className="text-green-600 text-4xl mb-4">✓</div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Successfully registered!</h3>
                <p className="text-sm text-gray-600">Check email for details.</p>
              </div>
            ) : (
              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-lg"
                    placeholder="e.g., Mariya Momin"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-3 border rounded-lg"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    className="w-full p-3 border rounded-lg"
                    placeholder="+91 98XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Number of volunteers</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full p-3 border rounded-lg"
                    placeholder="1"
                    value={formData.volunteers}
                    onChange={(e) => setFormData({...formData, volunteers: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Availability</label>
                  <select
                    required
                    className="w-full p-3 border rounded-lg"
                    value={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  >
                    <option value="">Select availability</option>
                    <option value="I can attend">I can attend</option>
                    <option value="Morning only">Morning only</option>
                    <option value="Afternoon only">Afternoon only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Remarks (optional)</label>
                  <textarea
                    className="w-full p-3 border rounded-lg h-20"
                    placeholder="Any medical conditions or notes"
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  />
                </div>
                
                <div className="text-xs text-gray-600 mb-4">
                  Your registration helps us plan kits and safety. You will earn volunteer points after event verification.
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
                  >
                    Register
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