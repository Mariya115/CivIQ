import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setUploadedImage(e.target.result)
      reader.readAsDataURL(file)
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

      {/* Progress Charts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% of reports resolved
          </p>
        </div>

        {/* Monthly Progress Graph */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Monthly Progress</h3>
          <div className="flex items-end justify-between h-32 space-x-2">
            {[{month: 'Oct', value: 60}, {month: 'Nov', value: 80}, {month: 'Dec', value: 95}].map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div className="relative w-full">
                  <div 
                    className="bg-gradient-to-t from-primary-600 to-primary-400 rounded-t w-full transition-all duration-500 hover:from-primary-700 hover:to-primary-500"
                    style={{ height: `${data.value * 1.2}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{data.month}</span>
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{data.value}%</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Resolution rate improvement over time</p>
        </div>

        {/* Circular Progress Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Success Rate</h3>
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
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (stats.total > 0 ? stats.completed / stats.total : 0))}`}
                  className="text-green-500 transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold dark:text-white">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
            {stats.completed} of {stats.total} resolved
          </p>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Report Analytics</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {reports.length > 0 ? Math.round(reports.filter(r => r.status === 'resolved').length / reports.length * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${reports.length > 0 ? (reports.filter(r => r.status === 'resolved').length / reports.length * 100) : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {reports.length > 0 ? Math.round(reports.filter(r => r.status === 'in_progress').length / reports.length * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2 mt-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${reports.length > 0 ? (reports.filter(r => r.status === 'in_progress').length / reports.length * 100) : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {reports.length > 0 ? Math.round(reports.filter(r => r.status === 'reported').length / reports.length * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-2 mt-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${reports.length > 0 ? (reports.filter(r => r.status === 'reported').length / reports.length * 100) : 0}%` }}
              ></div>
            </div>
          </div>
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
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleResolveWithImage}
                disabled={!uploadedImage}
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