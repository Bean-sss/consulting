import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock user data
  const mockUsers = {
    vendor: {
      id: 1,
      name: 'Defense Solutions Inc.',
      email: 'admin@defensesolutions.com',
      role: 'vendor',
      avatar: '/api/placeholder/40/40',
      company: 'Defense Solutions Inc.',
      clearanceLevel: 'Top Secret',
      certifications: ['DFARS', 'ITAR', 'ISO 27001'],
      capabilities: ['Cybersecurity', 'Software Development', 'Systems Integration']
    },
    contractor: {
      id: 2,
      name: 'John Mitchell',
      email: 'j.mitchell@pentagon.gov',
      role: 'contractor',
      avatar: '/api/placeholder/40/40',
      company: 'U.S. Department of Defense',
      clearanceLevel: 'Top Secret',
      department: 'Acquisition & Sustainment',
      position: 'Senior Acquisition Specialist'
    }
  }

  useEffect(() => {
    // Check if user is already logged in (mock localStorage check)
    const savedUser = localStorage.getItem('mockUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (role) => {
    const userData = mockUsers[role]
    setUser(userData)
    localStorage.setItem('mockUser', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mockUser')
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isVendor: user?.role === 'vendor',
    isContractor: user?.role === 'contractor'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 