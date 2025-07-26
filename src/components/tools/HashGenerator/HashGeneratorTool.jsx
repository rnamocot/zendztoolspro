'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  Copy, 
  Upload, 
  Hash, 
  Crown,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Download,
  Zap,
  Info,
  FileText,
  Shield,
  Lock
} from 'lucide-react'
import CryptoJS from 'crypto-js'

const HashGeneratorTool = () => {
  // Real auth integration
  const { 
    user, 
    isSignedIn,
    updateUsage, 
    canUseTool, 
    getRemainingUsage 
  } = useAuth()

  const [inputText, setInputText] = useState('')
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  })
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('md5')
  const [copySuccess, setCopySuccess] = useState('')
  const [fileName, setFileName] = useState('')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Tool configuration
  const TOOL_ID = 'hash-generator'
  const FREE_USAGE_LIMIT = 15

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 2
  const isAtLimit = !canUse && isSignedIn

  const algorithms = [
    { id: 'md5', name: 'MD5', description: '128-bit hash', free: true },
    { id: 'sha1', name: 'SHA-1', description: '160-bit hash', free: true },
    { id: 'sha256', name: 'SHA-256', description: '256-bit hash', free: false },
    { id: 'sha512', name: 'SHA-512', description: '512-bit hash', free: false },
  ]

  useEffect(() => {
    // Generate initial hashes with sample text
    const sampleText = 'Hello, World!'
    setInputText(sampleText)
    generateHashes(sampleText)
  }, [])


  const generateHashes = (text) => {
    // Check if user can use this tool
    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    if (!text) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' })
      return
    }

    const newHashes = {
      md5: CryptoJS.MD5(text).toString(),
      sha1: CryptoJS.SHA1(text).toString(),
      sha256: user?.isPro ? CryptoJS.SHA256(text).toString() : '',
      sha512: user?.isPro ? CryptoJS.SHA512(text).toString() : ''
    }

    setHashes(newHashes)
    
    // Update usage count (this will work for both signed in and anonymous users)
    updateUsage(TOOL_ID)
  }

  const handleTextChange = (e) => {
    const text = e.target.value
    setInputText(text)
    generateHashes(text)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      setInputText(text)
      generateHashes(text)
    }
    reader.readAsText(file)
  }

  const copyToClipboard = (text, algorithm) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(algorithm)
    setTimeout(() => setCopySuccess(''), 2000)
  }

  const clearAll = () => {
    setInputText('')
    setHashes({ md5: '', sha1: '', sha256: '', sha512: '' })
    setFileName('')
  }

  const downloadHashes = () => {
    const content = Object.entries(hashes)
      .filter(([_, hash]) => hash)
      .map(([algorithm, hash]) => `${algorithm.toUpperCase()}: ${hash}`)
      .join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hashes.txt'
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
            Unlimited hashing • Pro Plan
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
          </span> operations today
          {isNearLimit && (
            <span className="ml-2 text-orange-600">• Almost at limit!</span>
          )}
        </span>
      </div>
    )
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
              Hash Generator
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Generate secure hashes from text and files using MD5, SHA-1, SHA-256, and SHA-512 algorithms.
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
                  You've used all {FREE_USAGE_LIMIT} operations for today. Upgrade to Pro for unlimited usage.
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
                  ? `You've used all ${FREE_USAGE_LIMIT} operations for today.`
                  : `Sign up to get ${FREE_USAGE_LIMIT} daily operations, or upgrade to Pro for unlimited usage.`
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

        {/* Algorithm Selector */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Hash Algorithms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {algorithms.map((algorithm) => (
              <div
                key={algorithm.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  !algorithm.free && !user?.isPro
                    ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                    : selectedAlgorithm === algorithm.id
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => algorithm.free || user?.isPro ? setSelectedAlgorithm(algorithm.id) : null}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-slate-900">{algorithm.name}</div>
                  {!algorithm.free && !user?.isPro && (
                    <Crown className="w-4 h-4 text-purple-500" />
                  )}
                </div>
                <div className="text-sm text-slate-600">{algorithm.description}</div>
                {!algorithm.free && !user?.isPro && (
                  <div className="text-xs text-purple-600 mt-1">Pro only</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Input</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearAll}
                    className="text-sm text-slate-600 hover:text-slate-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={handleTextChange}
                placeholder="Enter text to generate hash..."
                className="w-full h-48 p-4 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />

              {/* File Upload */}
              <div className="mt-4">
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors inline-flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Text File
                  <input
                    type="file"
                    accept=".txt,.json,.xml,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isAtLimit}
                  />
                </label>
                {fileName && (
                  <div className="mt-2 text-sm text-slate-600 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {fileName}
                  </div>
                )}
              </div>

              {isAtLimit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm text-red-800">
                    Free usage limit reached. <Link href="/pricing" className="underline">Upgrade to Pro</Link> for unlimited hashing.
                  </div>
                </div>
              )}
            </div>

            {/* Hash Information */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Hash Security Info</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <span className="font-medium">MD5:</span> Fast but not cryptographically secure. Good for checksums.
                </div>
                <div>
                  <span className="font-medium">SHA-1:</span> Better than MD5 but deprecated for security use.
                </div>
                <div>
                  <span className="font-medium">SHA-256:</span> Secure and widely used. Recommended for most applications.
                </div>
                <div>
                  <span className="font-medium">SHA-512:</span> Most secure option with longer hash output.
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Generated Hashes</h3>
                {Object.values(hashes).some(hash => hash) && (
                  <button
                    onClick={downloadHashes}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {algorithms.map((algorithm) => {
                  const hash = hashes[algorithm.id]
                  const isAvailable = algorithm.free || user?.isPro
                  
                  return (
                    <div key={algorithm.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-medium text-slate-900 flex items-center">
                          {algorithm.name}
                          {!algorithm.free && (
                            <Crown className="w-4 h-4 text-purple-500 ml-2" />
                          )}
                        </label>
                        {hash && (
                          <button
                            onClick={() => copyToClipboard(hash, algorithm.id)}
                            className="btn btn-outline btn-sm"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            {copySuccess === algorithm.id ? 'Copied!' : 'Copy'}
                          </button>
                        )}
                      </div>
                      
                      <div className={`relative ${!isAvailable ? 'opacity-50' : ''}`}>
                        <input
                          type="text"
                          value={isAvailable ? hash : (hash ? '••••••••••••••••••••••••••••••••' : '')}
                          readOnly
                          placeholder={isAvailable ? `${algorithm.name} hash will appear here...` : 'Upgrade to Pro to unlock'}
                          className="w-full p-3 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50"
                        />
                        
                        {!isAvailable && hash && (
                          <div className="absolute inset-0 bg-slate-100 bg-opacity-75 flex items-center justify-center rounded-lg">
                            <Link
                              href="/pricing"
                              className="btn btn-pro btn-sm"
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Upgrade to View
                            </Link>
                          </div>
                        )}
                      </div>
                      
                      {hash && isAvailable && (
                        <div className="text-xs text-slate-500">
                          Length: {hash.length} characters
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

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
                      Get access to SHA-256, SHA-512, file hashing, unlimited operations, and HMAC generation.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        SHA-256 & SHA-512 algorithms
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        File hashing (any file type)
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        HMAC generation
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited operations
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
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Common Use Cases</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">File Integrity</h4>
              <p className="text-slate-600 text-sm">
                Verify file integrity by comparing hash values before and after transfer.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Password Storage</h4>
              <p className="text-slate-600 text-sm">
                Hash passwords before storing them in databases (use SHA-256 or better).
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Data Verification</h4>
              <p className="text-slate-600 text-sm">
                Create unique fingerprints for data to detect changes or tampering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HashGeneratorTool