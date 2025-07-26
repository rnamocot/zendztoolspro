'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  Copy, 
  Download, 
  Globe,
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
  Languages,
  Plus,
  Minus,
  Search,
  Code,
  MapPin
} from 'lucide-react'

const HreflangGeneratorTool = () => {
  // Real auth integration
  const { 
    user, 
    isSignedIn,
    updateUsage, 
    canUseTool, 
    getRemainingUsage 
  } = useAuth()

  const [formData, setFormData] = useState({
    pages: [{ url: '', language: 'en', region: '', title: '' }],
    includeXDefault: true,
    includeHtml: true,
    includeXmlSitemap: false,
    includeHttpHeader: false,
    baseUrl: ''
  })

  const [generatedOutput, setGeneratedOutput] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Tool configuration
  const TOOL_ID = 'hreflang-generator'
  const FREE_USAGE_LIMIT = 12
  const FREE_PAGE_LIMIT = 10

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 2
  const isAtLimit = !canUse && isSignedIn

  const tabs = [
    { id: 'basic', name: 'Language Setup', icon: Languages, proOnly: false },
    { id: 'advanced', name: 'Advanced Options', icon: Settings, proOnly: true }
  ]

  // Common language codes
  const languageCodes = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'tr', name: 'Turkish' },
    { code: 'pl', name: 'Polish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'da', name: 'Danish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'cs', name: 'Czech' },
    { code: 'sk', name: 'Slovak' },
    { code: 'hr', name: 'Croatian' },
    { code: 'ro', name: 'Romanian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'he', name: 'Hebrew' },
    { code: 'th', name: 'Thai' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ms', name: 'Malay' },
    { code: 'tl', name: 'Filipino' }
  ]

  // Common region codes
  const regionCodes = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'AT', name: 'Austria' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'AR', name: 'Argentina' },
    { code: 'RU', name: 'Russia' },
    { code: 'TR', name: 'Turkey' },
    { code: 'PL', name: 'Poland' },
    { code: 'SE', name: 'Sweden' },
    { code: 'DK', name: 'Denmark' },
    { code: 'NO', name: 'Norway' },
    { code: 'FI', name: 'Finland' }
  ]

  useEffect(() => {
    generateHreflangTags()
  }, [formData])

  const generateHreflangTags = () => {
    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    // Check page limit for free users
    if (!user?.isPro && formData.pages.length > FREE_PAGE_LIMIT) {
      setShowUpgradePrompt(true)
      return
    }

    let output = []
    const validPages = formData.pages.filter(page => page.url.trim() && page.language.trim())

    if (validPages.length === 0) {
      setGeneratedOutput('')
      return
    }

    if (formData.includeHtml) {
      output.push('<!-- HTML <head> hreflang tags -->')
      
      validPages.forEach(page => {
        const fullUrl = normalizeUrl(page.url)
        const hreflangCode = page.region ? `${page.language}-${page.region}` : page.language
        output.push(`<link rel="alternate" hreflang="${hreflangCode}" href="${fullUrl}" />`)
      })

      // Add x-default if enabled
      if (formData.includeXDefault && validPages.length > 0) {
        const defaultPage = validPages.find(p => p.language === 'en') || validPages[0]
        const defaultUrl = normalizeUrl(defaultPage.url)
        output.push(`<link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`)
      }
      
      output.push('')
    }

    if (user?.isPro && formData.includeXmlSitemap) {
      output.push('<!-- XML Sitemap hreflang implementation -->')
      output.push('<url>')
      validPages.forEach(page => {
        const fullUrl = normalizeUrl(page.url)
        const hreflangCode = page.region ? `${page.language}-${page.region}` : page.language
        output.push(`  <xhtml:link rel="alternate" hreflang="${hreflangCode}" href="${fullUrl}" />`)
      })
      
      if (formData.includeXDefault && validPages.length > 0) {
        const defaultPage = validPages.find(p => p.language === 'en') || validPages[0]
        const defaultUrl = normalizeUrl(defaultPage.url)
        output.push(`  <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`)
      }
      
      output.push('</url>')
      output.push('')
    }

    if (user?.isPro && formData.includeHttpHeader) {
      output.push('<!-- HTTP Header hreflang implementation -->')
      const linkHeaders = []
      
      validPages.forEach(page => {
        const fullUrl = normalizeUrl(page.url)
        const hreflangCode = page.region ? `${page.language}-${page.region}` : page.language
        linkHeaders.push(`<${fullUrl}>; rel="alternate"; hreflang="${hreflangCode}"`)
      })

      if (formData.includeXDefault && validPages.length > 0) {
        const defaultPage = validPages.find(p => p.language === 'en') || validPages[0]
        const defaultUrl = normalizeUrl(defaultPage.url)
        linkHeaders.push(`<${defaultUrl}>; rel="alternate"; hreflang="x-default"`)
      }

      output.push(`Link: ${linkHeaders.join(', ')}`)
      output.push('')
    }

    // Add implementation notes
    output.push('<!-- Implementation Notes -->')
    output.push('<!-- 1. Place hreflang tags in the <head> section of each language version -->')
    output.push('<!-- 2. Each page should reference all language versions including itself -->')
    output.push('<!-- 3. Use absolute URLs for better compatibility -->')
    output.push('<!-- 4. Ensure all referenced pages return 200 status codes -->')
    output.push('<!-- 5. x-default should point to the default/fallback version -->')

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
    
    // If we have a base URL set, use it
    if (formData.baseUrl) {
      const baseUrl = formData.baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
      return `https://${baseUrl}${url.startsWith('/') ? url : '/' + url}`
    }
    
    // If URL starts with /, assume it's a path
    if (url.startsWith('/')) {
      return `https://yourwebsite.com${url}`
    }
    
    // Otherwise, assume it's a full domain
    return `https://${url}`
  }

  const addPage = () => {
    if (!user?.isPro && formData.pages.length >= FREE_PAGE_LIMIT) {
      setShowUpgradePrompt(true)
      return
    }

    setFormData(prev => ({
      ...prev,
      pages: [...prev.pages, { url: '', language: 'en', region: '', title: '' }]
    }))
  }

  const removePage = (index) => {
    if (formData.pages.length > 1) {
      setFormData(prev => ({
        ...prev,
        pages: prev.pages.filter((_, i) => i !== index)
      }))
    }
  }

  const updatePage = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      pages: prev.pages.map((page, i) => 
        i === index ? { ...page, [field]: value } : page
      )
    }))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedOutput)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadHreflang = () => {
    const blob = new Blob([generatedOutput], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hreflang-tags.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    setFormData({
      ...formData,
      pages: [
        { url: 'https://yourwebsite.com/', language: 'en', region: 'US', title: 'Homepage (English - US)' },
        { url: 'https://yourwebsite.com/es/', language: 'es', region: 'ES', title: 'Página de inicio (Español - España)' },
        { url: 'https://yourwebsite.com/es-mx/', language: 'es', region: 'MX', title: 'Página de inicio (Español - México)' },
        { url: 'https://yourwebsite.com/fr/', language: 'fr', region: 'FR', title: 'Page d\'accueil (Français)' },
        { url: 'https://yourwebsite.com/de/', language: 'de', region: 'DE', title: 'Startseite (Deutsch)' }
      ],
      baseUrl: 'https://yourwebsite.com'
    })
  }

  const clearAll = () => {
    setFormData({
      pages: [{ url: '', language: 'en', region: '', title: '' }],
      includeXDefault: true,
      includeHtml: true,
      includeXmlSitemap: false,
      includeHttpHeader: false,
      baseUrl: ''
    })
    setGeneratedOutput('')
  }

  const validateHreflang = () => {
    if (!user?.isPro) return []
    
    const issues = []
    const languageMap = new Map()
    
    formData.pages.forEach((page, index) => {
      if (!page.url.trim() || !page.language.trim()) return
      
      const hreflangCode = page.region ? `${page.language}-${page.region}` : page.language
      
      // Check for duplicates
      if (languageMap.has(hreflangCode)) {
        issues.push({
          type: 'duplicate',
          message: `Duplicate hreflang code "${hreflangCode}" found`,
          pageIndex: index
        })
      } else {
        languageMap.set(hreflangCode, index)
      }
      
      // Check URL format
      if (!page.url.includes('://') && !page.url.startsWith('/')) {
        issues.push({
          type: 'url',
          message: `Page ${index + 1}: URL should be absolute or start with /`,
          pageIndex: index
        })
      }
    })
    
    return issues
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
            Unlimited generations • Advanced formats • Pro Plan
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
          </span> generations • <span className="font-medium">{formData.pages.length}/{FREE_PAGE_LIMIT}</span> pages
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
            {/* Base URL Setting */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Base URL (Optional)
              </label>
              <input
                type="url"
                value={formData.baseUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                placeholder="https://yourwebsite.com"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <div className="text-xs text-slate-500 mt-1">
                Used to convert relative URLs to absolute URLs
              </div>
            </div>

            {/* Language Pages */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-slate-700">
                  Language Versions {!user?.isPro && (
                    <span className="text-slate-500">({formData.pages.length}/{FREE_PAGE_LIMIT} max for free)</span>
                  )}
                </label>
                <button
                  onClick={addPage}
                  className="flex items-center text-sm text-sky-600 hover:text-sky-700 font-medium"
                  disabled={!user?.isPro && formData.pages.length >= FREE_PAGE_LIMIT}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Language
                </button>
              </div>

              <div className="space-y-4">
                {formData.pages.map((page, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          Language *
                        </label>
                        <select
                          value={page.language}
                          onChange={(e) => updatePage(index, 'language', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                        >
                          {languageCodes.map(lang => (
                            <option key={lang.code} value={lang.code}>
                              {lang.code} - {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          Region (Optional)
                        </label>
                        <select
                          value={page.region}
                          onChange={(e) => updatePage(index, 'region', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                        >
                          <option value="">No region</option>
                          {regionCodes.map(region => (
                            <option key={region.code} value={region.code}>
                              {region.code} - {region.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          Hreflang Code
                        </label>
                        <div className="p-2 bg-slate-50 border border-slate-200 rounded text-sm font-mono">
                          {page.region ? `${page.language}-${page.region}` : page.language}
                        </div>
                      </div>

                      <div className="flex items-end">
                        {formData.pages.length > 1 && (
                          <button
                            onClick={() => removePage(index)}
                            className="text-red-500 hover:text-red-700 p-2 mb-1"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          URL *
                        </label>
                        <input
                          type="text"
                          value={page.url}
                          onChange={(e) => updatePage(index, 'url', e.target.value)}
                          placeholder="/es/ or https://yourwebsite.com/es/"
                          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          Page Title (for reference)
                        </label>
                        <input
                          type="text"
                          value={page.title}
                          onChange={(e) => updatePage(index, 'title', e.target.value)}
                          placeholder="Page description"
                          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                        />
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
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeXDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeXDefault: e.target.checked }))}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Include x-default fallback</span>
                </label>

                {user?.isPro && (
                  <>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.includeXmlSitemap}
                        onChange={(e) => setFormData(prev => ({ ...prev, includeXmlSitemap: e.target.checked }))}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="ml-2 text-sm text-slate-700">Generate XML Sitemap format (Pro)</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.includeHttpHeader}
                        onChange={(e) => setFormData(prev => ({ ...prev, includeHttpHeader: e.target.checked }))}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="ml-2 text-sm text-slate-700">Generate HTTP Header format (Pro)</span>
                    </label>
                  </>
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
                Advanced hreflang features including validation, XML sitemap integration, and HTTP headers are available with Pro subscription.
              </p>
              <Link href="/pricing" className="btn btn-primary">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Link>
            </div>
          )
        }

        const validationIssues = validateHreflang()

        return (
          <div className="space-y-6">
            {/* Validation Results */}
            <div>
              <h4 className="font-medium text-slate-700 mb-3">Hreflang Validation</h4>
              {validationIssues.length > 0 ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="font-medium text-orange-800">Found {validationIssues.length} issues</span>
                  </div>
                  <div className="space-y-1 text-sm text-orange-700">
                    {validationIssues.map((issue, i) => (
                      <div key={i}>• {issue.message}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-green-800">No validation issues found</span>
                  </div>
                </div>
              )}
            </div>

            {/* Language Coverage */}
            <div>
              <h4 className="font-medium text-slate-700 mb-3">Language Coverage</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {formData.pages.map((page, index) => {
                  if (!page.language.trim()) return null
                  
                  const hreflangCode = page.region ? `${page.language}-${page.region}` : page.language
                  const language = languageCodes.find(l => l.code === page.language)
                  const region = page.region ? regionCodes.find(r => r.code === page.region) : null
                  
                  return (
                    <div key={index} className="flex items-center p-2 bg-slate-50 rounded">
                      <Globe className="w-3 h-3 text-slate-400 mr-2" />
                      <span className="font-mono text-xs mr-2">{hreflangCode}</span>
                      <span className="text-slate-600 truncate">
                        {language?.name}{region ? ` (${region.name})` : ''}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pro Features Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Pro Features Active</h4>
              <div className="text-blue-800 text-sm space-y-1">
                <div>✓ Unlimited language versions</div>
                <div>✓ Validation and duplicate detection</div>
                <div>✓ XML Sitemap hreflang format</div>
                <div>✓ HTTP Header implementation</div>
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
              Hreflang Generator
              {user?.isPro && (
                <span className="ml-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Pro
                </span>
              )}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Generate international SEO hreflang tags for multi-language and multi-regional websites. Improve global search visibility and user experience.
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
                  You've used all {FREE_USAGE_LIMIT} hreflang generations for today. Upgrade to Pro for unlimited usage and advanced features.
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
                  ? `You've reached the daily limit of ${FREE_USAGE_LIMIT} generations or the ${FREE_PAGE_LIMIT} page limit for free users.`
                  : `Sign up to get ${FREE_USAGE_LIMIT} daily generations with up to ${FREE_PAGE_LIMIT} pages each, or upgrade to Pro for unlimited usage.`
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
                <h3 className="text-lg font-semibold text-slate-900">Hreflang Configuration</h3>
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
                <h3 className="text-lg font-semibold text-slate-900">Generated Hreflang Tags</h3>
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
                      onClick={downloadHreflang}
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
                placeholder="Configure your language versions above to generate hreflang tags..."
                className="w-full h-96 p-4 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50 resize-none"
              />
            </div>

            {/* SEO Benefits */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Hreflang Benefits</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Proper international targeting:</strong> Show correct language/region to users
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Prevent duplicate content:</strong> Avoid penalties from similar multi-language pages
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Improve user experience:</strong> Serve appropriate language/region content
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Better search rankings:</strong> Enhanced visibility in local search results
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
                      Get unlimited hreflang generation, validation tools, XML sitemap integration, and HTTP header formats.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited generations
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited pages
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Validation tools
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        XML & HTTP formats
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

export default HreflangGeneratorTool