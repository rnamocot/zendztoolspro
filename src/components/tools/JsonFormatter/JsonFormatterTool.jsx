'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  Copy, 
  Download, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Zap,
  RotateCcw,
  Minimize2,
  Maximize2,
  Crown,
  ArrowLeft,
  Info
} from 'lucide-react'

const JsonFormatterTool = () => {
  // Real auth integration
  const { 
    user, 
    isSignedIn,
    updateUsage, 
    canUseTool, 
    getRemainingUsage 
  } = useAuth()

  const [inputJson, setInputJson] = useState('')
  const [outputJson, setOutputJson] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [indentSize, setIndentSize] = useState(2)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Tool configuration
  const TOOL_ID = 'json-formatter'
  const FREE_USAGE_LIMIT = 20

  // Sample JSON for demo
  const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "coding", "gaming"]
}`

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 3
  const isAtLimit = !canUse && isSignedIn

  const formatJson = (pretty = true) => {
    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    if (!inputJson.trim()) {
      setError('Please enter some JSON to format')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const parsed = JSON.parse(inputJson)
      const formatted = pretty 
        ? JSON.stringify(parsed, null, indentSize)
        : JSON.stringify(parsed)
      
      setOutputJson(formatted)
      setIsValid(true)
      
      // Update usage count
      updateUsage(TOOL_ID)
      
      setTimeout(() => setIsProcessing(false), 300)
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`)
      setIsValid(false)
      setIsProcessing(false)
    }
  }

  const validateJson = () => {
    if (!inputJson.trim()) {
      setError('Please enter some JSON to validate')
      return
    }

    try {
      JSON.parse(inputJson)
      setError('')
      setIsValid(true)
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`)
      setIsValid(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadJson = () => {
    if (!outputJson) {
      setError('No formatted JSON to download')
      return
    }

    const blob = new Blob([outputJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!user?.isPro && file.size > 100000) { // 100KB limit for free users
      setError('File too large. Free users can upload files up to 100KB. Upgrade to Pro for larger files.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setInputJson(e.target.result)
      setError('')
    }
    reader.readAsText(file)
  }

  const clearAll = () => {
    setInputJson('')
    setOutputJson('')
    setError('')
    setIsValid(null)
  }

  const loadSample = () => {
    setInputJson(sampleJson)
    setError('')
    setIsValid(null)
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
            Unlimited formatting • Schema validation • Pro Plan
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
      {/* Header */}
      <div className="container-custom py-8">
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
              JSON Formatter & Validator
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Format, validate, and minify JSON data with syntax highlighting and error detection.
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
              <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold mb-2">Daily Limit Reached</h3>
                <p className="text-red-700 mb-4">
                  You've used all {FREE_USAGE_LIMIT} JSON formatting operations for today. Upgrade to Pro for unlimited usage and advanced features.
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
              <h3 className="text-lg font-semibold mb-4">Upgrade Required</h3>
              <p className="text-slate-600 mb-4">
                {isSignedIn 
                  ? `You've reached the daily limit of ${FREE_USAGE_LIMIT} JSON formatting operations.`
                  : `Sign up to get ${FREE_USAGE_LIMIT} daily JSON formatting operations, or upgrade to Pro for unlimited usage.`
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

        {/* Features Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
            <div className="font-medium text-slate-900">Validate JSON</div>
            <div className="text-sm text-slate-600">Check syntax errors</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <Maximize2 className="w-6 h-6 text-blue-500 mb-2" />
            <div className="font-medium text-slate-900">Format & Beautify</div>
            <div className="text-sm text-slate-600">Pretty print JSON</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <Minimize2 className="w-6 h-6 text-purple-500 mb-2" />
            <div className="font-medium text-slate-900">Minify JSON</div>
            <div className="text-sm text-slate-600">Compress JSON size</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <Upload className="w-6 h-6 text-orange-500 mb-2" />
            <div className="font-medium text-slate-900">File Upload</div>
            <div className="text-sm text-slate-600">Process JSON files</div>
          </div>
        </div>

        {/* Main Tool Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Input JSON</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadSample}
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  Load Sample
                </button>
                <button
                  onClick={clearAll}
                  className="text-sm text-slate-600 hover:text-slate-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                placeholder="Paste your JSON here or upload a file..."
                className="w-full h-96 p-4 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              
              {/* File Upload */}
              <div className="absolute bottom-4 right-4">
                <label className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload File
                  <input
                    type="file"
                    accept=".json,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Indent:</label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(parseInt(e.target.value))}
                  className="border border-slate-300 rounded px-2 py-1 text-sm"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={8}>8 spaces</option>
                </select>
              </div>
              
              <button
                onClick={validateJson}
                className="btn btn-secondary btn-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Validate
              </button>
              
              <button
                onClick={() => formatJson(true)}
                disabled={isProcessing || isAtLimit}
                className="px-3 py-1.5 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Maximize2 className="w-4 h-4 mr-2" />
                )}
                Format
              </button>
              
              <button
                onClick={() => formatJson(false)}
                disabled={isProcessing || isAtLimit}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minimize2 className="w-4 h-4 mr-2" />
                Minify
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Formatted Output</h3>
              <div className="flex items-center gap-2">
                {isValid !== null && (
                  <div className={`flex items-center text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {isValid ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-1" />
                    )}
                    {isValid ? 'Valid JSON' : 'Invalid JSON'}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={outputJson}
                readOnly
                placeholder="Formatted JSON will appear here..."
                className="w-full h-96 p-4 border border-slate-300 rounded-lg font-mono text-sm resize-none bg-slate-50"
              />
              
              {outputJson && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={() => copyToClipboard(outputJson)}
                    className="bg-white hover:bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors"
                  >
                    <Copy className="w-4 h-4 inline mr-2" />
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                  
                  <button
                    onClick={downloadJson}
                    className="bg-white hover:bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Download
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-red-800">Error</div>
              <div className="text-red-700">{error}</div>
              {error.includes('usage limit') && (
                <Link
                  href="/pricing"
                  className="inline-flex items-center text-red-800 hover:text-red-900 font-medium mt-2"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Pro Features Callout */}
        {!user?.isPro && (
          <div className="mt-8 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-6">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Unlock Pro Features
                </h3>
                <div className="text-slate-600 mb-4">
                  Get unlimited formatting, batch processing, API access, and advanced validation features.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Unlimited operations
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Schema validation
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Batch file processing
                  </div>
                </div>
                <Link
                  href="/pricing"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade to Pro - $1.50/month
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* How to Use Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">How to Use the JSON Formatter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Quick Start</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-600">
                <li>Paste your JSON data in the input area</li>
                <li>Click "Format" to beautify or "Minify" to compress</li>
                <li>Copy the formatted output or download as a file</li>
                <li>Use "Validate" to check for syntax errors</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Pro Tips</h4>
              <ul className="space-y-2 text-slate-600">
                <li>• Upload JSON files directly for processing</li>
                <li>• Adjust indent size for your preferred formatting</li>
                <li>• Use validation to debug malformed JSON</li>
                <li>• Pro users get unlimited operations and advanced features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JsonFormatterTool