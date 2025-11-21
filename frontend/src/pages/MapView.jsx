import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { reportsService } from '../services/reports'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const createCustomIcon = (category) => {
  const categoryConfig = {
    'Road Issues': { color: '#FF0000', icon: '🚧' },
    'Illegal Dumping': { color: '#FFA500', icon: '🗑️' },
    'Littering': { color: '#FFFF00', icon: '🚮' },
    'Water Leakage': { color: '#0000FF', icon: '💧' },
    'Overflowing Bins': { color: '#8B4513', icon: '♻️' },
    'Vandalism': { color: '#800080', icon: '🎨' },
    'Public Urination': { color: '#FF69B4', icon: '🚻' },
    'Other': { color: '#808080', icon: '❗' }
  }
  
  const config = categoryConfig[category] || categoryConfig['Other']
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${config.color}; 
        width: 30px; 
        height: 30px; 
        border-radius: 50%; 
        border: 3px solid white; 
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      ">${config.icon}</div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })
}

export default function MapView() {
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState('all')

  const categories = ['all', 'Littering', 'Illegal Dumping', 'Road Issues', 'Water Leakage']

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await reportsService.getReportsWithLocation()
      if (!error && data) {
        setReports(data)
      }
    }
    fetchReports()
  }, [])

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.category === filter)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Civic Issues Map</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Filter by Category</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Tracking Graphs */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Area Progress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">📍 Area Progress</h3>
          <div className="space-y-3">
            {[
              { area: 'Bangalore', resolved: 42, total: 65, color: 'bg-green-500' },
              { area: 'Mumbai', resolved: 38, total: 55, color: 'bg-blue-500' },
              { area: 'Delhi', resolved: 28, total: 45, color: 'bg-yellow-500' },
              { area: 'Pune', resolved: 22, total: 35, color: 'bg-purple-500' },
              { area: 'Ahmedabad', resolved: 15, total: 25, color: 'bg-orange-500' }
            ].map((item) => {
              const percentage = Math.round((item.resolved / item.total) * 100)
              return (
                <div key={item.area}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.area}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.resolved}/{item.total} resolved
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Progress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">📊 Category Progress</h3>
          <div className="flex items-end justify-between h-32 space-x-1">
            {[
              { category: 'Roads', count: 25, color: 'bg-red-500' },
              { category: 'Water', count: 18, color: 'bg-blue-500' },
              { category: 'Waste', count: 32, color: 'bg-green-500' },
              { category: 'Other', count: 15, color: 'bg-gray-500' }
            ].map((data, index) => (
              <div key={data.category} className="flex flex-col items-center flex-1">
                <div 
                  className={`${data.color} rounded-t w-full transition-all duration-500`}
                  style={{ height: `${data.count * 3}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{data.category}</span>
                <span className="text-xs font-semibold">{data.count}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">Issues by category</p>
        </div>

        {/* Resolution Rate */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">🎯 Resolution Rate</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.78)}`}
                  className="text-green-500 transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">78%</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-4">
            Overall resolution rate
          </p>
        </div>
      </div>

      {/* Additional Progress Graphs */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">📈 Monthly Trend</h3>
          <div className="flex items-end justify-between h-32 space-x-2">
            {[
              { month: 'Sep', reports: 45, resolved: 38 },
              { month: 'Oct', reports: 52, resolved: 44 },
              { month: 'Nov', reports: 68, resolved: 58 },
              { month: 'Dec', reports: 75, resolved: 65 }
            ].map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div className="relative w-full flex flex-col">
                  <div 
                    className="bg-red-400 rounded-t w-full"
                    style={{ height: `${data.reports}px` }}
                  ></div>
                  <div 
                    className="bg-green-500 w-full"
                    style={{ height: `${data.resolved}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                <div className="text-xs text-center">
                  <div className="text-green-600 font-semibold">{data.resolved}</div>
                  <div className="text-red-600">{data.reports}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-4 text-xs">
            <div className="flex items-center"><div className="w-3 h-3 bg-red-400 mr-1"></div>Reported</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1"></div>Resolved</div>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">⏱️ Response Time</h3>
          <div className="space-y-4">
            {[
              { priority: 'High Priority', time: '2.5 days', percentage: 85, color: 'bg-red-500' },
              { priority: 'Medium Priority', time: '5.2 days', percentage: 65, color: 'bg-yellow-500' },
              { priority: 'Low Priority', time: '8.7 days', percentage: 45, color: 'bg-green-500' }
            ].map((item) => (
              <div key={item.priority}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.priority}</span>
                  <span>{item.time} avg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">Average response time by priority</p>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
          <div className="text-sm text-gray-600">Total Reports</div>
          <div className="text-xs text-green-600 mt-1">↑ 12% this month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">892</div>
          <div className="text-sm text-gray-600">Resolved Issues</div>
          <div className="text-xs text-green-600 mt-1">↑ 18% this month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">4.2</div>
          <div className="text-sm text-gray-600">Avg Response (days)</div>
          <div className="text-xs text-green-600 mt-1">↓ 8% improvement</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
          <div className="text-sm text-gray-600">Citizen Satisfaction</div>
          <div className="text-xs text-green-600 mt-1">↑ 3% this month</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <MapContainer 
          center={[28.6139, 77.2090]} 
          zoom={12} 
          className="h-96 w-full rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredReports.map(report => (
            <Marker 
              key={report.id} 
              position={[report.lat, report.lng]}
              icon={createCustomIcon(report.category)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.category}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Reports ({filteredReports.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center"><span className="mr-2">🚧</span><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>Road Issues</div>
              <div className="flex items-center"><span className="mr-2">🗑️</span><div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>Illegal Dumping</div>
              <div className="flex items-center"><span className="mr-2">🚮</span><div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>Littering</div>
              <div className="flex items-center"><span className="mr-2">💧</span><div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>Water Leakage</div>
              <div className="flex items-center"><span className="mr-2">♻️</span><div className="w-3 h-3 rounded-full bg-yellow-800 mr-2"></div>Overflowing Bins</div>
              <div className="flex items-center"><span className="mr-2">🎨</span><div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>Vandalism</div>
              <div className="flex items-center"><span className="mr-2">🚻</span><div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>Public Urination</div>
              <div className="flex items-center"><span className="mr-2">❗</span><div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>Other</div>
            </div>
          </div>
          <div className="space-y-3">
            {filteredReports.map(report => (
              <div key={report.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      report.category === 'Road Issues' ? 'bg-red-500' :
                      report.category === 'Illegal Dumping' ? 'bg-orange-500' :
                      report.category === 'Littering' ? 'bg-yellow-500' :
                      report.category === 'Water Leakage' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}></div>
                    <div>
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-sm text-gray-600">{report.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    report.status === 'reported' ? 'bg-red-100 text-red-800' :
                    report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}