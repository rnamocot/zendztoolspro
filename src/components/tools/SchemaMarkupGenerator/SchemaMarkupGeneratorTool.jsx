'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  Copy, 
  Download, 
  Database,
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
  Code,
  Star,
  Building,
  ShoppingBag,
  Calendar,
  User,
  MapPin,
  BookOpen
} from 'lucide-react'

const SchemaMarkupGeneratorTool = () => {
  // Real auth integration
  const { 
    user, 
    isSignedIn,
    updateUsage, 
    canUseTool, 
    getRemainingUsage 
  } = useAuth()

  const [activeSchemaType, setActiveSchemaType] = useState('Article')
  const [formData, setFormData] = useState({})
  const [generatedSchema, setGeneratedSchema] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Tool configuration
  const TOOL_ID = 'schema-markup-generator'
  const FREE_USAGE_LIMIT = 10

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 2
  const isAtLimit = !canUse && isSignedIn

  // Schema types
  const schemaTypes = [
    { id: 'Article', name: 'Article', icon: FileText, proOnly: false, description: 'News, blog posts, articles' },
    { id: 'LocalBusiness', name: 'Local Business', icon: Building, proOnly: false, description: 'Local business information' },
    { id: 'Product', name: 'Product', icon: ShoppingBag, proOnly: true, description: 'E-commerce products' },
    { id: 'Event', name: 'Event', icon: Calendar, proOnly: true, description: 'Events and performances' },
    { id: 'Person', name: 'Person', icon: User, proOnly: true, description: 'Person or professional profile' },
    { id: 'Organization', name: 'Organization', icon: Building, proOnly: true, description: 'Companies and organizations' },
    { id: 'Review', name: 'Review', icon: Star, proOnly: true, description: 'Product or service reviews' },
    { id: 'Recipe', name: 'Recipe', icon: BookOpen, proOnly: true, description: 'Cooking recipes' }
  ]

  // Schema field definitions
  const schemaFields = {
    Article: [
      { key: 'headline', label: 'Headline *', type: 'text', required: true, placeholder: 'Article title' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of the article' },
      { key: 'author', label: 'Author Name *', type: 'text', required: true, placeholder: 'John Doe' },
      { key: 'datePublished', label: 'Publication Date *', type: 'date', required: true },
      { key: 'dateModified', label: 'Modified Date', type: 'date' },
      { key: 'publisher', label: 'Publisher *', type: 'text', required: true, placeholder: 'Website name' },
      { key: 'url', label: 'Article URL', type: 'url', placeholder: 'https://example.com/article' },
      { key: 'image', label: 'Featured Image URL', type: 'url', placeholder: 'https://example.com/image.jpg' }
    ],
    LocalBusiness: [
      { key: 'name', label: 'Business Name *', type: 'text', required: true, placeholder: 'Your Business Name' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of your business' },
      { key: 'address', label: 'Street Address *', type: 'text', required: true, placeholder: '123 Main St' },
      { key: 'city', label: 'City *', type: 'text', required: true, placeholder: 'New York' },
      { key: 'state', label: 'State/Region *', type: 'text', required: true, placeholder: 'NY' },
      { key: 'postalCode', label: 'Postal Code *', type: 'text', required: true, placeholder: '10001' },
      { key: 'country', label: 'Country *', type: 'text', required: true, placeholder: 'United States' },
      { key: 'telephone', label: 'Phone Number', type: 'tel', placeholder: '+1-555-123-4567' },
      { key: 'email', label: 'Email', type: 'email', placeholder: 'contact@business.com' },
      { key: 'url', label: 'Website URL', type: 'url', placeholder: 'https://yourbusiness.com' },
      { key: 'openingHours', label: 'Opening Hours', type: 'text', placeholder: 'Mo-Fr 09:00-17:00' },
      { key: 'priceRange', label: 'Price Range', type: 'text', placeholder: '$$' }
    ],
    Product: [
      { key: 'name', label: 'Product Name *', type: 'text', required: true, placeholder: 'Amazing Product' },
      { key: 'description', label: 'Description *', type: 'textarea', required: true, placeholder: 'Product description' },
      { key: 'brand', label: 'Brand', type: 'text', placeholder: 'Brand Name' },
      { key: 'sku', label: 'SKU', type: 'text', placeholder: 'PROD-123' },
      { key: 'price', label: 'Price *', type: 'number', required: true, placeholder: '99.99' },
      { key: 'currency', label: 'Currency *', type: 'text', required: true, placeholder: 'USD' },
      { key: 'availability', label: 'Availability', type: 'select', options: ['InStock', 'OutOfStock', 'PreOrder'], placeholder: 'InStock' },
      { key: 'image', label: 'Product Image URL', type: 'url', placeholder: 'https://example.com/product.jpg' },
      { key: 'url', label: 'Product URL', type: 'url', placeholder: 'https://example.com/product' }
    ]
  }

  const generateSchema = () => {
    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    const fields = schemaFields[activeSchemaType] || []
    const requiredFields = fields.filter(field => field.required)
    const missingRequired = requiredFields.filter(field => !formData[field.key]?.trim())

    if (missingRequired.length > 0) {
      alert(`Please fill in required fields: ${missingRequired.map(f => f.label).join(', ')}`)
      return
    }

    let schema = {
      "@context": "https://schema.org",
      "@type": activeSchemaType
    }

    // Generate schema based on type
    switch (activeSchemaType) {
      case 'Article':
        schema = {
          ...schema,
          headline: formData.headline,
          description: formData.description || undefined,
          author: {
            "@type": "Person",
            name: formData.author
          },
          publisher: {
            "@type": "Organization",
            name: formData.publisher
          },
          datePublished: formData.datePublished,
          dateModified: formData.dateModified || formData.datePublished,
          url: formData.url || undefined,
          image: formData.image || undefined
        }
        break

      case 'LocalBusiness':
        schema = {
          ...schema,
          name: formData.name,
          description: formData.description || undefined,
          address: {
            "@type": "PostalAddress",
            streetAddress: formData.address,
            addressLocality: formData.city,
            addressRegion: formData.state,
            postalCode: formData.postalCode,
            addressCountry: formData.country
          },
          telephone: formData.telephone || undefined,
          email: formData.email || undefined,
          url: formData.url || undefined,
          openingHours: formData.openingHours || undefined,
          priceRange: formData.priceRange || undefined
        }
        break

      case 'Product':
        schema = {
          ...schema,
          name: formData.name,
          description: formData.description,
          brand: formData.brand ? {
            "@type": "Brand",
            name: formData.brand
          } : undefined,
          sku: formData.sku || undefined,
          offers: {
            "@type": "Offer",
            price: formData.price,
            priceCurrency: formData.currency,
            availability: `https://schema.org/${formData.availability || 'InStock'}`
          },
          image: formData.image || undefined,
          url: formData.url || undefined
        }
        break
    }

    // Remove undefined fields
    const cleanSchema = JSON.parse(JSON.stringify(schema, (key, value) => value === undefined ? undefined : value))
    
    setGeneratedSchema(JSON.stringify(cleanSchema, null, 2))
    
    // Update usage count
    updateUsage(TOOL_ID)
  }

  useEffect(() => {
    // Reset form data when schema type changes
    setFormData({})
    setGeneratedSchema('')
  }, [activeSchemaType])

  useEffect(() => {
    // Auto-generate when form data changes (with debounce)
    const timeoutId = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        generateSchema()
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [formData])

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSchema)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadSchema = () => {
    const blob = new Blob([generatedSchema], { type: 'application/ld+json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeSchemaType.toLowerCase()}-schema.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSample = () => {
    switch (activeSchemaType) {
      case 'Article':
        setFormData({
          headline: 'How to Optimize Your Website for Search Engines',
          description: 'A comprehensive guide to SEO best practices and techniques for improving your website\'s search engine visibility.',
          author: 'John Doe',
          datePublished: '2024-01-15',
          dateModified: '2024-01-20',
          publisher: 'SEO Blog',
          url: 'https://example.com/seo-guide',
          image: 'https://example.com/images/seo-guide.jpg'
        })
        break
      
      case 'LocalBusiness':
        setFormData({
          name: 'Best Coffee Shop',
          description: 'Premium coffee and pastries in the heart of downtown',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'United States',
          telephone: '+1-555-123-4567',
          email: 'hello@bestcoffee.com',
          url: 'https://bestcoffee.com',
          openingHours: 'Mo-Fr 07:00-19:00, Sa-Su 08:00-17:00',
          priceRange: '$$'
        })
        break

      case 'Product':
        setFormData({
          name: 'Premium Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life',
          brand: 'AudioTech',
          sku: 'WH-1000XM5',
          price: '299.99',
          currency: 'USD',
          availability: 'InStock',
          image: 'https://example.com/headphones.jpg',
          url: 'https://example.com/products/wireless-headphones'
        })
        break
    }
  }

  const clearAll = () => {
    setFormData({})
    setGeneratedSchema('')
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
            Unlimited schemas • All types • Pro Plan
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
          </span> schemas today
          {isNearLimit && (
            <span className="ml-2 text-orange-600">• Almost at limit!</span>
          )}
        </span>
      </div>
    )
  }

  const renderFormFields = () => {
    const fields = schemaFields[activeSchemaType] || []
    
    return (
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full h-20 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            ) : field.type === 'select' ? (
              <select
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Select...</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            )}
          </div>
        ))}
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
              Schema Markup Generator
              {user?.isPro && (
                <span className="ml-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Pro
                </span>
              )}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Generate structured data markup for better search engine understanding. Create JSON-LD schema for articles, businesses, products, and more.
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
                  You've used all {FREE_USAGE_LIMIT} schema generations for today. Upgrade to Pro for unlimited usage and access to all schema types.
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
                  ? `You've used all ${FREE_USAGE_LIMIT} schema generations for today.`
                  : `Sign up to get ${FREE_USAGE_LIMIT} daily schema generations, or upgrade to Pro for unlimited usage and all schema types.`
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
            {/* Schema Type Selection */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Schema Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schemaTypes.map((type) => {
                  const isLocked = type.proOnly && !user?.isPro
                  const isActive = activeSchemaType === type.id
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => !isLocked ? setActiveSchemaType(type.id) : null}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        isLocked
                          ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                          : isActive
                          ? 'border-sky-500 bg-sky-50 text-sky-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <type.icon className="w-4 h-4 mr-2" />
                          <span className="font-medium">{type.name}</span>
                        </div>
                        {isLocked && (
                          <Lock className="w-3 h-3 text-purple-500" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{type.description}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Schema Form */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  {activeSchemaType} Schema Details
                </h3>
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

              {renderFormFields()}
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Generated Schema</h3>
                {generatedSchema && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadSchema}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                )}
              </div>

              <textarea
                value={generatedSchema}
                readOnly
                placeholder="Fill in the form fields to generate your schema markup..."
                className="w-full h-96 p-4 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50 resize-none"
              />
              
              {generatedSchema && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Implementation Instructions</h4>
                  <div className="text-sm text-blue-800">
                    Add this JSON-LD script to your HTML <code>&lt;head&gt;</code> section:
                    <code className="block mt-2 p-2 bg-blue-100 rounded text-xs">
                      &lt;script type="application/ld+json"&gt;<br/>
                      {/* Schema content here */}<br/>
                      &lt;/script&gt;
                    </code>
                  </div>
                </div>
              )}
            </div>

            {/* Schema Benefits */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Schema Markup Benefits</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Rich snippets:</strong> Enhanced search results with additional information
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Better CTR:</strong> More attractive and informative search listings
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Voice search:</strong> Improved visibility for voice and AI search queries
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
                  <div>
                    <strong>Knowledge panels:</strong> Potential inclusion in Google Knowledge Graph
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
                      Unlock Pro Schema Types
                    </h3>
                    <div className="text-slate-600 mb-4">
                      Get unlimited schema generation and access to all schema types including Product, Event, Person, and more.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited generations
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        All schema types
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Advanced validation
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Bulk generation
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

export default SchemaMarkupGeneratorTool