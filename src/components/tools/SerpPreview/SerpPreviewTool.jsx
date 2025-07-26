'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  Copy, 
  Download, 
  Eye,
  Crown,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Zap,
  Info,
  Search,
  RefreshCw,
  Lock,
  Settings,
  Monitor,
  Smartphone,
  Star,
  Globe,
  Calendar,
  Share2
} from 'lucide-react'

const SerpPreviewTool = () => {
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
    url: '',
    breadcrumbs: '',
    sitelinks: '',
    publishDate: '',
    author: '',
    rating: '',
    reviewCount: '',
    price: ''
  })

  const [activeView, setActiveView] = useState('desktop')
  const [activeTab, setActiveTab] = useState('basic')
  const [copySuccess, setCopySuccess] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Tool configuration
  const TOOL_ID = 'serp-preview'
  const FREE_USAGE_LIMIT = 20

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 3
  const isAtLimit = !canUse && isSignedIn

  const tabs = [
    { id: 'basic', name: 'Basic Preview', icon: Search, proOnly: false },
    { id: 'enhanced', name: 'Enhanced Features', icon: Settings, proOnly: true }
  ]

  const views = [
    { id: 'desktop', name: 'Desktop', icon: Monitor },
    { id: 'mobile', name: 'Mobile', icon: Smartphone }
  ]

  useEffect(() => {
    if (formData.title || formData.description) {
      // Update usage when preview is generated
      if (canUse) {
        updateUsage(TOOL_ID)
      }
    }
  }, [formData.title, formData.description])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getTruncatedTitle = () => {
    const maxLength = activeView === 'desktop' ? 60 : 50
    if (formData.title.length <= maxLength) return formData.title
    return formData.title.substring(0, maxLength - 3) + '...'
  }

  const getTruncatedDescription = () => {
    const maxLength = activeView === 'desktop' ? 160 : 120
    if (formData.description.length <= maxLength) return formData.description
    return formData.description.substring(0, maxLength - 3) + '...'
  }

  const getDisplayUrl = () => {
    if (!formData.url) return 'https://yourwebsite.com'
    
    try {
      const url = new URL(formData.url.startsWith('http') ? formData.url : `https://${formData.url}`)
      const path = url.pathname === '/' ? '' : url.pathname
      return `${url.hostname}${path}`
    } catch {
      return formData.url
    }
  }

  const copyPreviewData = () => {
    const data = `SERP Preview Data:

Title: ${formData.title}
Description: ${formData.description}
URL: ${formData.url}
${formData.breadcrumbs ? `Breadcrumbs: ${formData.breadcrumbs}` : ''}
${formData.publishDate ? `Published: ${formData.publishDate}` : ''}
${formData.author ? `Author: ${formData.author}` : ''}

Character Counts:
- Title: ${formData.title.length}/60 (Desktop) / 50 (Mobile)
- Description: ${formData.description.length}/160 (Desktop) / 120 (Mobile)

Recommendations:
${formData.title.length > 60 ? '⚠️ Title may be truncated on desktop' : '✅ Title length is good'}
${formData.description.length > 160 ? '⚠️ Description may be truncated on desktop' : '✅ Description length is good'}
${formData.title.length > 50 ? '⚠️ Title may be truncated on mobile' : '✅ Title length is good for mobile'}
${formData.description.length > 120 ? '⚠️ Description may be truncated on mobile' : '✅ Description length is good for mobile'}`

    navigator.clipboard.writeText(data)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadPreview = () => {
    // For now, just copy the data. In a real implementation, you might generate an image
    copyPreviewData()
  }

  const loadSample = () => {
    setFormData({
      title: 'Complete Guide to SEO Optimization in 2024',
      description: 'Learn the latest SEO strategies and techniques to improve your website\'s search engine rankings. Includes practical tips, case studies, and expert insights.',
      url: 'https://yourwebsite.com/seo-guide-2024',
      breadcrumbs: 'Home > Blog > SEO',
      publishDate: '2024-01-15',
      author: 'John Smith',
      rating: '4.8',
      reviewCount: '234',
      price: ''
    })
  }

  const clearAll = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      breadcrumbs: '',
      sitelinks: '',
      publishDate: '',
      author: '',
      rating: '',
      reviewCount: '',
      price: ''
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
            Unlimited previews • All features • Pro Plan
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
          </span> previews today
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
                placeholder="Enter your page title"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                maxLength="70"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{formData.title.length}/70 characters</span>
                <span className={formData.title.length > 60 ? 'text-orange-600' : 'text-green-600'}>
                  {formData.title.length > 60 ? 'May be truncated' : 'Good length'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Meta Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter your meta description"
                className="w-full h-20 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                maxLength="180"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{formData.description.length}/180 characters</span>
                <span className={formData.description.length > 160 ? 'text-orange-600' : 'text-green-600'}>
                  {formData.description.length > 160 ? 'May be truncated' : 'Good length'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Page URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://yourwebsite.com/page"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Breadcrumbs
              </label>
              <input
                type="text"
                value={formData.breadcrumbs}
                onChange={(e) => handleInputChange('breadcrumbs', e.target.value)}
                placeholder="Home > Category > Page"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
        )

      case 'enhanced':
        if (!user?.isPro) {
          return (
            <div className="text-center p-8">
              <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Pro Feature</h3>
              <p className="text-slate-600 mb-4">
                Enhanced SERP features including rich snippets, ratings, and advanced previews are available with Pro subscription.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => handleInputChange('publishDate', e.target.value)}
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
                  placeholder="Author name"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  placeholder="4.5"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Review Count
                </label>
                <input
                  type="number"
                  value={formData.reviewCount}
                  onChange={(e) => handleInputChange('reviewCount', e.target.value)}
                  placeholder="123"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price (for product pages)
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="$99.99"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderSerpPreview = () => {
    const isMobile = activeView === 'mobile'
    
    return (
      <div className={`${isMobile ? 'max-w-sm' : 'max-w-2xl'} mx-auto`}>
        {/* Search Bar Mockup */}
        <div className="mb-4 p-3 border border-slate-200 rounded-full bg-white flex items-center">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <span className="text-slate-600 text-sm">
            {formData.title ? formData.title.split(' ').slice(0, 3).join(' ') : 'your search query'}
          </span>
        </div>

        {/* SERP Result */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          {/* Breadcrumbs */}
          {formData.breadcrumbs && (
            <div className="text-xs text-slate-600 mb-1">
              {formData.breadcrumbs}
            </div>
          )}

          {/* URL */}
          <div className="flex items-center mb-1">
            <Globe className="w-3 h-3 text-slate-400 mr-1" />
            <span className="text-sm text-green-700">
              {getDisplayUrl()}
            </span>
            {formData.publishDate && (
              <span className="text-xs text-slate-500 ml-2">
                • {new Date(formData.publishDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-blue-600 hover:underline cursor-pointer font-medium mb-2 ${
            isMobile ? 'text-lg' : 'text-xl'
          }`}>
            {getTruncatedTitle() || 'Your Page Title Will Appear Here'}
          </h3>

          {/* Enhanced Features (Pro) */}
          {user?.isPro && (formData.rating || formData.author || formData.price) && (
            <div className="flex items-center gap-4 mb-2 text-sm">
              {formData.rating && (
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${
                          i < Math.floor(parseFloat(formData.rating)) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-slate-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-slate-600">
                    {formData.rating}
                    {formData.reviewCount && ` (${formData.reviewCount})`}
                  </span>
                </div>
              )}
              
              {formData.author && (
                <div className="text-slate-600">
                  by {formData.author}
                </div>
              )}

              {formData.price && (
                <div className="text-green-600 font-semibold">
                  {formData.price}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed">
            {getTruncatedDescription() || 'Your meta description will appear here. Make it compelling and informative to encourage clicks from search results.'}
          </p>

          {/* Additional links (mockup) */}
          {user?.isPro && formData.title && (
            <div className="mt-3 flex flex-wrap gap-4 text-xs">
              <a href="#" className="text-blue-600 hover:underline">About</a>
              <a href="#" className="text-blue-600 hover:underline">Services</a>
              <a href="#" className="text-blue-600 hover:underline">Contact</a>
            </div>
          )}
        </div>
      </div>
    )
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
              SERP Preview Tool
              {user?.isPro && (
                <span className="ml-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Pro
                </span>
              )}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Preview how your pages will appear in Google search results. Optimize your titles and descriptions for better click-through rates.
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
                  You've used all {FREE_USAGE_LIMIT} SERP previews for today. Upgrade to Pro for unlimited usage and enhanced features.
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
                  ? `You've used all ${FREE_USAGE_LIMIT} SERP previews for today.`
                  : `Sign up to get ${FREE_USAGE_LIMIT} daily previews, or upgrade to Pro for unlimited usage and enhanced features.`
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
                <h3 className="text-lg font-semibold text-slate-900">Page Information</h3>
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

          {/* Preview Section */}
          <div className="space-y-6">
            {/* View Toggle */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Search Result Preview</h3>
                <div className="flex gap-2">
                  <button
                    onClick={copyPreviewData}
                    className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copySuccess ? 'Copied!' : 'Copy Data'}
                  </button>
                </div>
              </div>

              {/* Device Toggle */}
              <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-lg">
                {views.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeView === view.id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <view.icon className="w-4 h-4 mr-2" />
                    {view.name}
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div className="bg-slate-50 p-6 rounded-lg">
                {renderSerpPreview()}
              </div>
            </div>

            {/* SEO Tips */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">SERP Optimization Tips</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Title length:</strong> Keep titles under 60 characters for desktop, 50 for mobile
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Description length:</strong> Aim for 150-160 characters for optimal display
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Include keywords:</strong> Use target keywords in both title and description
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Call to action:</strong> Use compelling language to encourage clicks
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
                      Unlock Enhanced Previews
                    </h3>
                    <div className="text-slate-600 mb-4">
                      Get unlimited SERP previews with rich snippets, ratings, author info, and advanced features.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited previews
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Rich snippets
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Rating displays
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Multiple devices
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

export default SerpPreviewTool