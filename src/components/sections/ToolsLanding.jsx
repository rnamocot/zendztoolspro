'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter,
  Code2, 
  Key, 
  Hash, 
  QrCode, 
  FileText, 
  Clock, 
  Type, 
  Tag, 
  Database, 
  Fingerprint,
  ArrowRight,
  Star,
  Zap,
  Users,
  Globe,
  Image,
  Palette,
  Link as LinkIcon,
  Shield,
  Settings,
  ChevronRight,
  Crown
} from 'lucide-react'

const ToolsLanding = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTier, setSelectedTier] = useState('all')

  const categories = [
    { id: 'all', name: 'All Tools', icon: Settings, count: 13 },
    { id: 'data', name: 'Data & Format', icon: Database, count: 5 },
    { id: 'security', name: 'Security & Encoding', icon: Shield, count: 4 },
    { id: 'seo', name: 'SEO & Marketing', icon: Tag, count: 2 },
    { id: 'images', name: 'Images & Media', icon: Image, count: 2 },
  ]

  const tiers = [
    { id: 'all', name: 'All Tiers' },
    { id: 'free', name: 'Free Only' },
    { id: 'pro', name: 'Pro Only' },
    { id: 'freemium', name: 'Freemium' },
  ]

  const tools = [
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      description: 'Format, validate, and minify JSON data with syntax highlighting',
      icon: Code2,
      category: 'data',
      tier: 'freemium',
      status: 'available',
      popularity: 95,
      features: ['Format & prettify', 'Validate syntax', 'Minify JSON'],
      proFeatures: ['Schema validation', 'Batch processing', 'API access'],
      href: '/tools/json-formatter'
    },
    {
      id: 'password-generator',
      name: 'Password Generator',
      description: 'Generate secure passwords with customizable options',
      icon: Key,
      category: 'security',
      tier: 'freemium',
      status: 'available',
      popularity: 92,
      features: ['Custom length', 'Character types', 'Strength meter'],
      proFeatures: ['Bulk generation', 'Custom patterns', 'Pronounceable passwords'],
      href: '/tools/password-generator'
    },
    {
      id: 'hash-generator',
      name: 'Hash Generator',
      description: 'Generate MD5, SHA1, SHA256 hashes from text and files',
      icon: Hash,
      category: 'security',
      tier: 'freemium',
      status: 'available',
      popularity: 88,
      features: ['MD5 & SHA1', 'Text input', 'Copy results'],
      proFeatures: ['SHA256, SHA512', 'File hashing', 'HMAC generation'],
      href: '/tools/hash-generator'
    },
    {
      id: 'base64-encoder',
      name: 'Base64 Encoder',
      description: 'Encode and decode Base64 text and files',
      icon: FileText,
      category: 'data',
      tier: 'free',
      status: 'coming-soon',
      popularity: 85,
      features: ['Text encoding', 'Decode Base64', 'Copy to clipboard'],
      proFeatures: ['File upload', 'Batch processing', 'Multiple formats'],
      href: '/tools/base64-encoder'
    },
    {
      id: 'qr-generator',
      name: 'QR Code Generator',
      description: 'Create QR codes for URLs, text, and contact info',
      icon: QrCode,
      category: 'images',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 90,
      features: ['URL & text QR', 'Download PNG', 'Multiple sizes'],
      proFeatures: ['Custom colors', 'Logo embedding', 'Bulk generation'],
      href: '/tools/qr-generator'
    },
    {
      id: 'unix-timestamp',
      name: 'Unix Timestamp',
      description: 'Convert Unix timestamps to human-readable dates',
      icon: Clock,
      category: 'data',
      tier: 'free',
      status: 'coming-soon',
      popularity: 78,
      features: ['Timestamp conversion', 'Multiple timezones', 'Current time'],
      proFeatures: ['Batch conversion', 'Custom formats', 'API access'],
      href: '/tools/unix-timestamp'
    },
    {
      id: 'text-case',
      name: 'Text Case Converter',
      description: 'Convert text between different cases (upper, lower, title)',
      icon: Type,
      category: 'data',
      tier: 'free',
      status: 'coming-soon',
      popularity: 82,
      features: ['Multiple cases', 'Real-time preview', 'Copy results'],
      proFeatures: ['Custom patterns', 'Batch processing', 'RegEx support'],
      href: '/tools/text-case'
    },
    {
      id: 'meta-tags',
      name: 'Meta Tag Generator',
      description: 'Generate SEO meta tags for your website',
      icon: Tag,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 87,
      features: ['Basic meta tags', 'Open Graph', 'Twitter Cards'],
      proFeatures: ['Advanced templates', 'Bulk generation', 'Analytics'],
      href: '/tools/meta-tags'
    },
    {
      id: 'sql-formatter',
      name: 'SQL Formatter',
      description: 'Format and beautify SQL queries',
      icon: Database,
      category: 'data',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 80,
      features: ['Basic formatting', 'Syntax highlighting', 'Copy results'],
      proFeatures: ['Query optimization', 'Multiple dialects', 'Batch processing'],
      href: '/tools/sql-formatter'
    },
    {
      id: 'uuid-generator',
      name: 'UUID Generator',
      description: 'Generate unique UUIDs for your projects',
      icon: Fingerprint,
      category: 'security',
      tier: 'free',
      status: 'coming-soon',
      popularity: 75,
      features: ['UUID v4', 'Copy to clipboard', 'Multiple UUIDs'],
      proFeatures: ['Custom versions', 'Bulk generation', 'API access'],
      href: '/tools/uuid-generator'
    },
    {
      id: 'color-converter',
      name: 'Color Converter',
      description: 'Convert colors between HEX, RGB, HSL formats',
      icon: Palette,
      category: 'images',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 83,
      features: ['Color picker', 'Multiple formats', 'Preview'],
      proFeatures: ['Palette generation', 'Color harmony', 'Export formats'],
      href: '/tools/color-converter'
    },
    {
      id: 'url-encoder',
      name: 'URL Encoder',
      description: 'Encode and decode URLs for web development',
      icon: LinkIcon,
      category: 'data',
      tier: 'free',
      status: 'coming-soon',
      popularity: 77,
      features: ['URL encoding', 'Component encoding', 'Real-time'],
      proFeatures: ['Batch processing', 'Custom encoding', 'API access'],
      href: '/tools/url-encoder'
    },
    {
      id: 'website-analyzer',
      name: 'Website Analyzer',
      description: 'Analyze website performance and SEO metrics',
      icon: Globe,
      category: 'seo',
      tier: 'pro',
      status: 'coming-soon',
      popularity: 94,
      features: [],
      proFeatures: ['Performance analysis', 'SEO audit', 'Core Web Vitals', 'Detailed reports'],
      href: '/tools/website-analyzer'
    },
  ]

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
      const matchesTier = selectedTier === 'all' || tool.tier === selectedTier
      
      return matchesSearch && matchesCategory && matchesTier
    })
  }, [searchTerm, selectedCategory, selectedTier])

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'free':
        return <span className="badge badge-free">FREE</span>
      case 'pro':
        return <span className="badge badge-pro">PRO</span>
      case 'freemium':
        return <span className="badge badge-freemium">FREEMIUM</span>
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Available</span>
      case 'coming-soon':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Coming Soon</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-2 text-slate-900 mb-4">
            Developer Tools Collection
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Essential online tools for developers, designers, and SEO specialists. 
            All tools work instantly in your browser with no downloads required.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-sky-600 mb-2">{tools.length}</div>
            <div className="text-slate-600">Total Tools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{tools.filter(t => t.tier === 'free').length}</div>
            <div className="text-slate-600">Free Tools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{tools.filter(t => t.status === 'available').length}</div>
            <div className="text-slate-600">Available Now</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <div className="text-slate-600">API Endpoints</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Tier Filter */}
            <div>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                {tiers.map(tier => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-slate-600">
            Showing {filteredTools.length} of {tools.length} tools
          </div>
          
          <Link
            href="/pricing"
            className="btn btn-pro btn-sm"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Link>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 ${
                tool.tier === 'pro' ? 'ring-2 ring-purple-200' : ''
              }`}
            >
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tool.tier === 'pro' 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                      : 'bg-gradient-primary'
                  }`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{tool.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getTierBadge(tool.tier)}
                      {getStatusBadge(tool.status)}
                    </div>
                  </div>
                </div>
                
                {/* Popularity Score */}
                <div className="text-right">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{tool.popularity}</span>
                  </div>
                  <div className="text-xs text-slate-500">popularity</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 mb-4 line-clamp-2">
                {tool.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <div className="text-sm font-medium text-slate-900 mb-2">Features:</div>
                <div className="space-y-1">
                  {tool.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                  {tool.proFeatures.length > 0 && (
                    <div className="flex items-center text-sm text-slate-400">
                      <Crown className="w-3 h-3 mr-2 text-purple-500" />
                      +{tool.proFeatures.length} Pro features
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {tool.status === 'available' ? (
                <Link
                  href={tool.href}
                  className="btn btn-primary w-full group"
                >
                  <span>Use Tool</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  disabled
                  className="btn w-full bg-slate-100 text-slate-500 cursor-not-allowed"
                >
                  Coming Soon
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No tools found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedTier('all')
              }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pro CTA */}
        <div className="mt-16 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready for Pro Features?
            </h3>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              Unlock unlimited usage, advanced features, batch processing, and API access. 
              Perfect for professional developers and teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="btn btn-primary btn-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                View Pro Features
              </Link>
              <Link
                href="/pricing#faq"
                className="btn btn-outline-dark btn-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolsLanding