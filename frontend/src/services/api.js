import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const apiService = {
  // Auth endpoints
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    return data
  },

  async register(userData) {
    const { data } = await api.post('/auth/register', userData)
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    return data
  },

  // Reports endpoints
  async createReport(reportData) {
    const { data } = await api.post('/reports', reportData)
    return data
  },

  async getReports() {
    const { data } = await api.get('/reports')
    return data
  },

  async getUserReports() {
    const { data } = await api.get('/reports/user')
    return data
  }
}

export default api