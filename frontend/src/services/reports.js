export const reportsService = {
  async createReport(reportData) {
    const storedUser = localStorage.getItem('civiq_user')
    
    if (!storedUser) {
      return { data: null, error: { message: 'Please login first to submit reports' } }
    }
    
    const user = JSON.parse(storedUser)
    
    // Create report with local storage
    const newReport = {
      id: Date.now().toString(),
      ...reportData,
      user_id: user.id,
      user_email: user.email,
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      status: 'reported',
      status_history: [{
        status: 'reported',
        timestamp: new Date().toISOString(),
        updated_by: user.email
      }]
    }
    
    // Get existing reports
    const existingReports = JSON.parse(localStorage.getItem('civiq_reports') || '[]')
    existingReports.push(newReport)
    localStorage.setItem('civiq_reports', JSON.stringify(existingReports))
    
    // Award 50 points for submitting report
    const points = JSON.parse(localStorage.getItem('civiq_user_points') || '{}')
    points[user.email] = (points[user.email] || 0) + 50
    localStorage.setItem('civiq_user_points', JSON.stringify(points))
    
    // Generate downloadable report
    this.generateDownloadableReport(newReport, user)
    
    return { data: [newReport], error: null }
  },

  generateDownloadableReport(report, user) {
    const imageSection = report.image ? `
          <div class="field">
            <span class="label">Attached Image:</span><br>
            <img src="${report.image.dataUrl}" alt="Report Image" style="max-width: 400px; max-height: 300px; margin-top: 10px; border: 1px solid #ccc;">
            <br><small>File: ${report.image.name} (${(report.image.size / 1024).toFixed(1)} KB)</small>
          </div>` : ''
    
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CivIQ Report - ${report.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .field { margin: 10px 0; }
          .label { font-weight: bold; }
          .footer { margin-top: 30px; padding: 20px; background: #f3f4f6; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏛️ CivIQ - Civic Issue Report</h1>
          <p>Report ID: ${report.id}</p>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Title:</span> ${report.title}
          </div>
          <div class="field">
            <span class="label">Category:</span> ${report.category}
          </div>
          <div class="field">
            <span class="label">Description:</span> ${report.description}
          </div>
          <div class="field">
            <span class="label">Location:</span> ${report.address || 'Not specified'}
          </div>${imageSection}
          <div class="field">
            <span class="label">Reported by:</span> ${user.user_metadata?.name || 'Anonymous'}
          </div>
          <div class="field">
            <span class="label">Email:</span> ${user.email}
          </div>
          <div class="field">
            <span class="label">Date Submitted:</span> ${new Date(report.created_at).toLocaleDateString()}
          </div>
          <div class="field">
            <span class="label">Status:</span> ${report.status.toUpperCase()}
          </div>
          <div class="field">
            <span class="label">Citizen Points Earned:</span> +50 points
          </div>
        </div>
        <div class="footer">
          <p>Thank you for contributing to civic improvement!</p>
          <p>Generated on ${new Date().toLocaleDateString()} | CivIQ Platform</p>
        </div>
      </body>
      </html>
    `
    
    // Create and trigger download
    const blob = new Blob([reportHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `CivIQ-Report-${report.id}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  async getUserReports() {
    const storedUser = localStorage.getItem('civiq_user')
    if (!storedUser) return { data: [], error: null }
    
    const user = JSON.parse(storedUser)
    const allReports = JSON.parse(localStorage.getItem('civiq_reports') || '[]')
    const userReports = allReports.filter(report => report.user_id === user.id)
    
    return { data: userReports, error: null }
  },

  async getAllReports() {
    const allReports = JSON.parse(localStorage.getItem('civiq_reports') || '[]')
    return { data: allReports, error: null }
  },

  async getReportsWithLocation() {
    const allReports = JSON.parse(localStorage.getItem('civiq_reports') || '[]')
    
    const reportsWithCoords = allReports.map(report => {
      if (report.location && typeof report.location === 'object') {
        return {
          ...report,
          lat: report.location.lat,
          lng: report.location.lng
        }
      }
      // Fallback coordinates for reports without location
      return {
        ...report,
        lat: 28.6139 + (Math.random() - 0.5) * 0.1,
        lng: 77.2090 + (Math.random() - 0.5) * 0.1
      }
    })
    
    return { data: reportsWithCoords, error: null }
  },

  async resolveReport(reportId, workerEmail) {
    const allReports = JSON.parse(localStorage.getItem('civiq_reports') || '[]')
    const reportIndex = allReports.findIndex(report => report.id === reportId)
    
    if (reportIndex === -1) {
      return { data: null, error: { message: 'Report not found' } }
    }
    
    // Update report status
    allReports[reportIndex].status = 'resolved'
    allReports[reportIndex].resolved_at = new Date().toISOString()
    allReports[reportIndex].resolved_by = workerEmail
    localStorage.setItem('civiq_reports', JSON.stringify(allReports))
    
    // Award 20 points to worker
    const points = JSON.parse(localStorage.getItem('civiq_user_points') || '{}')
    points[workerEmail] = (points[workerEmail] || 0) + 20
    localStorage.setItem('civiq_user_points', JSON.stringify(points))
    
    return { data: allReports[reportIndex], error: null }
  },

  async updateReportStatus(reportId, newStatus, updatedBy = null) {
    const allReports = JSON.parse(localStorage.getItem('civiq_reports') || '[]')
    const reportIndex = allReports.findIndex(report => report.id === reportId)
    
    if (reportIndex === -1) {
      return { data: null, error: { message: 'Report not found' } }
    }
    
    allReports[reportIndex].status = newStatus
    allReports[reportIndex].last_updated = new Date().toISOString()
    
    if (!allReports[reportIndex].status_history) {
      allReports[reportIndex].status_history = []
    }
    
    allReports[reportIndex].status_history.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      updated_by: updatedBy
    })
    
    localStorage.setItem('civiq_reports', JSON.stringify(allReports))
    return { data: allReports[reportIndex], error: null }
  }
}