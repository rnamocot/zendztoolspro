'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Copy, 
  Upload, 
  Hash, 
  Crown,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Download,
  Zap,
  Info,
  FileText,
  Shield
} from 'lucide-react'
import CryptoJS from 'crypto-js'

const HashGeneratorTool = () => {
  const [inputText, setInputText] = useState('')
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  })
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('md5')
  const [copySuccess, setCopySuccess] = useState('')
  const [usageCount, setUsageCount] = useState(0)
  const [fileName, setFileName] = useState('')

  const FREE_USAGE_LIMIT = 15
  const isPro = false // This would come from user auth context

  const algorithms = [
    { id: 'md5', name: 'MD5', description: '128-bit hash', free: true },
    { id: 'sha1', name: 'SHA-1', description: '160-bit hash', free: true },
    { id: 'sha256', name: 'SHA-256', description: '256-bit hash', free: false },
    { id: 'sha512', name: 'SHA-512', description: '512-bit hash', free: false },
  ]

  useEffect(() => {
    // Load usage count from localStorage
    const savedUsage = localStorage.getItem('hash-generator-usage')
    if (savedUsage) {
      setUsageCount(parseInt(savedUsage))
    }
    
    // Generate initial hashes with sample text
    const sampleText = 'Hello, World!'
    setInputText(sampleText)
    generateHashes(sampleText)
  }, [])

  const updateUsageCount = () => {
    if (!isPro) {
      const newCount = usageCount + 1
      setUsageCount(newCount)
      localStorage.setItem('hash-generator-usage', newCount.toString())
    }
  }

  const generateHashes = (text) => {
    if (!isPro && usageCount >= FREE_USAGE_LIMIT) {
      return
    }

    if (!text) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' })
      return
    }

    const newHashes = {
      md5: CryptoJS.MD5(text).toString(),
      sha1: CryptoJS.SHA1(text).toString(),
      sha256: isPro ? CryptoJS.SHA256(text).toString() : '',
      sha512: isPro ? CryptoJS.SHA512(text).toString() : ''
    }

    setHashes(newHashes)
    updateUsageCount()
  }

  const handleTextChange = (e) => {
    const text = e.target.value
    setInputText(text)
    generateHashes(text)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!isPro && usageCount >= FREE_USAGE_LIMIT) {
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

  const getUsageColor = () => {
    const percentage = (usageCount / FREE_USAGE_LIMIT) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-orange-600'
    return 'text-green-600'
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

        {/* Algorithm Selector */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Hash Algorithms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {algorithms.map((algorithm) => (
              <div
                key={algorithm.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  !algorithm.free && !isPro
                    ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                    : selectedAlgorithm === algorithm.id
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => algorithm.free || isPro ? setSelectedAlgorithm(algorithm.id) : null}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-slate-900">{algorithm.name}</div>
                  {!algorithm.free && !isPro && (
                    <Crown className="w-4 h-4 text-purple-500" />
                  )}
                </div>
                <div className="text-sm text-slate-600">{algorithm.description}</div>
                {!algorithm.free && !isPro && (
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
                    disabled={!isPro && usageCount >= FREE_USAGE_LIMIT}
                  />
                </label>
                {fileName && (
                  <div className="mt-2 text-sm text-slate-600 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {fileName}
                  </div>
                )}
              </div>

              {(!isPro && usageCount >= FREE_USAGE_LIMIT) && (
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
                  const isAvailable = algorithm.free || isPro
                  
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
            {!isPro && (
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