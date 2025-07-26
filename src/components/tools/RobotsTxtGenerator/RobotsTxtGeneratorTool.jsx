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
  Bot,
  Plus,
  Minus
} from 'lucide-react'

const RobotsTxtGeneratorTool = () => {
  // Real auth integration
  const { 
    user, 
    isSignedIn,
    updateUsage, 
    canUseTool, 
    getRemainingUsage 
  } = useAuth()

  const [formData, setFormData] = useState({
    userAgents: [
      { userAgent: '*', rules: [{ directive: 'Allow', path: '/' }] }
    ],
    sitemap: '',
    crawlDelay: '',
    host: ''
  })

  const [generatedRobots, setGeneratedRobots] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Tool configuration
  const TOOL_ID = 'robots-txt-generator'
  const FREE_USAGE_LIMIT = 10

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 2
  const isAtLimit = !canUse && isSignedIn

  const tabs = [
    { id: 'basic', name: 'Basic Rules', icon: Bot, proOnly: false },
    { id: 'advanced', name: 'Advanced Settings', icon: Settings, proOnly: true }
  ]

  useEffect(() => {
    generateRobotsTxt()
  }, [formData])

  const generateRobotsTxt = () => {
    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    let robotsContent = []

    // Generate user-agent blocks
    formData.userAgents.forEach(userAgentBlock => {
      robotsContent.push(`User-agent: ${userAgentBlock.userAgent}`)
      
      userAgentBlock.rules.forEach(rule => {
        if (rule.path.trim()) {
          robotsContent.push(`${rule.directive}: ${rule.path}`)
        }
      })
      
      robotsContent.push('') // Empty line between user-agent blocks
    })

    // Add crawl delay (Pro feature)
    if (user?.isPro && formData.crawlDelay) {
      robotsContent.push(`Crawl-delay: ${formData.crawlDelay}`)
      robotsContent.push('')
    }

    // Add host (Pro feature)
    if (user?.isPro && formData.host) {
      robotsContent.push(`Host: ${formData.host}`)
      robotsContent.push('')
    }

    // Add sitemap
    if (formData.sitemap) {
      robotsContent.push(`Sitemap: ${formData.sitemap}`)
    }

    setGeneratedRobots(robotsContent.join('\n').trim())
    
    // Update usage count
    updateUsage(TOOL_ID)
  }

  const addUserAgent = () => {
    setFormData(prev => ({
      ...prev,
      userAgents: [
        ...prev.userAgents,
        { userAgent: '*', rules: [{ directive: 'Allow', path: '/' }] }
      ]
    }))
  }

  const removeUserAgent = (index) => {
    if (formData.userAgents.length > 1) {
      setFormData(prev => ({
        ...prev,
        userAgents: prev.userAgents.filter((_, i) => i !== index)
      }))
    }
  }

  const updateUserAgent = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      userAgents: prev.userAgents.map((ua, i) => 
        i === index ? { ...ua, [field]: value } : ua
      )
    }))
  }

  const addRule = (userAgentIndex) => {
    setFormData(prev => ({
      ...prev,
      userAgents: prev.userAgents.map((ua, i) => 
        i === userAgentIndex 
          ? { ...ua, rules: [...ua.rules, { directive: 'Allow', path: '/' }] }
          : ua
      )
    }))
  }

  const removeRule = (userAgentIndex, ruleIndex) => {
    setFormData(prev => ({
      ...prev,
      userAgents: prev.userAgents.map((ua, i) => 
        i === userAgentIndex 
          ? { ...ua, rules: ua.rules.filter((_, ri) => ri !== ruleIndex) }
          : ua
      )
    }))
  }

  const updateRule = (userAgentIndex, ruleIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      userAgents: prev.userAgents.map((ua, i) => 
        i === userAgentIndex 
          ? { 
              ...ua, 
              rules: ua.rules.map((rule, ri) => 
                ri === ruleIndex ? { ...rule, [field]: value } : rule
              )
            }
          : ua
      )
    }))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedRobots)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadRobots = () => {
    const blob = new Blob([generatedRobots], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'robots.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    setFormData({
      userAgents: [
        { 
          userAgent: '*', 
          rules: [
            { directive: 'Allow', path: '/' },
            { directive: 'Disallow', path: '/admin/' },
            { directive: 'Disallow', path: '/private/' }
          ] 
        },
        { 
          userAgent: 'Googlebot', 
          rules: [
            { directive: 'Allow', path: '/' }
          ] 
        }
      ],
      sitemap: 'https://yourwebsite.com/sitemap.xml',
      crawlDelay: '1',
      host: 'yourwebsite.com'
    })
  }

  const clearAll = () => {
    setFormData({
      userAgents: [
        { userAgent: '*', rules: [{ directive: 'Allow', path: '/' }] }
      ],
      sitemap: '',
      crawlDelay: '',
      host: ''
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
          <div className="space-y-6">
            {/* User Agent Blocks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-slate-700">
                  User-Agent Rules
                </label>
                <button
                  onClick={addUserAgent}
                  className="flex items-center text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add User-Agent
                </button>
              </div>

              {formData.userAgents.map((userAgentBlock, userAgentIndex) => (
                <div key={userAgentIndex} className="border border-slate-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1 mr-4">
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        User-Agent
                      </label>
                      <input
                        type="text"
                        value={userAgentBlock.userAgent}
                        onChange={(e) => updateUserAgent(userAgentIndex, 'userAgent', e.target.value)}
                        placeholder="* (all bots) or specific bot name"
                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                      />
                    </div>
                    {formData.userAgents.length > 1 && (
                      <button
                        onClick={() => removeUserAgent(userAgentIndex)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-600">
                        Rules
                      </label>
                      <button
                        onClick={() => addRule(userAgentIndex)}
                        className="flex items-center text-xs text-sky-600 hover:text-sky-700 font-medium"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Rule
                      </button>
                    </div>

                    {userAgentBlock.rules.map((rule, ruleIndex) => (
                      <div key={ruleIndex} className="flex items-center gap-2 mb-2">
                        <select
                          value={rule.directive}
                          onChange={(e) => updateRule(userAgentIndex, ruleIndex, 'directive', e.target.value)}
                          className="p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                        >
                          <option value="Allow">Allow</option>
                          <option value="Disallow">Disallow</option>
                        </select>
                        <input
                          type="text"
                          value={rule.path}
                          onChange={(e) => updateRule(userAgentIndex, ruleIndex, 'path', e.target.value)}
                          placeholder="/path/ or specific file"
                          className="flex-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                        />
                        {userAgentBlock.rules.length > 1 && (
                          <button
                            onClick={() => removeRule(userAgentIndex, ruleIndex)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Sitemap */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sitemap URL
              </label>
              <input
                type="url"
                value={formData.sitemap}
                onChange={(e) => setFormData(prev => ({ ...prev, sitemap: e.target.value }))}
                placeholder="https://yourwebsite.com/sitemap.xml"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <div className="text-xs text-slate-500 mt-1">
                URL to your XML sitemap
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
                Advanced robots.txt settings are available with Pro subscription.
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
                Crawl Delay (seconds)
              </label>
              <input
                type="number"
                value={formData.crawlDelay}
                onChange={(e) => setFormData(prev => ({ ...prev, crawlDelay: e.target.value }))}
                placeholder="1"
                min="0"
                max="86400"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <div className="text-xs text-slate-500 mt-1">
                Delay between crawler requests in seconds
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Preferred Host
              </label>
              <input
                type="text"
                value={formData.host}
                onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                placeholder="yourwebsite.com"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <div className="text-xs text-slate-500 mt-1">
                Specify the preferred domain version (without protocol)
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
              Robots.txt Generator
              {user?.isPro && (
                <span className="ml-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Pro
                </span>
              )}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Generate robots.txt files to control how search engine crawlers access your website. Specify crawl rules, delays, and sitemaps.
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
                  You've used all {FREE_USAGE_LIMIT} robots.txt generations for today. Upgrade to Pro for unlimited usage.
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
                  ? `You've used all ${FREE_USAGE_LIMIT} robots.txt generations for today.`
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
                <h3 className="text-lg font-semibold text-slate-900">Robots.txt Configuration</h3>
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
                <h3 className="text-lg font-semibold text-slate-900">Generated Robots.txt</h3>
                {generatedRobots && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadRobots}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                )}
              </div>

              <textarea
                value={generatedRobots}
                readOnly
                placeholder="Robots.txt content will appear here as you configure the rules..."
                className="w-full h-96 p-4 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50 resize-none"
              />
            </div>

            {/* Best Practices */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Bot className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Robots.txt Best Practices</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Place at root:</strong> Upload robots.txt to your domain's root directory (yoursite.com/robots.txt)
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Use wildcards:</strong> "*" means all bots, specific bot names for targeted rules
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Test regularly:</strong> Verify your robots.txt in Google Search Console
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Include sitemap:</strong> Help search engines find your XML sitemap
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
                      Get unlimited robots.txt generation, advanced settings, crawl delay control, and bulk processing.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited generations
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Crawl delay settings
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Host preferences
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Advanced templates
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

export default RobotsTxtGeneratorTool