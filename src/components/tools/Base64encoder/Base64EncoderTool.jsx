'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Copy, 
  Upload, 
  Download, 
  RotateCcw,
  Crown,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Zap,
  Info,
  FileText,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react'

const Base64EncoderTool = () => {
  const [mode, setMode] = useState('encode') // 'encode' or 'decode'
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [fileName, setFileName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const FREE_USAGE_LIMIT = 25
  const isPro = false // This would come from user auth context

  // Sample data for demonstration
  const sampleData = {
    encode: 'Hello, World! This is a sample text for Base64 encoding.',
    decode: 'SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4='
  }

  useEffect(() => {
    // Load usage count from localStorage
    const savedUsage = localStorage.getItem('base64-encoder-usage')
    if (savedUsage) {
      setUsageCount(parseInt(savedUsage))
    }
    
    // Load sample data
    setInputText(sampleData[mode])
    processText(sampleData[mode])
  }, [])

  useEffect(() => {
    // Clear output when mode changes
    setInputText(sampleData[mode])
    processText(sampleData[mode])
    setError('')
  }, [mode])

  const updateUsageCount = () => {
    if (!isPro) {
      const newCount = usageCount + 1
      setUsageCount(newCount)
      localStorage.setItem('base64-encoder-usage', newCount.toString())
    }
  }

  const processText = (text) => {
    if (!isPro && usageCount >= FREE_USAGE_LIMIT) {
      setError('Free usage limit reached. Upgrade to Pro for unlimited encoding/decoding.')
      return
    }

    if (!text.trim()) {
      setOutputText('')
      setError('')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      let result = ''
      
      if (mode === 'encode') {
        // Encode to Base64
        result = btoa(unescape(encodeURIComponent(text)))
      } else {
        // Decode from Base64
        try {
          result = decodeURIComponent(escape(atob(text)))
        } catch (e) {
          throw new Error('Invalid Base64 input')
        }
      }
      
      setOutputText(result)
      updateUsageCount()
      
      setTimeout(() => setIsProcessing(false), 200)
    } catch (err) {
      setError(err.message)
      setOutputText('')
      setIsProcessing(false)
    }
  }

  const handleTextChange = (e) => {
    const text = e.target.value
    setInputText(text)
    processText(text)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!isPro) {
      setError('File upload is a Pro feature. Upgrade to process files.')
      return
    }

    if (!isPro && usageCount >= FREE_USAGE_LIMIT) {
      setError('Free usage limit reached. Upgrade to Pro for unlimited operations.')
      return
    }

    setFileName(file.name)
    
    if (mode === 'encode') {
      // For encoding, read file as binary
      const reader = new FileReader()
      reader.onload = (e) => {
        const arrayBuffer = e.target.result
        const bytes = new Uint8Array(arrayBuffer)
        const binaryString = Array.from(bytes, byte => String.fromCharCode(byte)).join('')
        const base64 = btoa(binaryString)
        setInputText(`[File: ${file.name}]`)
        setOutputText(base64)
        updateUsageCount()
      }
      reader.readAsArrayBuffer(file)
    } else {
      // For decoding, read as text
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target.result
        setInputText(text)
        processText(text)
      }
      reader.readAsText(file)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadResult = () => {
    if (!outputText) {
      setError('No output to download')
      return
    }

    const blob = new Blob([outputText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
    setError('')
    setFileName('')
  }

  const loadSample = () => {
    setInputText(sampleData[mode])
    processText(sampleData[mode])
  }

  const swapInputOutput = () => {
    if (outputText) {
      setInputText(outputText)
      setMode(mode === 'encode' ? 'decode' : 'encode')
    }
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
              Base64 Encoder & Decoder
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Encode text to Base64 or decode Base64 back to text. Perfect for data transmission and storage.
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

        {/* Mode Selector */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Operation Mode</h3>
            {outputText && (
              <button
                onClick={swapInputOutput}
                className="btn btn-outline btn-sm"
                title="Swap input/output and change mode"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Swap & Convert
              </button>
            )}
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setMode('encode')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                mode === 'encode'
                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold mb-1">Encode to Base64</div>
              <div className="text-sm text-slate-600">Convert text/files to Base64 format</div>
            </button>
            
            <button
              onClick={() => setMode('decode')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                mode === 'decode'
                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold mb-1">Decode from Base64</div>
              <div className="text-sm text-slate-600">Convert Base64 back to text</div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                </h3>
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

              <textarea
                value={inputText}
                onChange={handleTextChange}
                placeholder={
                  mode === 'encode' 
                    ? 'Enter text to encode to Base64...' 
                    : 'Enter Base64 string to decode...'
                }
                className="w-full h-64 p-4 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />

              {/* File Upload */}
              <div className="mt-4 flex items-center justify-between">
                <label className={`cursor-pointer border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium transition-colors inline-flex items-center ${
                  isPro 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                    : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                }`}>
                  <Upload className="w-4 h-4 mr-2" />
                  {mode === 'encode' ? 'Upload File to Encode' : 'Upload Base64 File'}
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={!isPro}
                  />
                </label>
                
                {!isPro && (
                  <span className="text-xs text-purple-600 flex items-center">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro feature
                  </span>
                )}
              </div>

              {fileName && (
                <div className="mt-2 text-sm text-slate-600 flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {fileName}
                </div>
              )}

              {/* Process Button */}
              <button
                onClick={() => processText(inputText)}
                disabled={isProcessing || (!isPro && usageCount >= FREE_USAGE_LIMIT)}
                className="btn btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4 mr-2" />
                )}
                {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
              </button>

              {(!isPro && usageCount >= FREE_USAGE_LIMIT) && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm text-red-800">
                    Free usage limit reached. <Link href="/pricing" className="underline">Upgrade to Pro</Link> for unlimited operations.
                  </div>
                </div>
              )}
            </div>

            {/* Base64 Information */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Info className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">About Base64</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  Base64 is a binary-to-text encoding scheme that represents binary data in ASCII format.
                </p>
                <p>
                  <span className="font-medium">Common uses:</span> Email attachments, data URLs, API tokens, 
                  storing binary data in JSON/XML, and web development.
                </p>
                <p>
                  <span className="font-medium">Note:</span> Base64 increases data size by ~33% but ensures 
                  safe transmission over text-based protocols.
                </p>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                </h3>
                {outputText && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(outputText)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadResult}
                      className="btn btn-outline btn-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                )}
              </div>

              <textarea
                value={outputText}
                readOnly
                placeholder={
                  mode === 'encode' 
                    ? 'Base64 encoded output will appear here...' 
                    : 'Decoded text will appear here...'
                }
                className="w-full h-64 p-4 border border-slate-300 rounded-lg font-mono text-sm resize-none bg-slate-50"
              />

              {/* Output Stats */}
              {outputText && (
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500">Input Length</div>
                    <div className="font-semibold">{inputText.replace('[File: ', '').replace(']', '') === inputText ? inputText.length : 'File'} chars</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Output Length</div>
                    <div className="font-semibold">{outputText.length} chars</div>
                  </div>
                </div>
              )}
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
                      Get unlimited encoding/decoding, file uploads, batch processing, and advanced format support.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited operations
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        File upload support
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Batch processing
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Multiple formats
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

            {/* Examples */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Common Examples</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-slate-900 mb-1">Text to Base64:</div>
                  <div className="font-mono bg-slate-50 p-2 rounded text-slate-600 mb-1">
                    "Hello World" → "SGVsbG8gV29ybGQ="
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-900 mb-1">Data URL (image):</div>
                  <div className="font-mono bg-slate-50 p-2 rounded text-slate-600 text-xs">
                    data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-900 mb-1">API Authentication:</div>
                  <div className="font-mono bg-slate-50 p-2 rounded text-slate-600 text-xs">
                    Basic dXNlcm5hbWU6cGFzc3dvcmQ=
                  </div>
                </div>
              </div>
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

        {/* Use Cases */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">When to Use Base64</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Data URLs</h4>
              <p className="text-slate-600 text-sm">
                Embed small images, fonts, or files directly in HTML/CSS using data: URLs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">API Integration</h4>
              <p className="text-slate-600 text-sm">
                Send binary data through JSON APIs or encode credentials for HTTP Basic Auth.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Email Attachments</h4>
              <p className="text-slate-600 text-sm">
                MIME encoding for email attachments and ensuring safe text transmission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Base64EncoderTool