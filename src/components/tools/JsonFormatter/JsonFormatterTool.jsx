'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  const [inputJson, setInputJson] = useState('')
  const [outputJson, setOutputJson] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(null)
  const [usageCount, setUsageCount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [indentSize, setIndentSize] = useState(2)

  const FREE_USAGE_LIMIT = 10
  const isPro = false // This would come from user auth context

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

  useEffect(() => {
    // Load usage count from localStorage (in real app, this would be from backend)
    const savedUsage = localStorage.getItem('json-formatter-usage')
    if (savedUsage) {
      setUsageCount(parseInt(savedUsage))
    }
  }, [])

  const updateUsageCount = () => {
    if (!isPro) {
      const newCount = usageCount + 1
      setUsageCount(newCount)
      localStorage.setItem('json-formatter-usage', newCount.toString())
    }
  }

  const formatJson = (pretty = true) => {
    if (!isPro && usageCount >= FREE_USAGE_LIMIT) {
      setError('Free usage limit reached. Upgrade to Pro for unlimited formatting.')
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
      updateUsageCount()
      
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

    if (!isPro && usageCount >= FREE_USAGE_LIMIT) {
      setError('Free usage limit reached. Upgrade to Pro for file uploads.')
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

  const getUsageColor = () => {
    const percentage = (usageCount / FREE_USAGE_LIMIT) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-orange-600'
    return 'text-green-600'
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
            
            {/* Usage Counter for Free Users */}
            {!isPro && (
              <div className="inline-flex items-center bg-slate-100 rounded-lg px-4 py-2 mb-4">
                <Info className="w-4 h-4 mr-2 text-slate-500" />
                <span className="text-sm text-slate-600">
                  Usage: <span className={getUsageColor()}>{usageCount}/{FREE_USAGE_LIMIT}</span> operations today
                </span>
              </div>
            )}
          </div>

          {!isPro && (
            <Link
              href="/pricing"
              className="btn btn-pro"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Link>
          )}
        </div>

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
                disabled={isProcessing || (!isPro && usageCount >= FREE_USAGE_LIMIT)}
                className="btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isProcessing || (!isPro && usageCount >= FREE_USAGE_LIMIT)}
                className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
        {!isPro && (
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
                  className="btn btn-primary"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade to Pro - $9/month
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