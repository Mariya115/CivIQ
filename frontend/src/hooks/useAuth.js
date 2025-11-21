import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('civiq_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signUp = async (email, password, name, role = 'Citizen', city = '') => {
    // Create local user
    const newUser = {
      id: Date.now().toString(),
      email,
      user_metadata: { name, role, city },
      created_at: new Date().toISOString()
    }
    
    // Store user data
    localStorage.setItem('civiq_user', JSON.stringify(newUser))
    localStorage.setItem(`civiq_password_${email}`, password)
    setUser(newUser)
    
    return { 
      data: { user: newUser, session: { user: newUser } }, 
      error: null 
    }
  }

  const signIn = async (email, password) => {
    // Check stored password
    const storedPassword = localStorage.getItem(`civiq_password_${email}`)
    const storedUser = localStorage.getItem('civiq_user')
    
    if (storedUser && storedPassword === password) {
      const user = JSON.parse(storedUser)
      if (user.email === email) {
        setUser(user)
        return { data: { user, session: { user } }, error: null }
      }
    }
    
    return { data: null, error: { message: 'Invalid email or password' } }
  }

  const signOut = async () => {
    localStorage.removeItem('civiq_user')
    setUser(null)
    return { error: null }
  }

  return { user, loading, signUp, signIn, signOut }
}