'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  Copy, 
  Download, 
  Link as LinkIcon,
  Crown,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Zap,
  Info,
  FileText,
  RefreshCw,
  Lock,
  Settings,
  Globe,
  Plus,
  Minus,
  Search,
  Code
} from 'lucide-react'

const CanonicalUrlGeneratorTool = () => {
  // Real auth integration
  const { 
    user, 
    isSignedIn,
    updateUsage, 
    canUseTool, 
    getRemainingUsage 
  } = useAuth()

  const [formData, setFormData] = useState({
    urls: [{ url: '', canonical: '' }],
    autoGenerate: true,
    includeHtml: true,
    includeHttpHeader: false,
    domain: ''
  })

  const [generatedOutput, setGeneratedOutput] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Tool configuration
  const TOOL_ID = 'canonical-url-generator'
  const FREE_USAGE_LIMIT = 15
  const FREE_URL_LIMIT = 5

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 3
  const isAtLimit = !canUse && isSignedIn

  const tabs = [
    { id: 'basic', name: 'URL Management', icon: LinkIcon, proOnly: false },
    { id: 'advanced', name: 'Advanced Options', icon: Settings, proOnly: true }
  ]

  useEffect(() => {
    generateCanonicalTags()
  }, [formData])

  const generateCanonicalTags = () => {
    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    // Check URL limit for free users
    if (!user?.isPro && formData.urls.length > FREE_URL_LIMIT) {
      setShowUpgradePrompt(true)
      return
    }

    let output = []
    const validUrls = formData.urls.filter(item => item.url.trim())

    if (validUrls.length === 0) {
      setGeneratedOutput('')
      return
    }

    if (formData.includeHtml) {
      output.push('<!-- HTML <head> canonical tags -->')
      validUrls.forEach(item => {
        const canonicalUrl = item.canonical || item.url
        const fullCanonicalUrl = normalizeUrl(canonicalUrl)
        output.push(`<link rel="canonical" href="${fullCanonicalUrl}" />`)
      })
      output.push('')
    }

    if (user?.isPro && formData.includeHttpHeader) {
      output.push('<!-- HTTP Header canonical directives -->')
      validUrls.forEach(item => {
        const canonicalUrl = item.canonical || item.url
        const fullCanonicalUrl = normalizeUrl(canonicalUrl)
        output.push(`Link: <${fullCanonicalUrl}>; rel="canonical"`)
      })
      output.push('')
    }

    // Add implementation notes
    output.push('<!-- Implementation Notes -->')
    output.push('<!-- 1. Place canonical tags in the <head> section of your HTML -->')
    output.push('<!-- 2. Use absolute URLs for better compatibility -->')
    output.push('<!-- 3. Ensure canonical URLs are accessible and return 200 status -->')
    output.push('<!-- 4. Self-referencing canonicals are recommended for all pages -->')

    setGeneratedOutput(output.join('\n'))
    
    // Update usage count
    updateUsage(TOOL_ID)
  }

  const normalizeUrl = (url) => {
    if (!url) return ''
    
    // If it already starts with http/https, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    // If we have a domain set, use it
    if (formData.domain) {
      const domain = formData.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
      return `https://${domain}${url.startsWith('/') ? url : '/' + url}`
    }
    
    // If URL starts with /, assume it's a path
    if (url.startsWith('/')) {
      return `https://yourwebsite.com${url}`
    }
    
    // Otherwise, assume it's a full domain
    return `https://${url}`
  }

  const addUrl = () => {
    if (!user?.isPro && formData.urls.length >= FREE_URL_LIMIT) {
      setShowUpgradePrompt(true)
      return
    }

    setFormData(prev => ({
      ...prev,
      urls: [...prev.urls, { url: '', canonical: '' }]
    }))
  }

  const removeUrl = (index) => {
    if (formData.urls.length > 1) {
      setFormData(prev => ({
        ...prev,
        urls: prev.urls.filter((_, i) => i !== index)
      }))
    }
  }

  const updateUrl = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.map((url, i) => 
        i === index ? { ...url, [field]: value } : url
      )
    }))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedOutput)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadCanonical = () => {
    const blob = new Blob([generatedOutput], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'canonical-tags.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    setFormData({
      ...formData,
      urls: [
        { url: 'https://yourwebsite.com/products/widget', canonical: 'https://yourwebsite.com/products/widget' },
        { url: 'https://yourwebsite.com/products/widget?color=red', canonical: 'https://yourwebsite.com/products/widget' },
        { url: 'https://yourwebsite.com/products/widget?color=blue', canonical: 'https://yourwebsite.com/products/widget' },
        { url: 'https://yourwebsite.com/blog/seo-tips', canonical: '' }
      ],
      domain: 'https://yourwebsite.com'
    })
  }

  const clearAll = () => {
    setFormData({
      urls: [{ url: '', canonical: '' }],
      autoGenerate: true,
      includeHtml: true,
      includeHttpHeader: false,
      domain: ''
    })
    setGeneratedOutput('')
  }

  const detectDuplicates = () => {
    if (!user?.isPro) return []
    
    const urlMap = new Map()
    const duplicates = []
    
    formData.urls.forEach((item, index) => {
      if (!item.url.trim()) return
      
      const normalizedUrl = item.url.toLowerCase().replace(/\/+$/, '')
      if (urlMap.has(normalizedUrl)) {
        duplicates.push({ index, url: item.url, originalIndex: urlMap.get(normalizedUrl) })
      } else {
        urlMap.set(normalizedUrl, index)
      }
    })
    
    return duplicates
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
            Unlimited generations • Bulk processing • Pro Plan
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
          </span> generations • <span className="font-medium">{formData.urls.length}/{FREE_URL_LIMIT}</span> URLs
          {isNearLimit && (
            <span className="ml-2 text-orange-600">• Almost at limit!</span>
          )}
        </span>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            {/* Domain Setting */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Default Domain (Optional)
              </label>
              <input
                type="url"
                value={formData.domain}
                onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                placeholder="https://yourwebsite.com"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <div className="text-xs text-slate-500 mt-1">
                Used to convert relative URLs to absolute URLs
              </div>
            </div>

            {/* URL Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-slate-700">
                  URLs and Canonical Mapping {!user?.isPro && (
                    <span className="text-slate-500">({formData.urls.length}/{FREE_URL_LIMIT} max for free)</span>
                  )}
                </label>
                <button
                  onClick={addUrl}
                  className="flex items-center text-sm text-sky-600 hover:text-sky-700 font-medium"
                  disabled={!user?.isPro && formData.urls.length >= FREE_URL_LIMIT}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add URL
                </button>
              </div>

              <div className="space-y-4">
                {formData.urls.map((urlData, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          Page URL *
                        </label>
                        <input
                          type="text"
                          value={urlData.url}
                          onChange={(e) => updateUrl(index, 'url', e.target.value)}
                          placeholder="/page-with-parameters?param=value"
                          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <div className="flex-1 mr-2">
                          <label className="block text-sm font-medium text-slate-600 mb-1">
                            Canonical URL (leave empty for self-reference)
                          </label>
                          <input
                            type="text"
                            value={urlData.canonical}
                            onChange={(e) => updateUrl(index, 'canonical', e.target.value)}
                            placeholder="/canonical-version"
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                          />
                        </div>
                        
                        {formData.urls.length > 1 && (
                          <button
                            onClick={() => removeUrl(index)}
                            className="text-red-500 hover:text-red-700 p-2 mb-1"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Options */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Output Format
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeHtml}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeHtml: e.target.checked }))}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Generate HTML &lt;link&gt; tags</span>
                </label>
                
                {user?.isPro && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.includeHttpHeader}
                      onChange={(e) => setFormData(prev => ({ ...prev, includeHttpHeader: e.target.checked }))}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">Generate HTTP Header directives (Pro)</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        )

      case 'advanced':
        if (!user?.isPro) {
          return (
            <div className="text-center p-8">
              <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Pro Feature</h3>
              <p className="text-slate-600 mb-4">
                Advanced canonical URL features including validation, bulk processing, and duplicate detection are available with Pro subscription.
              </p>
              <Link href="/pricing" className="btn btn-primary">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Link>
            </div>
          )
        }

        const duplicates = detectDuplicates()

        return (
          <div className="space-y-6">
            {/* Duplicate Detection */}
            <div>
              <h4 className="font-medium text-slate-700 mb-3">Duplicate URL Detection</h4>
              {duplicates.length > 0 ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="font-medium text-orange-800">Found {duplicates.length} duplicate URLs</span>
                  </div>
                  <div className="space-y-1 text-sm text-orange-700">
                    {duplicates.map((dup, i) => (
                      <div key={i}>• URL #{dup.index + 1}: {dup.url}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-green-800">No duplicate URLs detected</span>
                  </div>
                </div>
              )}
            </div>

            {/* URL Validation */}
            <div>
              <h4 className="font-medium text-slate-700 mb-3">URL Validation</h4>
              <div className="space-y-2">
                {formData.urls.map((urlData, index) => {
                  if (!urlData.url.trim()) return null
                  
                  const isValidUrl = urlData.url.startsWith('http') || urlData.url.startsWith('/')
                  const canonicalUrl = urlData.canonical || urlData.url
                  const isValidCanonical = canonicalUrl.startsWith('http') || canonicalUrl.startsWith('/')
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="text-sm">
                        <span className="font-medium">URL #{index + 1}:</span> {urlData.url}
                      </div>
                      <div className="flex items-center space-x-2">
                        {isValidUrl ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        )}
                        {urlData.canonical && (
                          isValidCanonical ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          )
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bulk Processing Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Pro Features Active</h4>
              <div className="text-blue-800 text-sm space-y-1">
                <div>✓ Unlimited URL processing</div>
                <div>✓ Duplicate detection and validation</div>
                <div>✓ HTTP header generation</div>
                <div>✓ Advanced URL normalization</div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Canonical URL Generator
              {user?.isPro && (
                <span className="ml-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Pro
                </span>
              )}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Generate canonical link tags to prevent duplicate content issues. Manage URL parameters and consolidate page authority effectively.
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
                  You've used all {FREE_USAGE_LIMIT} canonical tag generations for today. Upgrade to Pro for unlimited usage and bulk processing.
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
                  ? `You've reached the daily limit of ${FREE_USAGE_LIMIT} generations or the ${FREE_URL_LIMIT} URL limit for free users.`
                  : `Sign up to get ${FREE_USAGE_LIMIT} daily generations with up to ${FREE_URL_LIMIT} URLs each, or upgrade to Pro for unlimited usage.`
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Canonical URL Configuration</h3>
                <div className="flex gap-2">
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

              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-lg">
                {tabs.map((tab) => {
                  const isLocked = tab.proOnly && !user?.isPro
                  return (
                    <button
                      key={tab.id}
                      onClick={() => !isLocked ? setActiveTab(tab.id) : null}
                      className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors relative ${
                        isLocked
                          ? 'text-slate-400 cursor-not-allowed'
                          : activeTab === tab.id
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.name}
                      {isLocked && (
                        <Lock className="w-3 h-3 ml-1 text-purple-500" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Tab Content */}
              {renderTabContent()}
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Generated Canonical Tags</h3>
                {generatedOutput && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadCanonical}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                )}
              </div>

              <textarea
                value={generatedOutput}
                readOnly
                placeholder="Configure your URLs above to generate canonical tags..."
                className="w-full h-96 p-4 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50 resize-none"
              />
            </div>

            {/* SEO Benefits */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Search className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Canonical URL Benefits</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Prevent duplicate content:</strong> Avoid SEO penalties from similar or identical pages
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Consolidate page authority:</strong> Focus link equity on the preferred version
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Handle URL parameters:</strong> Manage tracking, sorting, and filtering parameters
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Improve crawl efficiency:</strong> Help search engines understand content relationships
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Features Callout */}
            {!user?.isPro && (
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Unlock Pro Features
                    </h3>
                    <div className="text-slate-600 mb-4">
                      Get unlimited canonical tag generation, validation, duplicate detection, and bulk processing capabilities.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited generations
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Bulk URL processing
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Duplicate detection
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        URL validation
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default CanonicalUrlGeneratorTool