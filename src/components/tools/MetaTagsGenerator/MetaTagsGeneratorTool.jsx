'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  Copy, 
  Download, 
  Tag,
  Crown,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Zap,
  Info,
  Globe,
  Twitter,
  Facebook,
  Search,
  Eye,
  RefreshCw,
  Lock,
  Settings
} from 'lucide-react'

const MetaTagsGeneratorTool = () => {
  // Real auth integration
  const { 
    user, 
    isSignedIn,
    updateUsage, 
    canUseTool, 
    getRemainingUsage 
  } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    robots: 'index, follow',
    canonical: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogUrl: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    twitterSite: '',
    twitterCreator: ''
  })

  const [generatedTags, setGeneratedTags] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Tool configuration
  const TOOL_ID = 'meta-tags-generator'
  const FREE_USAGE_LIMIT = 10

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 2
  const isAtLimit = !canUse && isSignedIn

  const tabs = [
    { id: 'basic', name: 'Basic Meta', icon: Tag, proOnly: false },
    { id: 'opengraph', name: 'Open Graph', icon: Facebook, proOnly: false },
    { id: 'twitter', name: 'Twitter Cards', icon: Twitter, proOnly: true },
    { id: 'advanced', name: 'Advanced', icon: Settings, proOnly: true }
  ]

  useEffect(() => {
    generateMetaTags()
  }, [formData])

  const generateMetaTags = () => {
    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    let tags = []

    // Basic Meta Tags
    if (formData.title) {
      tags.push(`<title>${formData.title}</title>`)
      tags.push(`<meta name="title" content="${formData.title}">`)
    }

    if (formData.description) {
      tags.push(`<meta name="description" content="${formData.description}">`)
    }

    if (formData.keywords) {
      tags.push(`<meta name="keywords" content="${formData.keywords}">`)
    }

    if (formData.author) {
      tags.push(`<meta name="author" content="${formData.author}">`)
    }

    tags.push(`<meta name="robots" content="${formData.robots}">`)

    if (formData.canonical) {
      tags.push(`<link rel="canonical" href="${formData.canonical}">`)
    }

    // Open Graph Tags
    if (formData.ogTitle || formData.title) {
      tags.push(`<meta property="og:title" content="${formData.ogTitle || formData.title}">`)
    }

    if (formData.ogDescription || formData.description) {
      tags.push(`<meta property="og:description" content="${formData.ogDescription || formData.description}">`)
    }

    if (formData.ogImage) {
      tags.push(`<meta property="og:image" content="${formData.ogImage}">`)
    }

    if (formData.ogUrl) {
      tags.push(`<meta property="og:url" content="${formData.ogUrl}">`)
    }

    tags.push(`<meta property="og:type" content="${formData.ogType}">`)

    // Twitter Cards (Pro feature)
    if (user?.isPro) {
      tags.push(`<meta name="twitter:card" content="${formData.twitterCard}">`)
      
      if (formData.twitterTitle || formData.ogTitle || formData.title) {
        tags.push(`<meta name="twitter:title" content="${formData.twitterTitle || formData.ogTitle || formData.title}">`)
      }

      if (formData.twitterDescription || formData.ogDescription || formData.description) {
        tags.push(`<meta name="twitter:description" content="${formData.twitterDescription || formData.ogDescription || formData.description}">`)
      }

      if (formData.twitterImage || formData.ogImage) {
        tags.push(`<meta name="twitter:image" content="${formData.twitterImage || formData.ogImage}">`)
      }

      if (formData.twitterSite) {
        tags.push(`<meta name="twitter:site" content="${formData.twitterSite}">`)
      }

      if (formData.twitterCreator) {
        tags.push(`<meta name="twitter:creator" content="${formData.twitterCreator}">`)
      }
    }

    // Responsive viewport (always included)
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`)
    tags.push(`<meta charset="UTF-8">`)

    setGeneratedTags(tags.join('\n'))
    
    // Update usage count
    updateUsage(TOOL_ID)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedTags)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadTags = () => {
    const blob = new Blob([generatedTags], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'meta-tags.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    setFormData({
      title: 'Amazing Website - Your Ultimate Solution',
      description: 'Discover our amazing website that provides ultimate solutions for all your needs. Experience quality, innovation, and excellence.',
      keywords: 'amazing website, ultimate solution, quality, innovation, excellence',
      author: 'Your Company Name',
      robots: 'index, follow',
      canonical: 'https://yourwebsite.com/',
      ogTitle: 'Amazing Website - Your Ultimate Solution',
      ogDescription: 'Discover our amazing website that provides ultimate solutions for all your needs. Experience quality, innovation, and excellence.',
      ogImage: 'https://yourwebsite.com/images/og-image.jpg',
      ogUrl: 'https://yourwebsite.com/',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Amazing Website - Your Ultimate Solution',
      twitterDescription: 'Discover our amazing website that provides ultimate solutions.',
      twitterImage: 'https://yourwebsite.com/images/twitter-image.jpg',
      twitterSite: '@yourwebsite',
      twitterCreator: '@yourcreator'
    })
  }

  const clearAll = () => {
    setFormData({
      title: '',
      description: '',
      keywords: '',
      author: '',
      robots: 'index, follow',
      canonical: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogUrl: '',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      twitterSite: '',
      twitterCreator: ''
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
            Unlimited generations • Pro Plan
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
          </span> generations today
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Page Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter your page title (50-60 characters recommended)"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                maxLength="60"
              />
              <div className="text-xs text-slate-500 mt-1">
                {formData.title.length}/60 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Meta Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter your meta description (150-160 characters recommended)"
                className="w-full h-20 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                maxLength="160"
              />
              <div className="text-xs text-slate-500 mt-1">
                {formData.description.length}/160 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Author or company name"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Robots
              </label>
              <select
                value={formData.robots}
                onChange={(e) => handleInputChange('robots', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="index, follow">Index, Follow (Default)</option>
                <option value="noindex, follow">No Index, Follow</option>
                <option value="index, nofollow">Index, No Follow</option>
                <option value="noindex, nofollow">No Index, No Follow</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Canonical URL
              </label>
              <input
                type="url"
                value={formData.canonical}
                onChange={(e) => handleInputChange('canonical', e.target.value)}
                placeholder="https://yourwebsite.com/page"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
        )

      case 'opengraph':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                OG Title (defaults to page title)
              </label>
              <input
                type="text"
                value={formData.ogTitle}
                onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                placeholder="Title for social media sharing"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                OG Description (defaults to meta description)
              </label>
              <textarea
                value={formData.ogDescription}
                onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                placeholder="Description for social media sharing"
                className="w-full h-20 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                OG Image URL
              </label>
              <input
                type="url"
                value={formData.ogImage}
                onChange={(e) => handleInputChange('ogImage', e.target.value)}
                placeholder="https://yourwebsite.com/image.jpg"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <div className="text-xs text-slate-500 mt-1">
                Recommended size: 1200x630 pixels
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                OG URL
              </label>
              <input
                type="url"
                value={formData.ogUrl}
                onChange={(e) => handleInputChange('ogUrl', e.target.value)}
                placeholder="https://yourwebsite.com/page"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                OG Type
              </label>
              <select
                value={formData.ogType}
                onChange={(e) => handleInputChange('ogType', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="website">Website</option>
                <option value="article">Article</option>
                <option value="product">Product</option>
                <option value="profile">Profile</option>
              </select>
            </div>
          </div>
        )

      case 'twitter':
        if (!user?.isPro) {
          return (
            <div className="text-center p-8">
              <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Pro Feature</h3>
              <p className="text-slate-600 mb-4">
                Twitter Cards generation is available with Pro subscription.
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Twitter Card Type
              </label>
              <select
                value={formData.twitterCard}
                onChange={(e) => handleInputChange('twitterCard', e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Twitter Title (defaults to OG title)
              </label>
              <input
                type="text"
                value={formData.twitterTitle}
                onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
                placeholder="Title for Twitter cards"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Twitter Description
              </label>
              <textarea
                value={formData.twitterDescription}
                onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
                placeholder="Description for Twitter cards"
                className="w-full h-20 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Twitter Image
              </label>
              <input
                type="url"
                value={formData.twitterImage}
                onChange={(e) => handleInputChange('twitterImage', e.target.value)}
                placeholder="https://yourwebsite.com/twitter-image.jpg"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Twitter Site Handle
              </label>
              <input
                type="text"
                value={formData.twitterSite}
                onChange={(e) => handleInputChange('twitterSite', e.target.value)}
                placeholder="@yourwebsite"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Twitter Creator Handle
              </label>
              <input
                type="text"
                value={formData.twitterCreator}
                onChange={(e) => handleInputChange('twitterCreator', e.target.value)}
                placeholder="@creator"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
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
                Advanced meta tags are available with Pro subscription.
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
                Advanced meta tags including schema markup, custom properties, and bulk generation will be available in the next update.
              </p>
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
              Meta Tags Generator
              {user?.isPro && (
                <span className="ml-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Pro
                </span>
              )}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Generate complete SEO meta tags including Open Graph and Twitter Cards for better search engine optimization and social media sharing.
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
                  You've used all {FREE_USAGE_LIMIT} meta tag generations for today. Upgrade to Pro for unlimited usage.
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
                  ? `You've used all ${FREE_USAGE_LIMIT} meta tag generations for today.`
                  : `Sign up to get ${FREE_USAGE_LIMIT} daily generations, or upgrade to Pro for unlimited usage.`
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
                <h3 className="text-lg font-semibold text-slate-900">Meta Tag Configuration</h3>
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
                <h3 className="text-lg font-semibold text-slate-900">Generated Meta Tags</h3>
                {generatedTags && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadTags}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                )}
              </div>

              <textarea
                value={generatedTags}
                readOnly
                placeholder="Meta tags will appear here as you fill in the form..."
                className="w-full h-96 p-4 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50 resize-none"
              />
            </div>

            {/* SEO Tips */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Search className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">SEO Best Practices</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Title Tags:</strong> Keep under 60 characters and include your primary keyword
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Meta Description:</strong> Write compelling descriptions under 160 characters
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Open Graph:</strong> Use images at least 1200x630 pixels for best social sharing
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Keywords:</strong> Use 3-5 relevant keywords, avoid keyword stuffing
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
                      Get unlimited meta tag generation, Twitter Cards, advanced templates, and bulk processing.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited generations
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Twitter Cards support
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Advanced templates
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Bulk processing
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

export default MetaTagsGeneratorTool