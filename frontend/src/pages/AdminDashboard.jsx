import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { aiValidationService } from '../services/aiValidation'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0
  })
  const [showUploadModal, setShowUploadModal] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imageValidation, setImageValidation] = useState(null)

  useEffect(() => {
    // Load all reports
    const allReports = JSON.parse(localStorage.getItem('civiq_reports') || '[]')
    setReports(allReports)

    // Calculate stats
    const pending = allReports.filter(r => r.status === 'reported').length
    const inProgress = allReports.filter(r => r.status === 'in_progress').length
    const completed = allReports.filter(r => r.status === 'resolved').length

    setStats({
      pending,
      inProgress,
      completed,
      total: allReports.length
    })
  }, [])

  const updateReportStatus = (reportId, newStatus) => {
    if (newStatus === 'resolved') {
      setShowUploadModal(reportId)
      return
    }
    
    const allReports = JSON.parse(localStorage.getItem('civiq_reports') || '[]')
    const updatedReports = allReports.map(r => 
      r.id === reportId ? { ...r, status: newStatus } : r
    )
    localStorage.setItem('civiq_reports', JSON.stringify(updatedReports))
    setReports(updatedReports)
    updateStats(updatedReports)
  }

  const handleResolveWithImage = () => {
    const allReports = JSON.parse(localStorage.getItem('civiq_reports') || '[]')
    const report = allReports.find(r => r.id === showUploadModal)
    const updatedReports = allReports.map(r => 
      r.id === showUploadModal ? { 
        ...r, 
        status: 'resolved',
        resolvedImage: uploadedImage,
        resolvedBy: user?.email,
        resolvedAt: new Date().toISOString()
      } : r
    )
    localStorage.setItem('civiq_reports', JSON.stringify(updatedReports))
    setReports(updatedReports)

    // Award points when report is resolved
    if (report?.status !== 'resolved') {
      const points = JSON.parse(localStorage.getItem('civiq_user_points') || '{}')
      
      // Award 50 points to citizen who reported
      if (report.user_email) {
        points[report.user_email] = (points[report.user_email] || 0) + 50
      }
      
      // Award 20 points to worker who resolved
      if (user?.email) {
        points[user.email] = (points[user.email] || 0) + 20
      }
      
      localStorage.setItem('civiq_user_points', JSON.stringify(points))
    }

    updateStats(updatedReports)
    setShowUploadModal(null)
    setUploadedImage(null)
  }

  const updateStats = (updatedReports) => {
    const pending = updatedReports.filter(r => r.status === 'reported').length
    const inProgress = updatedReports.filter(r => r.status === 'in_progress').length
    const completed = updatedReports.filter(r => r.status === 'resolved').length

    setStats({
      pending,
      inProgress,
      completed,
      total: updatedReports.length
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setUploadedImage(e.target.result)
      reader.readAsDataURL(file)
      
      // Validate completion image
      try {
        const validation = await aiValidationService.validateCompletionPhoto(file, 'completion')
        setImageValidation(validation)
      } catch (error) {
        setImageValidation({
          isValid: false,
          confidence: 0,
          message: 'Error validating image. Please try again.'
        })
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to access the admin dashboard</p>
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
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">
          {user.user_metadata?.role ? `${user.user_metadata.role} Dashboard` : 'Admin Dashboard'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and track civic issue reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="text-blue-500 text-2xl">📊</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-3xl font-bold text-red-600">{stats.pending}</p>
            </div>
            <div className="text-red-500 text-2xl">⏳</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <div className="text-yellow-500 text-2xl">🔄</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="text-green-500 text-2xl">✅</div>
          </div>
        </div>
      </div>

      {/* Advanced Visualizations */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Overall Progress */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Overall Progress</h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% resolved
          </p>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Status Distribution</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#e5e7eb" strokeWidth="10"/>
                {stats.total > 0 && (
                  <>
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#ef4444" strokeWidth="10"
                      strokeDasharray={`${(stats.pending / stats.total) * 220} 220`} strokeDashoffset="0"/>
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#eab308" strokeWidth="10"
                      strokeDasharray={`${(stats.inProgress / stats.total) * 220} 220`} 
                      strokeDashoffset={`-${(stats.pending / stats.total) * 220}`}/>
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#22c55e" strokeWidth="10"
                      strokeDasharray={`${(stats.completed / stats.total) * 220} 220`} 
                      strokeDashoffset={`-${((stats.pending + stats.inProgress) / stats.total) * 220}`}/>
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold dark:text-white">{stats.total}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 mt-4 text-xs">
            <div className="text-center"><div className="w-2 h-2 bg-red-500 rounded mx-auto mb-1"></div>{stats.pending}</div>
            <div className="text-center"><div className="w-2 h-2 bg-yellow-500 rounded mx-auto mb-1"></div>{stats.inProgress}</div>
            <div className="text-center"><div className="w-2 h-2 bg-green-500 rounded mx-auto mb-1"></div>{stats.completed}</div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Weekly Trend</h3>
          <div className="relative h-16">
            <svg className="w-full h-full" viewBox="0 0 200 60">
              <polyline 
                fill="none" 
                stroke="#22c55e" 
                strokeWidth="2"
                points="20,50 60,35 100,25 140,15 180,10"
              />
              <circle cx="20" cy="50" r="2" fill="#22c55e"/>
              <circle cx="60" cy="35" r="2" fill="#22c55e"/>
              <circle cx="100" cy="25" r="2" fill="#22c55e"/>
              <circle cx="140" cy="15" r="2" fill="#22c55e"/>
              <circle cx="180" cy="10" r="2" fill="#22c55e"/>
            </svg>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>Now</span>
          </div>
        </div>

        {/* Gauge Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Performance</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-20 h-10 overflow-hidden">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                <path d="M 20 50 A 30 30 0 0 1 80 50" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                <path d="M 20 50 A 30 30 0 0 1 80 50" fill="none" stroke="#22c55e" strokeWidth="8"
                  strokeDasharray={`${(stats.total > 0 ? (stats.completed / stats.total) : 0) * 94.2} 94.2`}/>
              </svg>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <span className="text-xs font-bold dark:text-white">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">Efficiency Score</p>
        </div>
      </div>

      {/* Category Analytics */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Reports by Category</h3>
          <div className="space-y-3">
            {['Waste Management', 'Road & Infrastructure', 'Water Management', 'Public Safety', 'Other'].map((category, index) => {
              const categoryCount = reports.filter(r => r.category === category).length
              const percentage = reports.length > 0 ? (categoryCount / reports.length) * 100 : 0
              const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500']
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <div className={`w-3 h-3 rounded ${colors[index]}`}></div>
                    <span className="text-sm dark:text-white truncate">{category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className={`h-2 rounded-full ${colors[index]} transition-all duration-300`} 
                           style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-8">{categoryCount}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Resolution Time Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Resolution Timeline</h3>
          <div className="flex items-end justify-between h-32 space-x-2">
            {['<1d', '1-3d', '3-7d', '1-2w', '>2w'].map((timeframe, index) => {
              const height = Math.random() * 80 + 20
              const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500']
              return (
                <div key={timeframe} className="flex flex-col items-center flex-1">
                  <div className={`w-full rounded-t transition-all duration-500 hover:opacity-80 ${colors[index]}`}
                       style={{ height: `${height}px` }}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{timeframe}</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {Math.floor(Math.random() * 20) + 5}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Average resolution time by category</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-white">All Reports</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{report.description?.substring(0, 50)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {report.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(report.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <select
                        value={report.status}
                        onChange={(e) => updateReportStatus(report.id, e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 text-sm"
                      >
                        <option value="reported">Reported</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      {report.resolvedImage && (
                        <span className="text-green-600 text-lg" title="Photo uploaded">📸</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg">No reports found</div>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Reports submitted by citizens will appear here</p>
          </div>
        )}
      </div>

      {/* Upload Image Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 dark:text-white">📸 Upload Completion Photo</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please upload a photo showing the resolved issue to complete this report.
            </p>
            
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {uploadedImage && (
              <div className="mb-4">
                <img 
                  src={uploadedImage} 
                  alt="Completion proof" 
                  className="w-full h-48 object-cover rounded-lg border"
                />
                
                {imageValidation && (
                  <div className={`mt-2 p-3 rounded-lg text-sm ${
                    imageValidation.isValid 
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">
                        {imageValidation.isValid ? '✅' : '❌'}
                      </span>
                      <p>{imageValidation.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleResolveWithImage}
                disabled={!uploadedImage || (imageValidation && !imageValidation.isValid)}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                ✅ Mark as Resolved
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(null)
                  setUploadedImage(null)
                }}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}