export default function ReportCard({ report }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'under_review': return 'bg-blue-100 text-blue-800'
      default: return 'bg-red-100 text-red-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Road Issues': return 'bg-red-500'
      case 'Illegal Dumping': return 'bg-orange-500'
      case 'Littering': return 'bg-yellow-500'
      case 'Water Leakage': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${getCategoryColor(report.category)}`}></div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
            <p className="text-sm text-gray-600">{report.category}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
          {report.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      
      {report.description && (
        <p className="text-gray-700 mb-3">{report.description}</p>
      )}
      
      {report.image && report.image.dataUrl && (
        <div className="mb-3">
          <img 
            src={report.image.dataUrl} 
            alt="Report evidence" 
            className="max-w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(report.image.dataUrl, '_blank')}
          />
          <p className="text-xs text-gray-500 mt-1">
            📎 {report.image.name} ({(report.image.size / 1024).toFixed(1)} KB)
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>📅 {formatDate(report.created_at)}</span>
        <span className="text-primary-600 font-semibold">
          +{report.points_awarded || 50} Points
        </span>
      </div>
      
      {report.location && (
        <div className="mt-2 text-xs text-gray-400">
          📍 Location: {report.location.lat?.toFixed(4)}, {report.location.lng?.toFixed(4)}
        </div>
      )}
      
      {report.last_updated && (
        <div className="mt-2 text-xs text-gray-400">
          🔄 Last updated: {formatDate(report.last_updated)}
        </div>
      )}
    </div>
  )
}