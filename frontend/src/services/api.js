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
  async login(emailOrPhone, password) {
    try {
      const { data } = await api.post('/auth/signin', { emailOrPhone, password })
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      return data
    } catch (error) {
      // Mock login fallback
      const mockUser = {
        id: 1,
        firstName: 'Mariya',
        lastName: 'User',
        email: emailOrPhone,
        phone: '+91 9876543210',
        role: 'Citizen',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        points: 1250
      }
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      return { user: mockUser, token: mockToken }
    }
  },

  async register(userData) {
    try {
      const { data } = await api.post('/auth/signup', userData)
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      return data
    } catch (error) {
      // Mock registration fallback
      const mockUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        pincode: userData.pincode,
        points: 0
      }
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      return { user: mockUser, token: mockToken }
    }
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
  },

  // User endpoints
  async getProfile() {
    const { data } = await api.get('/users/profile')
    return data
  },

  async updateProfile(profileData) {
    const { data } = await api.put('/users/profile', profileData)
    return data
  },

  // Challenge endpoints
  async getChallenges() {
    const { data } = await api.get('/challenges')
    return data
  },

  async joinChallenge(challengeId) {
    const { data } = await api.post(`/challenges/${challengeId}/join`)
    return data
  },

  async completeChallenge(challengeId) {
    const { data } = await api.put(`/challenges/${challengeId}/complete`)
    return data
  },

  // Leaderboard endpoints
  async getLeaderboard() {
    const { data } = await api.get('/leaderboard')
    return data
  },

  // Bills endpoints
  async getBills() {
    try {
      const { data } = await api.get('/bills')
      return data
    } catch (error) {
      // Mock bills data with discounts for top users
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      const userId = storedUser.id || 'USER001'
      
      // Top 5 users get discounts
      const topUsers = ['USER001', 'USER002', 'USER003', 'USER004', 'USER005']
      const userRank = topUsers.indexOf(userId) + 1
      const discount = userRank === 1 ? 20 : userRank === 2 ? 15 : userRank === 3 ? 12 : userRank === 4 ? 10 : userRank === 5 ? 8 : 0
      
      const mockBills = [
        {
          _id: 'BILL001',
          billId: 'ELEC2024001',
          type: 'electricity',
          amount: 2500,
          discount: discount,
          status: 'pending',
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: 'BILL002', 
          billId: 'WATER2024001',
          type: 'water',
          amount: 800,
          discount: discount,
          status: 'pending',
          dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: 'BILL003',
          billId: 'GAS2024001', 
          type: 'gas',
          amount: 1200,
          discount: discount,
          status: 'pending',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      return {
        bills: mockBills,
        rewards: userRank > 0 ? [{
          title: `Top ${userRank} Civic Champion Reward`,
          discount: discount,
          validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          used: false
        }] : []
      }
    }
  },

  async payBill(billId) {
    const { data } = await api.post(`/bills/${billId}/pay`)
    return data
  },

  async getBillQR(billId) {
    try {
      const { data } = await api.get(`/bills/${billId}/qr`)
      return data
    } catch (error) {
      // Generate mock QR data
      const mockBills = {
        'BILL001': { billId: 'ELEC2024001', type: 'Electricity', amount: 2500 },
        'BILL002': { billId: 'WATER2024001', type: 'Water', amount: 800 },
        'BILL003': { billId: 'GAS2024001', type: 'Gas', amount: 1200 }
      }
      
      return {
        data: mockBills[billId] || { billId: billId, type: 'Utility', amount: 1000 },
        qrCode: `upi://pay?pa=civiq@paytm&pn=CivIQ&am=${mockBills[billId]?.amount || 1000}&cu=INR&tn=Bill Payment ${billId}`
      }
    }
  },

  // OTP endpoints
  async sendOTP(emailOrPhone) {
    const { data } = await api.post('/otp/send', { emailOrPhone })
    return data
  },

  async verifyOTP(emailOrPhone, otp) {
    const { data } = await api.post('/otp/verify', { emailOrPhone, otp })
    return data
  },

  // Test connection
  async testConnection() {
    const { data } = await api.get('/test')
    return data
  }
}

export default api