'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Zap,
  Crown,
  Check,
  Star,
  Users,
  Shield,
  Github,
  Chrome,
  AlertCircle,
  Loader,
  ExternalLink
} from 'lucide-react'

const SignInPage = () => {
  const router = useRouter()
  const { signIn, signUp, isLoading } = useAuth() // Use auth context
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '' // For signup
  })
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('signin')
  const [error, setError] = useState('') // Add error state

  const proFeatures = [
    'Unlimited usage on all 75+ tools',
    'Advanced features and customization',
    'Batch processing capabilities',
    'Priority email support',
    'Commercial use license',
    'No watermarks or limits',
    'Early access to new tools'
  ]

  const socialProviders = [
    { name: 'Google', icon: Chrome, color: 'bg-red-500' },
    { name: 'GitHub', icon: Github, color: 'bg-gray-800' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      let result
      if (activeTab === 'signin') {
        result = await signIn(formData.email, formData.password)
      } else {
        result = await signUp(formData.email, formData.password, formData.name)
      }
      
      if (result.success) {
        // Redirect to dashboard on success
        router.push('/dashboard')
      } else {
        setError(result.error || 'Authentication failed')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  const handleSocialSignIn = (provider) => {
    setError(`${provider} sign in would be implemented here`)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // Clear error when user types
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center text-slate-600 hover:text-sky-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Sign In Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-200 shadow-lg"
            >
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-800">Zendz Tools</span>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('signin')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    activeTab === 'signin'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    activeTab === 'signup'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Welcome Message */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {activeTab === 'signin' ? 'Welcome back!' : 'Get started today'}
                </h1>
                <p className="text-gray-600">
                  {activeTab === 'signin' 
                    ? 'Sign in to access your account and Pro features' 
                    : 'Join thousands of professionals using our tools'
                  }
                </p>
              </div>

              {/* Social Sign In */}
              <div className="space-y-3 mb-6">
                {socialProviders.map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => handleSocialSignIn(provider.name)}
                    className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <provider.icon className="w-5 h-5" />
                    <span className="font-medium text-gray-700">
                      Continue with {provider.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}

                {/* Name field for signup */}
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password - Only for signin */}
                {activeTab === 'signin' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Remember me</span>
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      {activeTab === 'signin' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                    </>
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {activeTab === 'signin' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    {activeTab === 'signin' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              {/* Terms */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our{' '}
                  <Link href="/terms" className="text-primary-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* Test Credentials for Development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 text-sm mb-2">Test Credentials</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div>
                      <strong>Free User:</strong> test@free.com (any password)
                    </div>
                    <div>
                      <strong>Pro User:</strong> admin@zendztools.com (any password)
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Side - Pro Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Pro Upgrade Card */}
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <Crown className="w-8 h-8 text-yellow-300 mr-3" />
                    <span className="text-2xl font-bold">Upgrade to Pro</span>
                  </div>
                  
                  <p className="text-lg opacity-90 mb-6">
                    Unlock the full potential of our professional tool suite
                  </p>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
                    <div className="text-3xl font-bold mb-2">Only $1.50/month</div>
                    <div className="text-sm opacity-80">when billed annually • 25% savings</div>
                  </div>
                  
                  <Link
                    href="/pricing"
                    className="btn bg-white text-purple-600 hover:bg-gray-50 w-full justify-center"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Start 14-Day Free Trial
                  </Link>
                </div>
              </div>

              {/* Features List */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Why choose Pro?
                </h3>
                <ul className="space-y-4">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Proof */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Trusted by professionals
                  </h3>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">10K+</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-600">75+</div>
                    <div className="text-sm text-gray-600">Tools</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-600">4.9</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Your data is secure
                    </h4>
                    <p className="text-sm text-blue-700">
                      We use industry-standard encryption and never store your processed data. 
                      All tools work locally in your browser when possible.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage