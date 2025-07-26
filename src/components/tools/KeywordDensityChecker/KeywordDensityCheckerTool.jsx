'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  Copy, 
  Download, 
  Search,
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
  BarChart3,
  TrendingUp,
  Calculator,
  Target
} from 'lucide-react'

const KeywordDensityCheckerTool = () => {
  // Real auth integration
  const { 
    user, 
    isSignedIn,
    updateUsage, 
    canUseTool, 
    getRemainingUsage 
  } = useAuth()

  const [formData, setFormData] = useState({
    content: '',
    targetKeyword: '',
    ignoreCommonWords: true,
    caseSensitive: false,
    minWordLength: 3
  })

  const [results, setResults] = useState(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Tool configuration
  const TOOL_ID = 'keyword-density-checker'
  const FREE_USAGE_LIMIT = 15
  const FREE_CONTENT_LIMIT = 2000 // characters

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 3
  const isAtLimit = !canUse && isSignedIn

  const tabs = [
    { id: 'basic', name: 'Content Analysis', icon: FileText, proOnly: false },
    { id: 'advanced', name: 'Advanced Options', icon: Settings, proOnly: true }
  ]

  // Common words to ignore
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
    'his', 'its', 'our', 'their', 'as', 'if', 'so', 'than', 'too', 'very', 'just', 'now', 'then'
  ])

  const analyzeContent = () => {
    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    // Check content length limit for free users
    if (!user?.isPro && formData.content.length > FREE_CONTENT_LIMIT) {
      setShowUpgradePrompt(true)
      return
    }

    if (!formData.content.trim()) {
      setResults(null)
      return
    }

    // Clean and split content into words
    let content = formData.content
    if (!formData.caseSensitive) {
      content = content.toLowerCase()
    }

    // Remove punctuation and split into words
    const words = content
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= formData.minWordLength)
      .filter(word => !formData.ignoreCommonWords || !commonWords.has(word.toLowerCase()))

    // Count word frequencies
    const wordCount = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })

    // Calculate total words and densities
    const totalWords = words.length
    const uniqueWords = Object.keys(wordCount).length

    // Sort words by frequency
    const sortedWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, user?.isPro ? 100 : 20) // Limit results for free users

    // Calculate keyword densities
    const keywordDensities = sortedWords.map(([word, count]) => ({
      word,
      count,
      density: ((count / totalWords) * 100).toFixed(2)
    }))

    // Target keyword analysis
    let targetKeywordData = null
    if (formData.targetKeyword) {
      const targetWord = formData.caseSensitive 
        ? formData.targetKeyword 
        : formData.targetKeyword.toLowerCase()
      
      const targetCount = wordCount[targetWord] || 0
      targetKeywordData = {
        keyword: formData.targetKeyword,
        count: targetCount,
        density: targetCount > 0 ? ((targetCount / totalWords) * 100).toFixed(2) : '0.00',
        recommendation: getKeywordRecommendation(((targetCount / totalWords) * 100))
      }
    }

    // Content statistics
    const contentStats = {
      totalCharacters: formData.content.length,
      totalWords: totalWords,
      uniqueWords: uniqueWords,
      averageWordLength: totalWords > 0 ? (words.join('').length / totalWords).toFixed(1) : 0,
      readabilityScore: calculateReadabilityScore(formData.content, totalWords)
    }

    setResults({
      keywordDensities,
      targetKeywordData,
      contentStats,
      topKeywords: keywordDensities.slice(0, 10)
    })

    // Update usage count
    updateUsage(TOOL_ID)
  }

  const getKeywordRecommendation = (density) => {
    if (density === 0) return { type: 'warning', message: 'Keyword not found in content' }
    if (density < 0.5) return { type: 'info', message: 'Consider increasing keyword usage' }
    if (density >= 0.5 && density <= 2.5) return { type: 'success', message: 'Good keyword density' }
    if (density > 2.5 && density <= 4) return { type: 'warning', message: 'Slightly high - consider reducing' }
    return { type: 'error', message: 'Too high - risk of keyword stuffing' }
  }

  const calculateReadabilityScore = (content, wordCount) => {
    if (wordCount === 0) return 0
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    const avgWordsPerSentence = wordCount / sentences
    
    // Simple readability calculation
    let score = 100
    if (avgWordsPerSentence > 20) score -= (avgWordsPerSentence - 20) * 2
    if (avgWordsPerSentence > 15) score -= (avgWordsPerSentence - 15) * 1
    
    return Math.max(0, Math.min(100, Math.round(score)))
  }

  useEffect(() => {
    if (formData.content.trim()) {
      const timeoutId = setTimeout(analyzeContent, 500)
      return () => clearTimeout(timeoutId)
    } else {
      setResults(null)
    }
  }, [formData])

  const copyResults = () => {
    if (!results) return
    
    let output = `Keyword Density Analysis\n\n`
    output += `Content Statistics:\n`
    output += `- Total Characters: ${results.contentStats.totalCharacters}\n`
    output += `- Total Words: ${results.contentStats.totalWords}\n`
    output += `- Unique Words: ${results.contentStats.uniqueWords}\n`
    output += `- Average Word Length: ${results.contentStats.averageWordLength}\n`
    output += `- Readability Score: ${results.contentStats.readabilityScore}/100\n\n`

    if (results.targetKeywordData) {
      output += `Target Keyword Analysis:\n`
      output += `- Keyword: "${results.targetKeywordData.keyword}"\n`
      output += `- Count: ${results.targetKeywordData.count}\n`
      output += `- Density: ${results.targetKeywordData.density}%\n`
      output += `- Recommendation: ${results.targetKeywordData.recommendation.message}\n\n`
    }

    output += `Top Keywords:\n`
    results.topKeywords.forEach((item, index) => {
      output += `${index + 1}. ${item.word} - ${item.count} times (${item.density}%)\n`
    })

    navigator.clipboard.writeText(output)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadResults = () => {
    if (!results) return
    
    const csvContent = [
      ['Rank', 'Keyword', 'Count', 'Density (%)'],
      ...results.keywordDensities.map((item, index) => [
        index + 1,
        item.word,
        item.count,
        item.density
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'keyword-density-analysis.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    setFormData({
      ...formData,
      content: `Search engine optimization (SEO) is the practice of increasing the quantity and quality of traffic to your website through organic search engine results. SEO focuses on unpaid traffic rather than direct traffic or paid traffic.

SEO may target different kinds of search, including image search, video search, academic search, news search, and industry-specific vertical search engines. SEO differs from local search engine optimization in that the latter is focused on optimizing a business's online presence so that its web pages will be displayed by search engines when users enter local searches.

As an internet marketing strategy, SEO considers how search engines work, the computer-programmed algorithms that dictate search engine behavior, what people search for, the actual search terms or keywords typed into search engines, and which search engines are preferred by their targeted audience.

Optimizing a website may involve editing its content, adding content, doing HTML, and associated coding to both increase its relevance to specific keywords and to remove barriers to the indexing activities of search engines.`,
      targetKeyword: 'SEO'
    })
  }

  const clearAll = () => {
    setFormData({
      content: '',
      targetKeyword: '',
      ignoreCommonWords: true,
      caseSensitive: false,
      minWordLength: 3
    })
    setResults(null)
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
            Unlimited analysis • No content limits • Pro Plan
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
          </span> analyses today • <span className="font-medium">{formData.content.length}/{FREE_CONTENT_LIMIT}</span> chars
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content to Analyze *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Paste your content here to analyze keyword density..."
                className="w-full h-48 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                maxLength={user?.isPro ? undefined : FREE_CONTENT_LIMIT}
              />
              <div className="text-xs text-slate-500 mt-1">
                {formData.content.length}{user?.isPro ? '' : `/${FREE_CONTENT_LIMIT}`} characters
                {!user?.isPro && formData.content.length > FREE_CONTENT_LIMIT - 100 && (
                  <span className="text-orange-600 font-medium ml-2">
                    • Approaching limit
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Keyword (Optional)
              </label>
              <input
                type="text"
                value={formData.targetKeyword}
                onChange={(e) => setFormData(prev => ({ ...prev, targetKeyword: e.target.value }))}
                placeholder="Enter your target keyword for specific analysis"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <div className="text-xs text-slate-500 mt-1">
                Get specific density and recommendations for your target keyword
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Basic Options
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.ignoreCommonWords}
                  onChange={(e) => setFormData(prev => ({ ...prev, ignoreCommonWords: e.target.checked }))}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="ml-2 text-sm text-slate-700">Ignore common words (the, and, is, etc.)</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.caseSensitive}
                  onChange={(e) => setFormData(prev => ({ ...prev, caseSensitive: e.target.checked }))}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="ml-2 text-sm text-slate-700">Case sensitive analysis</span>
              </label>

              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  Minimum word length: {formData.minWordLength}
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={formData.minWordLength}
                  onChange={(e) => setFormData(prev => ({ ...prev, minWordLength: parseInt(e.target.value) }))}
                  className="w-full"
                />
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
                Advanced keyword analysis options including competitor comparison and bulk analysis are available with Pro subscription.
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
                Advanced features including competitor analysis, bulk content processing, and detailed SEO recommendations will be available in the next update.
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
              Keyword Density Checker
              {user?.isPro && (
                <span className="ml-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Pro
                </span>
              )}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Analyze keyword frequency and density in your content. Get SEO recommendations and optimize your content for better search rankings.
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
                  You've used all {FREE_USAGE_LIMIT} keyword analyses for today. Upgrade to Pro for unlimited usage and no content limits.
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
                  ? `You've reached the daily limit of ${FREE_USAGE_LIMIT} analyses or the ${FREE_CONTENT_LIMIT} character limit for free users.`
                  : `Sign up to get ${FREE_USAGE_LIMIT} daily analyses with up to ${FREE_CONTENT_LIMIT} characters each, or upgrade to Pro for unlimited usage.`
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
                <h3 className="text-lg font-semibold text-slate-900">Content Analysis</h3>
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

          {/* Results Section */}
          <div className="space-y-6">
            {/* Content Statistics */}
            {results && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Content Statistics</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyResults}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadResults}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-sm text-slate-600">Total Words</div>
                    <div className="text-2xl font-bold text-slate-900">{results.contentStats.totalWords}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-sm text-slate-600">Unique Words</div>
                    <div className="text-2xl font-bold text-slate-900">{results.contentStats.uniqueWords}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-sm text-slate-600">Characters</div>
                    <div className="text-2xl font-bold text-slate-900">{results.contentStats.totalCharacters}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-sm text-slate-600">Readability</div>
                    <div className="text-2xl font-bold text-slate-900">{results.contentStats.readabilityScore}/100</div>
                  </div>
                </div>

                {/* Target Keyword Analysis */}
                {results.targetKeywordData && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-3">Target Keyword Analysis</h4>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">"{results.targetKeywordData.keyword}"</span>
                        <span className="text-lg font-bold">{results.targetKeywordData.density}%</span>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        Found {results.targetKeywordData.count} times
                      </div>
                      <div className={`text-sm px-2 py-1 rounded ${
                        results.targetKeywordData.recommendation.type === 'success' ? 'bg-green-100 text-green-800' :
                        results.targetKeywordData.recommendation.type === 'warning' ? 'bg-orange-100 text-orange-800' :
                        results.targetKeywordData.recommendation.type === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {results.targetKeywordData.recommendation.message}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Top Keywords */}
            {results && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Top Keywords {!user?.isPro && '(Top 20)'}
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.keywordDensities.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-500 w-8">#{index + 1}</span>
                        <span className="font-medium">{item.word}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.density}%</div>
                        <div className="text-xs text-slate-500">{item.count} times</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Tips */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">SEO Best Practices</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Optimal keyword density:</strong> Aim for 0.5-2.5% for your main keyword
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Avoid keyword stuffing:</strong> Keep density below 4% to avoid penalties
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Use variations:</strong> Include related keywords and synonyms
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Quality matters:</strong> Focus on natural, valuable content over density
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
                      Get unlimited keyword analysis, no content limits, advanced options, and competitor comparison.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited analyses
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        No content limits
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Advanced options
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Full keyword lists
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

export default KeywordDensityCheckerTool