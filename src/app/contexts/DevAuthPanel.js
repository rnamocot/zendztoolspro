'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider' // Adjust import path as needed
import { 
  Settings, 
  User, 
  Crown, 
  RotateCcw, 
  LogOut, 
  Eye, 
  EyeOff,
  TestTube,
  Zap
} from 'lucide-react'

const DevAuthPanel = () => {
  const { 
    user, 
    isSignedIn, 
    signIn, 
    signOut, 
    toggleProStatus,
    getUsageToday,
    canUseTool 
  } = useAuth()
  
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const quickSignIn = async (accountType) => {
    setIsLoading(true)
    
    const accounts = {
      free: { email: 'test@free.com', password: 'test123' },
      pro: { email: 'admin@zendztools.com', password: 'admin123' }
    }
    
    const account = accounts[accountType]
    await signIn(account.email, account.password)
    setIsLoading(false)
  }

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Developer Auth Panel"
      >
        <TestTube className="w-5 h-5" />
      </button>

      {/* Developer Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Dev Auth Panel
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>

          {/* Current User Status */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Current Status</h4>
            {isSignedIn ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">User:</span>
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plan:</span>
                  <div className="flex items-center">
                    {user.isPro && <Crown className="w-3 h-3 text-purple-500 mr-1" />}
                    <span className={`text-sm font-medium ${user.isPro ? 'text-purple-600' : 'text-gray-900'}`}>
                      {user.isPro ? 'Pro' : 'Free'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">QR Usage:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user.isPro ? '∞' : `${getUsageToday('qr-generator')}/10`}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Not signed in</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            {!isSignedIn ? (
              <>
                <button
                  onClick={() => quickSignIn('free')}
                  disabled={isLoading}
                  className="w-full btn btn-secondary btn-sm flex items-center justify-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In as Free User
                </button>
                
                <button
                  onClick={() => quickSignIn('pro')}
                  disabled={isLoading}
                  className="w-full btn btn-primary btn-sm flex items-center justify-center"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Sign In as Pro User
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleProStatus}
                  className={`w-full btn btn-sm flex items-center justify-center ${
                    user.isPro ? 'btn-secondary' : 'btn-primary'
                  }`}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {user.isPro ? 'Switch to Free' : 'Switch to Pro'}
                </button>
                
                <button
                  onClick={signOut}
                  className="w-full btn btn-outline-red btn-sm flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* Test Credentials */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 text-sm mb-2">Test Credentials</h4>
            <div className="space-y-1 text-xs text-blue-800">
              <div><strong>Free:</strong> test@free.com</div>
              <div><strong>Pro:</strong> admin@zendztools.com</div>
              <div className="text-blue-600 mt-1">Password: any</div>
            </div>
          </div>

          {/* Tool Test Links */}
          {isSignedIn && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">Quick Test</h4>
              <div className="space-y-2">
                <a
                  href="/tools/qr-generator"
                  className="block text-sm text-blue-600 hover:text-blue-500"
                >
                  → Test QR Generator ({user.isPro ? 'Unlimited' : `${10 - getUsageToday('qr-generator')} left`})
                </a>
                <a
                  href="/dashboard"
                  className="block text-sm text-blue-600 hover:text-blue-500"
                >
                  → View Dashboard
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default DevAuthPanel