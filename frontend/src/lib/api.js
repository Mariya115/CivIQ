const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiClient {
  constructor() {
    this.baseURL = API_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = localStorage.getItem('civiq_token')
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  // Auth methods
  async signUp(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async signIn(credentials) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  async signOut() {
    localStorage.removeItem('civiq_token')
    localStorage.removeItem('civiq_user')
    return { success: true }
  }

  async getUser() {
    const user = localStorage.getItem('civiq_user')
    return user ? JSON.parse(user) : null
  }

  // Reports methods
  async getReports() {
    return this.request('/reports')
  }

  async createReport(reportData) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData)
    })
  }

  async updateReport(id, updateData) {
    return this.request(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })
  }
}

export const apiClient = new ApiClient()