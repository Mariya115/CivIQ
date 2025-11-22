import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user and token
    const storedUser = localStorage.getItem('user') || localStorage.getItem('civiq_user')
    const token = localStorage.getItem('token') || localStorage.getItem('civiq_token')
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signUp = async (email, password, name, role = 'Citizen', phone = '') => {
    try {
      const response = await apiClient.signUp({
        email,
        password,
        role,
        phone,
        profile: { firstName: name }
      })
      
      // Store token and user data
      localStorage.setItem('civiq_token', response.token)
      localStorage.setItem('civiq_user', JSON.stringify({
        ...response.user,
        user_metadata: { name, role }
      }))
      
      const userData = {
        ...response.user,
        user_metadata: { name, role }
      }
      setUser(userData)
      
      return { 
        data: { user: userData, session: { user: userData } }, 
        error: null 
      }
    } catch (error) {
      return { data: null, error: { message: error.message } }
    }
  }

  const signIn = async (email, password) => {
    try {
      const response = await apiClient.signIn({ email, password })
      
      // Store token and user data
      localStorage.setItem('civiq_token', response.token)
      localStorage.setItem('civiq_user', JSON.stringify({
        ...response.user,
        user_metadata: { role: response.user.role }
      }))
      
      const userData = {
        ...response.user,
        user_metadata: { role: response.user.role }
      }
      setUser(userData)
      
      return { data: { user: userData, session: { user: userData } }, error: null }
    } catch (error) {
      return { data: null, error: { message: error.message } }
    }
  }

  const signOut = async () => {
    try {
      await apiClient.signOut()
      setUser(null)
      return { error: null }
    } catch (error) {
      return { error: { message: error.message } }
    }
  }

  return { user, loading, signUp, signIn, signOut }
}