'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  Copy, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Shield, 
  Crown,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Download,
  Zap,
  Info,
  Plus,
  Trash2,
  Lock
} from 'lucide-react'

const PasswordGeneratorTool = () => {
  // Real auth integration
  const { 
    user, 
    isSignedIn,
    updateUsage, 
    canUseTool, 
    getRemainingUsage 
  } = useAuth()

  const [password, setPassword] = useState('')
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [customSymbols, setCustomSymbols] = useState('!@#$%^&*()_+-=[]{}|;:,.<>?')
  const [showPassword, setShowPassword] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const [strength, setStrength] = useState({ score: 0, label: '', color: '' })
  const [generatedPasswords, setGeneratedPasswords] = useState([])
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Tool configuration
  const TOOL_ID = 'password-generator'
  const FREE_USAGE_LIMIT = 20

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 2
  const isAtLimit = !canUse && isSignedIn

  useEffect(() => {
    // Generate initial password
    generatePassword()
  }, [])

  useEffect(() => {
    if (password) {
      calculateStrength(password)
    }
  }, [password])


  const calculateStrength = (pwd) => {
    let score = 0
    let feedback = []

    // Length check
    if (pwd.length >= 12) score += 25
    else if (pwd.length >= 8) score += 10
    else feedback.push('Use at least 8 characters')

    // Character variety
    if (/[a-z]/.test(pwd)) score += 15
    else feedback.push('Include lowercase letters')

    if (/[A-Z]/.test(pwd)) score += 15
    else feedback.push('Include uppercase letters')

    if (/[0-9]/.test(pwd)) score += 15
    else feedback.push('Include numbers')

    if (/[^A-Za-z0-9]/.test(pwd)) score += 20
    else feedback.push('Include symbols')

    // No repeated characters
    if (!/(.)\1{2,}/.test(pwd)) score += 10
    else feedback.push('Avoid repeated characters')

    let label, color
    if (score >= 80) {
      label = 'Very Strong'
      color = 'text-green-600'
    } else if (score >= 60) {
      label = 'Strong'
      color = 'text-blue-600'
    } else if (score >= 40) {
      label = 'Medium'
      color = 'text-orange-600'
    } else {
      label = 'Weak'
      color = 'text-red-600'
    }

    setStrength({ score, label, color, feedback })
  }

  const generatePassword = () => {
    // Check if user can use this tool
    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    let charset = ''
    
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += customSymbols

    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '')
    }

    if (!charset) {
      setPassword('')
      return
    }

    let result = ''
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setPassword(result)
    
    // Update usage count (this will work for both signed in and anonymous users)
    updateUsage(TOOL_ID)
  }

  const generateBulkPasswords = (count) => {
    if (!user?.isPro) return

    const passwords = []
    for (let i = 0; i < count; i++) {
      let charset = ''
      
      if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
      if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (includeNumbers) charset += '0123456789'
      if (includeSymbols) charset += customSymbols

      if (excludeSimilar) {
        charset = charset.replace(/[il1Lo0O]/g, '')
      }

      let result = ''
      for (let j = 0; j < length; j++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length))
      }
      passwords.push(result)
    }

    setGeneratedPasswords(passwords)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadPasswords = () => {
    const allPasswords = [password, ...generatedPasswords].filter(Boolean)
    const content = allPasswords.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'passwords.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const renderUsageStatus = () => {
    if (!isSignedIn) {
      return (
        <div className="inline-flex items-center bg-blue-100 rounded-lg px-4 py-2">
          <Info className="w-4 h-4 mr-2 text-blue-600" />
          <span className="text-sm text-blue-800">
            Try it out • <Link href="/auth/signup" className="underline">Sign up</Link> for daily limits
          </span>
        </div>
      )
    }

    if (user?.isPro) {
      return (
        <div className="inline-flex items-center bg-green-100 rounded-lg px-4 py-2">
          <Crown className="w-4 h-4 mr-2 text-green-600" />
          <span className="text-sm text-green-800 font-medium">
            Unlimited passwords • Pro Plan
          </span>
        </div>
      )
    }

    return (
      <div className={`inline-flex items-center rounded-lg px-4 py-2 ${
        isNearLimit ? 'bg-orange-100' : 'bg-slate-100'
      }`}>
        <Info className={`w-4 h-4 mr-2 ${isNearLimit ? 'text-orange-500' : 'text-slate-500'}`} />
        <span className={`text-sm ${isNearLimit ? 'text-orange-800' : 'text-slate-600'}`}>
          Usage: <span className={isNearLimit ? 'text-orange-600 font-bold' : 'text-slate-900 font-medium'}>
            {currentUsage}/{FREE_USAGE_LIMIT}
          </span> passwords today
          {isNearLimit && (
            <span className="ml-2 text-orange-600">• Almost at limit!</span>
          )}
        </span>
      </div>
    )
  }

  const presets = [
    { name: 'Basic', length: 8, upper: true, lower: true, numbers: true, symbols: false },
    { name: 'Strong', length: 12, upper: true, lower: true, numbers: true, symbols: true },
    { name: 'Ultra Secure', length: 16, upper: true, lower: true, numbers: true, symbols: true },
    { name: 'Numbers Only', length: 6, upper: false, lower: false, numbers: true, symbols: false },
  ]

  const applyPreset = (preset) => {
    setLength(preset.length)
    setIncludeUppercase(preset.upper)
    setIncludeLowercase(preset.lower)
    setIncludeNumbers(preset.numbers)
    setIncludeSymbols(preset.symbols)
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/tools"
            className="flex items-center text-slate-600 hover:text-sky-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tools
          </Link>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="heading-2 text-slate-900 mb-4">
              Password Generator
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Generate secure, random passwords with customizable options. Perfect for creating strong passwords for your accounts.
            </p>
            
            {/* Usage Counter */}
            <div className="mb-4">
              {renderUsageStatus()}
            </div>
          </div>

          {!user?.isPro && (
            <Link
              href="/pricing"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Link>
          )}
        </div>

        {/* At Limit Warning */}
        {isAtLimit && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold mb-2">Daily Limit Reached</h3>
                <p className="text-red-700 mb-4">
                  You've used all {FREE_USAGE_LIMIT} passwords for today. Upgrade to Pro for unlimited usage.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/pricing" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro - $1.50/month
                  </Link>
                  <Link href="/dashboard" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    View Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Prompt Modal */}
        {showUpgradePrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Daily Limit Reached</h3>
              <p className="text-slate-600 mb-4">
                {isSignedIn 
                  ? `You've used all ${FREE_USAGE_LIMIT} passwords for today.`
                  : `Sign up to get ${FREE_USAGE_LIMIT} daily passwords, or upgrade to Pro for unlimited usage.`
                }
              </p>
              <div className="flex flex-col gap-3">
                {!isSignedIn && (
                  <Link href="/auth/signup" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    Sign Up for Free
                  </Link>
                )}
                <Link href="/pricing" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Link>
                <button 
                  onClick={() => setShowUpgradePrompt(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Password Settings</h3>
              
              {/* Length */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Length: {length} characters
                </label>
                <input
                  type="range"
                  min="4"
                  max="128"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>4</span>
                  <span>128</span>
                </div>
              </div>

              {/* Character Options */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-3 text-sm text-slate-700">Uppercase (A-Z)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-3 text-sm text-slate-700">Lowercase (a-z)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-3 text-sm text-slate-700">Numbers (0-9)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-3 text-sm text-slate-700">Symbols (!@#$%...)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-3 text-sm text-slate-700">Exclude similar (il1Lo0O)</span>
                </label>
              </div>

              {/* Custom Symbols */}
              {includeSymbols && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Custom Symbols
                  </label>
                  <input
                    type="text"
                    value={customSymbols}
                    onChange={(e) => setCustomSymbols(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
                    placeholder="!@#$%^&*()_+-="
                  />
                </div>
              )}

              {/* Presets */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quick Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generatePassword}
                disabled={isAtLimit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {isAtLimit ? 'Daily Limit Reached' : 'Generate Password'}
              </button>
              
              {isAtLimit && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  <Link href="/pricing" className="underline">Upgrade to Pro</Link> for unlimited usage
                </p>
              )}
            </div>

            {/* Pro Features */}
            {user?.isPro && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Bulk Generation</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => generateBulkPasswords(5)}
                    className="btn btn-secondary w-full btn-sm"
                  >
                    Generate 5 Passwords
                  </button>
                  <button
                    onClick={() => generateBulkPasswords(10)}
                    className="btn btn-secondary w-full btn-sm"
                  >
                    Generate 10 Passwords
                  </button>
                  <button
                    onClick={() => generateBulkPasswords(25)}
                    className="btn btn-secondary w-full btn-sm"
                  >
                    Generate 25 Passwords
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generated Password */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Generated Password</h3>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-600 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  value={showPassword ? password : '•'.repeat(password.length)}
                  readOnly
                  className="w-full p-4 border border-slate-300 rounded-lg font-mono text-lg bg-slate-50"
                />
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                  <button
                    onClick={() => copyToClipboard(password)}
                    className="bg-white hover:bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors"
                  >
                    <Copy className="w-4 h-4 inline mr-2" />
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Strength Meter */}
              {password && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Password Strength</span>
                    <span className={`text-sm font-semibold ${strength.color}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        strength.score >= 80 ? 'bg-green-500' :
                        strength.score >= 60 ? 'bg-blue-500' :
                        strength.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${strength.score}%` }}
                    ></div>
                  </div>
                  {strength.feedback && strength.feedback.length > 0 && (
                    <div className="mt-2 text-xs text-slate-600">
                      Suggestions: {strength.feedback.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Password Analysis */}
              {password && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500">Length</div>
                    <div className="font-semibold">{password.length} chars</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Entropy</div>
                    <div className="font-semibold">~{Math.round(password.length * Math.log2(85))} bits</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Crack Time</div>
                    <div className="font-semibold">
                      {strength.score >= 80 ? 'Centuries' :
                       strength.score >= 60 ? 'Years' :
                       strength.score >= 40 ? 'Days' : 'Hours'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Score</div>
                    <div className="font-semibold">{strength.score}/100</div>
                  </div>
                </div>
              )}
            </div>

            {/* Bulk Passwords (Pro Feature) */}
            {generatedPasswords.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Bulk Generated Passwords ({generatedPasswords.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={downloadPasswords}
                      className="btn btn-secondary btn-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => setGeneratedPasswords([])}
                      className="btn btn-outline btn-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {generatedPasswords.map((pwd, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <code className="font-mono text-sm text-slate-700 flex-1 mr-4">
                        {showPassword ? pwd : '•'.repeat(pwd.length)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(pwd)}
                        className="text-slate-600 hover:text-slate-700 p-1"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro Features Callout */}
            {!user?.isPro && (
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Unlock Pro Features
                    </h3>
                    <div className="text-slate-600 mb-4">
                      Get unlimited password generation, bulk creation, custom patterns, and advanced security features.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited generations
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Bulk password creation
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Pronounceable passwords
                      </div>
                    </div>
                    <Link
                      href="/pricing"
                      className="btn btn-primary"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade to Pro - $9/month
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tips */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Password Security Tips</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Do's</h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Use at least 12 characters</li>
                    <li>• Include uppercase, lowercase, numbers, and symbols</li>
                    <li>• Use a unique password for each account</li>
                    <li>• Store passwords in a password manager</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Don'ts</h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Don't use personal information</li>
                    <li>• Don't reuse passwords across sites</li>
                    <li>• Don't share passwords via email or text</li>
                    <li>• Don't write passwords on sticky notes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordGeneratorTool