'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Test accounts - only you know these
  const TEST_ACCOUNTS = {
    // Free test account
    'test@free.com': {
      id: 'free-user',
      email: 'test@free.com',
      name: 'Free User',
      isPro: false,
      joinDate: '2024-01-15',
      usageToday: {
        'qr-generator': 7,
        'json-formatter': 3,
        'password-generator': 5,
        'hash-generator': 2,
        'base64-encoder': 4
      },
      usageThisMonth: {
        totalUsage: 156,
        toolsUsed: 12,
        favoriteCategory: 'Developer Tools'
      }
    },
    // Pro test account - YOUR SECRET ACCOUNT
    'admin@zendztools.com': {
      id: 'pro-admin',
      email: 'admin@zendztools.com',
      name: 'Admin Pro User',
      isPro: true,
      joinDate: '2024-01-01',
      usageToday: {}, // Unlimited, so we don't track
      usageThisMonth: {
        totalUsage: 847,
        toolsUsed: 25,
        favoriteCategory: 'All Categories'
      },
      subscription: {
        plan: 'Pro Annual',
        status: 'active',
        renewsOn: '2025-01-01',
        amount: '$18/year'
      }
    }
  }

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('zendztools_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error loading saved user:', error)
        localStorage.removeItem('zendztools_user')
      }
    }
  }, [])

  const signIn = async (email, password) => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Check test accounts
    const testUser = TEST_ACCOUNTS[email]
    
    if (testUser) {
      // Simulate successful login
      setUser(testUser)
      localStorage.setItem('zendztools_user', JSON.stringify(testUser))
      setIsLoading(false)
      return { success: true, user: testUser }
    } else {
      // Simulate failed login
      setIsLoading(false)
      return { 
        success: false, 
        error: 'Invalid credentials. Use test@free.com or admin@zendztools.com' 
      }
    }
  }

  const signUp = async (email, password, name) => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Create new free user (for testing)
    const newUser = {
      id: 'new-user-' + Date.now(),
      email,
      name,
      isPro: false,
      joinDate: new Date().toISOString(),
      usageToday: {},
      usageThisMonth: {
        totalUsage: 0,
        toolsUsed: 0,
        favoriteCategory: 'None'
      }
    }
    
    setUser(newUser)
    localStorage.setItem('zendztools_user', JSON.stringify(newUser))
    setIsLoading(false)
    
    return { success: true, user: newUser }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('zendztools_user')
  }

  const updateUsage = (toolId) => {
    if (!user || user.isPro) return // Pro users have unlimited usage
    
    const updatedUser = {
      ...user,
      usageToday: {
        ...user.usageToday,
        [toolId]: (user.usageToday[toolId] || 0) + 1
      },
      usageThisMonth: {
        ...user.usageThisMonth,
        totalUsage: user.usageThisMonth.totalUsage + 1
      }
    }
    
    setUser(updatedUser)
    localStorage.setItem('zendztools_user', JSON.stringify(updatedUser))
  }

  const upgradeToPro = () => {
    if (!user) return
    
    const upgradedUser = {
      ...user,
      isPro: true,
      subscription: {
        plan: 'Pro Annual',
        status: 'active',
        renewsOn: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        amount: '$18/year'
      }
    }
    
    setUser(upgradedUser)
    localStorage.setItem('zendztools_user', JSON.stringify(upgradedUser))
  }

  // Developer function to toggle Pro status (for testing)
  const toggleProStatus = () => {
    if (!user) return
    
    const toggledUser = {
      ...user,
      isPro: !user.isPro,
      subscription: !user.isPro ? {
        plan: 'Pro Annual',
        status: 'active',
        renewsOn: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        amount: '$18/year'
      } : null
    }
    
    setUser(toggledUser)
    localStorage.setItem('zendztools_user', JSON.stringify(toggledUser))
  }

  const value = {
    user,
    isLoading,
    isSignedIn: !!user,
    signIn,
    signUp,
    signOut,
    updateUsage,
    upgradeToPro,
    toggleProStatus, // For testing only
    
    // Helper functions
    getUsageToday: (toolId) => user?.usageToday?.[toolId] || 0,
    canUseTool: (toolId, limit = 10) => {
      if (!user) return true // Anonymous users can try
      if (user.isPro) return true // Pro users unlimited
      return (user.usageToday?.[toolId] || 0) < limit
    },
    getRemainingUsage: (toolId, limit = 10) => {
      if (!user || user.isPro) return 'unlimited'
      return Math.max(0, limit - (user.usageToday?.[toolId] || 0))
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider