'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthProvider'
import SignInPage from '../../../components/auth/SignInPage'

// export const metadata = {
//   title: 'Sign In - ZendzTools',
//   description: 'Sign in to your ZendzTools account to access Pro features and unlimited usage.',
// }

export default function SignInRoute() {
  const { isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if already signed in
    if (isSignedIn) {
      router.push('/dashboard')
    }
  }, [isSignedIn, router])

  // Show loading screen while checking auth state
  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Already signed in</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return <SignInPage defaultTab="signin" />
}