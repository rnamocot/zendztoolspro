'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  Copy, 
  Download, 
  FileText,
  Crown,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Zap,
  Info,
  Search,
  Globe,
  RefreshCw,
  Lock,
  Settings,
  MapPin,
  Plus,
  Minus,
  Calendar
} from 'lucide-react'

const XmlSitemapGeneratorTool = () => {
  // Real auth integration
  const { 
    user, 
    isSignedIn,
    updateUsage, 
    canUseTool, 
    getRemainingUsage 
  } = useAuth()

  const [formData, setFormData] = useState({
    baseUrl: '',
    urls: [
      { 
        url: '/', 
        lastmod: new Date().toISOString().split('T')[0], 
        changefreq: 'weekly', 
        priority: '1.0' 
      }
    ],
    includeImages: false,
    includeLastmod: true,
    includeChangefreq: true,
    includePriority: true
  })

  const [generatedSitemap, setGeneratedSitemap] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Tool configuration
  const TOOL_ID = 'xml-sitemap-generator'
  const FREE_USAGE_LIMIT = 5
  const FREE_URL_LIMIT = 10

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 1
  const isAtLimit = !canUse && isSignedIn

  const tabs = [
    { id: 'basic', name: 'URLs & Settings', icon: MapPin, proOnly: false },
    { id: 'advanced', name: 'Advanced Options', icon: Settings, proOnly: true }
  ]

  const changefreqOptions = [
    'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'
  ]

  useEffect(() => {
    generateSitemap()
  }, [formData])

  const generateSitemap = () => {
    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    // Check URL limit for free users
    if (!user?.isPro && formData.urls.length > FREE_URL_LIMIT) {
      setShowUpgradePrompt(true)
      return
    }

    let sitemapContent = []
    sitemapContent.push('<?xml version="1.0" encoding="UTF-8"?>')
    sitemapContent.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    formData.urls.forEach(urlData => {
      if (urlData.url.trim()) {
        sitemapContent.push('  <url>')
        
        // Construct full URL
        const fullUrl = urlData.url.startsWith('http') 
          ? urlData.url 
          : `${formData.baseUrl.replace(/\/$/, '')}${urlData.url.startsWith('/') ? urlData.url : '/' + urlData.url}`
        
        sitemapContent.push(`    <loc>${fullUrl}</loc>`)
        
        if (formData.includeLastmod && urlData.lastmod) {
          sitemapContent.push(`    <lastmod>${urlData.lastmod}</lastmod>`)
        }
        
        if (formData.includeChangefreq && urlData.changefreq) {
          sitemapContent.push(`    <changefreq>${urlData.changefreq}</changefreq>`)
        }
        
        if (formData.includePriority && urlData.priority) {
          sitemapContent.push(`    <priority>${urlData.priority}</priority>`)
        }
        
        sitemapContent.push('  </url>')
      }
    })

    sitemapContent.push('</urlset>')

    setGeneratedSitemap(sitemapContent.join('\n'))
    
    // Update usage count
    updateUsage(TOOL_ID)
  }

  const addUrl = () => {
    if (!user?.isPro && formData.urls.length >= FREE_URL_LIMIT) {
      setShowUpgradePrompt(true)
      return
    }

    setFormData(prev => ({
      ...prev,
      urls: [
        ...prev.urls,
        { 
          url: '', 
          lastmod: new Date().toISOString().split('T')[0], 
          changefreq: 'weekly', 
          priority: '0.5' 
        }
      ]
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
    navigator.clipboard.writeText(generatedSitemap)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadSitemap = () => {
    const blob = new Blob([generatedSitemap], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sitemap.xml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    setFormData({
      baseUrl: 'https://yourwebsite.com',
      urls: [
        { url: '/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '1.0' },
        { url: '/about', lastmod: '2024-01-15', changefreq: 'monthly', priority: '0.8' },
        { url: '/services', lastmod: '2024-01-10', changefreq: 'weekly', priority: '0.9' },
        { url: '/blog', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '0.7' },
        { url: '/contact', lastmod: '2024-01-01', changefreq: 'yearly', priority: '0.6' }
      ],
      includeImages: false,
      includeLastmod: true,
      includeChangefreq: true,
      includePriority: true
    })
  }

  const clearAll = () => {
    setFormData({
      baseUrl: '',
      urls: [
        { url: '/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '1.0' }
      ],
      includeImages: false,
      includeLastmod: true,
      includeChangefreq: true,
      includePriority: true
    })
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
            Unlimited sitemaps • Up to 50,000 URLs • Pro Plan
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
          </span> sitemaps today • <span className="font-medium">{formData.urls.length}/{FREE_URL_LIMIT}</span> URLs
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
            {/* Base URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Base URL *
              </label>
              <input
                type="url"
                value={formData.baseUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                placeholder="https://yourwebsite.com"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <div className="text-xs text-slate-500 mt-1">
                Your website's base URL (will be prepended to relative URLs)
              </div>
            </div>

            {/* URLs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-slate-700">
                  URLs to Include {!user?.isPro && (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          URL Path
                        </label>
                        <input
                          type="text"
                          value={urlData.url}
                          onChange={(e) => updateUrl(index, 'url', e.target.value)}
                          placeholder="/page-path"
                          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          Last Modified
                        </label>
                        <input
                          type="date"
                          value={urlData.lastmod}
                          onChange={(e) => updateUrl(index, 'lastmod', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                        />
                      </div>

                      <div className="flex items-end">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          Change Frequency
                        </label>
                        <select
                          value={urlData.changefreq}
                          onChange={(e) => updateUrl(index, 'changefreq', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                        >
                          {changefreqOptions.map(freq => (
                            <option key={freq} value={freq}>
                              {freq.charAt(0).toUpperCase() + freq.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          Priority (0.0 - 1.0)
                        </label>
                        <input
                          type="number"
                          value={urlData.priority}
                          onChange={(e) => updateUrl(index, 'priority', e.target.value)}
                          min="0.0"
                          max="1.0"
                          step="0.1"
                          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Include Options */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Include in Sitemap
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeLastmod}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeLastmod: e.target.checked }))}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Last Modified Date</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeChangefreq}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeChangefreq: e.target.checked }))}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Change Frequency</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includePriority}
                    onChange={(e) => setFormData(prev => ({ ...prev, includePriority: e.target.checked }))}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Priority</span>
                </label>
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
                Advanced sitemap options including image sitemaps and bulk URL import are available with Pro subscription.
              </p>
              <Link href="/pricing" className="btn btn-primary">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Link>
            </div>
          )
        }

        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Advanced Features Coming Soon</h4>
              <p className="text-blue-800 text-sm">
                Advanced features including image sitemaps, news sitemaps, video sitemaps, and bulk URL import will be available in the next update.
              </p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.includeImages}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeImages: e.target.checked }))}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="ml-2 text-sm text-slate-700">Include Image Sitemap (Coming Soon)</span>
              </label>
              <div className="text-xs text-slate-500 mt-1">
                Automatically detect and include images in sitemap
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
              XML Sitemap Generator
              {user?.isPro && (
                <span className="ml-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Pro
                </span>
              )}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Generate XML sitemaps to help search engines discover and index your website pages. Include priority, change frequency, and last modified dates.
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
                  You've used all {FREE_USAGE_LIMIT} sitemap generations for today. Upgrade to Pro for unlimited usage and up to 50,000 URLs per sitemap.
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
                  ? `You've reached the daily limit of ${FREE_USAGE_LIMIT} sitemaps or the ${FREE_URL_LIMIT} URL limit for free users.`
                  : `Sign up to get ${FREE_USAGE_LIMIT} daily sitemap generations with up to ${FREE_URL_LIMIT} URLs each, or upgrade to Pro for unlimited usage.`
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
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Sitemap Configuration</h3>
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
                <h3 className="text-lg font-semibold text-slate-900">Generated XML Sitemap</h3>
                {generatedSitemap && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadSitemap}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                )}
              </div>

              <textarea
                value={generatedSitemap}
                readOnly
                placeholder="XML sitemap will appear here as you configure the URLs..."
                className="w-full h-96 p-4 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50 resize-none"
              />
            </div>

            {/* Best Practices */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Sitemap Best Practices</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Submit to search engines:</strong> Upload to your site root and submit via Google Search Console
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Update regularly:</strong> Keep your sitemap current with new and modified pages
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Priority values:</strong> Use 1.0 for homepage, 0.8+ for important pages, 0.5 for regular pages
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Reference in robots.txt:</strong> Include "Sitemap: https://yoursite.com/sitemap.xml"
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
                      Get unlimited sitemap generation, up to 50,000 URLs per sitemap, advanced options, and bulk import.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited sitemaps
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Up to 50,000 URLs
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Image sitemaps
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Bulk URL import
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

export default XmlSitemapGeneratorTool