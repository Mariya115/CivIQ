import { useState } from 'react'

const ngos = [
  {
    id: 1,
    name: "Centre for Science and Environment (CSE)",
    focus: "Environmental research, pollution control, sustainable development",
    location: "New Delhi / 1980",
    contact: "contact@cseindia.org",
    buttons: ["View Profile", "Contact NGO"]
  },
  {
    id: 2,
    name: "Greenpeace India",
    focus: "Climate action, renewable energy, deforestation prevention",
    location: "Bengaluru / 2001",
    contact: "india.office@greenpeace.org",
    buttons: ["View Profile", "Volunteer with Greenpeace"]
  },
  {
    id: 3,
    name: "WWF-India",
    focus: "Wildlife conservation, forest & water protection",
    location: "New Delhi / 1969",
    contact: "info@wwfindia.net",
    buttons: ["View Profile", "Partner"]
  },
  {
    id: 4,
    name: "The Energy and Resources Institute (TERI)",
    focus: "Energy efficiency, sustainable technologies",
    location: "New Delhi / 1974",
    contact: "contact@teri.res.in",
    buttons: ["View Profile", "Contact TERI"]
  },
  {
    id: 5,
    name: "Chintan Environmental Research & Action Group",
    focus: "Waste management, recycling, livelihoods for waste-pickers",
    location: "New Delhi",
    contact: "info@chintan-india.org",
    buttons: ["View Profile", "Join Waste Drive"]
  },
  {
    id: 6,
    name: "SankalpTaru Foundation",
    focus: "Tree plantation & rural livelihood projects",
    location: "Jaipur / 2012",
    contact: "support@sankalptaru.org",
    buttons: ["View Profile", "Plant with Us"]
  },
  {
    id: 7,
    name: "SayTrees Environmental Trust",
    focus: "Urban tree plantation & water conservation",
    location: "Bengaluru",
    contact: "hello@saytrees.org",
    buttons: ["View Profile", "Volunteer"]
  },
  {
    id: 8,
    name: "Wildlife Trust of India (WTI)",
    focus: "Wildlife rescue & habitat restoration",
    location: "Noida / 1998",
    contact: "info@wti.org.in",
    buttons: ["View Profile", "Report Wildlife Issue"]
  },
  {
    id: 9,
    name: "Kalpavriksh Environmental Action Group",
    focus: "Biodiversity, environmental education, policy advocacy",
    location: "Pune / 1979",
    contact: "kalpavriksh.env@gmail.com",
    buttons: ["View Profile", "Collaborate"]
  },
  {
    id: 10,
    name: "Development Alternatives (DA)",
    focus: "Sustainable livelihoods & green tech",
    location: "New Delhi / 1982",
    contact: "info@devalt.org",
    buttons: ["View Profile", "Partner for Campaigns"]
  }
]

const tooltips = {
  "View Profile": "See NGO profile, past campaigns & contact",
  "Contact NGO": "Send message or email to NGO",
  "Volunteer with Greenpeace": "See upcoming drives and volunteer opportunities",
  "Partner": "Request NGO collaboration for campaigns",
  "Contact TERI": "Send message or email to NGO",
  "Join Waste Drive": "See upcoming drives and volunteer opportunities",
  "Plant with Us": "See upcoming drives and volunteer opportunities",
  "Volunteer": "See upcoming drives and volunteer opportunities",
  "Report Wildlife Issue": "Report wildlife emergencies or issues",
  "Collaborate": "Request NGO collaboration for campaigns",
  "Partner for Campaigns": "Request NGO collaboration for campaigns"
}

export default function NGOs() {
  const [selectedNGO, setSelectedNGO] = useState(null)

  const handleButtonClick = (ngo, buttonText) => {
    if (buttonText === "View Profile") {
      setSelectedNGO(ngo)
    } else if (buttonText.includes("Contact") || buttonText.includes("Email")) {
      window.location.href = `mailto:${ngo.contact}`
    } else {
      alert(`${buttonText} functionality coming soon!`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Partner NGOs</h1>
        <p className="text-gray-600">Connect with environmental organizations making a difference in your community</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ngos.map(ngo => (
          <div key={ngo.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">{ngo.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{ngo.location}</p>
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">{ngo.focus}</p>
            <p className="text-sm text-blue-600 mb-4">{ngo.contact}</p>
            
            <div className="flex flex-wrap gap-2">
              {ngo.buttons.map((buttonText, index) => (
                <button
                  key={index}
                  onClick={() => handleButtonClick(ngo, buttonText)}
                  title={tooltips[buttonText]}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
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

      {selectedNGO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedNGO.name}</h2>
              <button 
                onClick={() => setSelectedNGO(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Focus Areas</h3>
                <p className="text-gray-700">{selectedNGO.focus}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Location & Founded</h3>
                <p className="text-gray-700">{selectedNGO.location}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <a href={`mailto:${selectedNGO.contact}`} className="text-blue-600 hover:underline">
                  {selectedNGO.contact}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}