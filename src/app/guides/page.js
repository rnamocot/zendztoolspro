'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Book,
  Play,
  Check,
  Crown,
  Zap,
  Code2,
  TrendingUp,
  Target,
  Palette,
  Megaphone,
  QrCode,
  Hash,
  FileText,
  Tag,
  Crop,
  Calculator,
  Search,
  Key,
  Database,
  Download,
  Settings,
  Copy,
  Eye,
  ChevronRight,
  Star,
  Lightbulb,
  AlertCircle,
  Users,
  Clock
} from 'lucide-react'

const HowToUsePage = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started')

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: Play },
    { id: 'seo', name: 'SEO Tools', icon: TrendingUp },
    { id: 'developers', name: 'Developer Tools', icon: Code2 },
    { id: 'marketers', name: 'Marketing Tools', icon: Target },
    { id: 'designers', name: 'Design Tools', icon: Palette },
    { id: 'advertisers', name: 'Ad Tools', icon: Megaphone },
    { id: 'tips', name: 'Pro Tips', icon: Lightbulb },
  ]

  const gettingStartedGuides = [
    {
      title: 'Welcome to Zendz Tools',
      description: 'Learn the basics of our platform and how to get started',
      steps: [
        'Browse our 75+ professional tools',
        'Try any tool for free with basic features',
        'See your daily usage limits in the tool interface',
        'Upgrade to Pro for unlimited access and advanced features'
      ],
      tips: [
        'No account required to start using tools',
        'All tools work directly in your browser',
        'Pro features are clearly marked with crown icons'
      ]
    },
    {
      title: 'Free vs Pro Features',
      description: 'Understand the differences between our plan tiers',
      steps: [
        'Free: Limited daily usage per tool',
        'Free: Basic features and standard export options',
        'Pro: Unlimited usage across all tools',
        'Pro: Advanced features, custom options, and premium formats'
      ],
      tips: [
        'Try the free version first to test functionality',
        'Pro features unlock immediately after upgrade',
        'Commercial use requires Pro subscription'
      ]
    }
  ]

  const toolGuides = {
    seo: [
      {
        tool: 'Meta Tag Generator',
        icon: Tag,
        description: 'Create SEO-optimized meta tags for better search rankings',
        steps: [
          'Enter your page title (50-60 characters recommended)',
          'Write a compelling meta description (150-160 characters)',
          'Add relevant keywords naturally',
          'Generate and copy the HTML meta tags'
        ],
        proFeatures: ['Bulk generation for multiple pages', 'SEO scoring and suggestions', 'Character limit warnings'],
        tips: ['Include your main keyword in the title', 'Write descriptions that encourage clicks', 'Avoid keyword stuffing']
      },
      {
        tool: 'Schema Markup Generator',
        icon: Database,
        description: 'Generate structured data for rich search results',
        steps: [
          'Choose your schema type (Article, Product, etc.)',
          'Fill in the required properties',
          'Review the generated JSON-LD code',
          'Add the code to your website\'s <head> section'
        ],
        proFeatures: ['All schema types available', 'Validation and error checking', 'Bulk schema generation'],
        tips: ['Test your schema with Google\'s Rich Results Test', 'Use specific schema types for better results']
      }
    ],
    developers: [
      {
        tool: 'JSON Formatter',
        icon: Code2,
        description: 'Format, validate, and minify JSON data efficiently',
        steps: [
          'Paste your JSON data into the input field',
          'Click "Format" to prettify the JSON structure',
          'Use "Minify" to compress for production',
          'Copy the formatted result to clipboard'
        ],
        proFeatures: ['Schema validation', 'Error highlighting', 'Batch processing'],
        tips: ['Use the validator to catch syntax errors', 'Minified JSON reduces file size', 'Format before debugging']
      },
      {
        tool: 'Hash Generator',
        icon: Hash,
        description: 'Generate secure hashes for passwords and data integrity',
        steps: [
          'Enter the text you want to hash',
          'Select your preferred algorithm (MD5, SHA1, SHA256)',
          'Generate the hash instantly',
          'Copy the hash for your application'
        ],
        proFeatures: ['SHA512 and other algorithms', 'File hashing capability', 'HMAC generation'],
        tips: ['Use SHA256 or higher for security', 'MD5 is fast but not cryptographically secure', 'Save hashes securely']
      }
    ],
    marketers: [
      {
        tool: 'QR Code Generator',
        icon: QrCode,
        description: 'Create QR codes for marketing campaigns and promotions',
        steps: [
          'Choose your QR code type (URL, text, email, etc.)',
          'Enter your content or information',
          'Select size and error correction level',
          'Download as PNG for use in materials'
        ],
        proFeatures: ['Custom colors and branding', 'Logo embedding', 'Bulk QR code generation'],
        tips: ['Test QR codes before printing', 'Use high error correction for damaged codes', 'Include a call-to-action']
      },
      {
        tool: 'UTM Builder',
        icon: TrendingUp,
        description: 'Track campaign performance with UTM parameters',
        steps: [
          'Enter your destination URL',
          'Add campaign source (facebook, google, email)',
          'Specify medium (social, cpc, email)',
          'Include campaign name and content details'
        ],
        proFeatures: ['UTM templates', 'Bulk URL generation', 'Campaign tracking dashboard'],
        tips: ['Use consistent naming conventions', 'Track different content variations', 'Monitor in Google Analytics']
      }
    ],
    designers: [
      {
        tool: 'Color Palette Generator',
        icon: Palette,
        description: 'Create harmonious color schemes for your designs',
        steps: [
          'Enter a base color or upload an image',
          'Choose a color harmony rule (complementary, triadic, etc.)',
          'Adjust colors to match your vision',
          'Export palette in various formats'
        ],
        proFeatures: ['Advanced harmony algorithms', 'Accessibility checking', 'Custom export formats'],
        tips: ['Consider color accessibility', 'Test palettes in different contexts', 'Save successful combinations']
      },
      {
        tool: 'Image Compressor',
        icon: Crop,
        description: 'Optimize images for web without losing quality',
        steps: [
          'Upload your image (JPG, PNG, WebP)',
          'Choose compression level or file size target',
          'Preview the compressed result',
          'Download the optimized image'
        ],
        proFeatures: ['Batch compression', 'Advanced algorithms', 'Multiple format output'],
        tips: ['Balance file size and quality', 'Use WebP for modern browsers', 'Compress before uploading to web']
      }
    ],
    advertisers: [
      {
        tool: 'Ad Copy Generator',
        icon: Megaphone,
        description: 'Create compelling ad headlines and descriptions',
        steps: [
          'Enter your product or service details',
          'Specify your target audience',
          'Choose ad platform (Google, Facebook, etc.)',
          'Generate and refine multiple variations'
        ],
        proFeatures: ['AI-powered suggestions', 'A/B test variations', 'Performance scoring'],
        tips: ['Test multiple variations', 'Include emotional triggers', 'Match ad copy to landing page']
      },
      {
        tool: 'ROAS Calculator',
        icon: Calculator,
        description: 'Calculate return on ad spend for campaign optimization',
        steps: [
          'Enter your total ad spend',
          'Input revenue generated from ads',
          'Calculate ROAS percentage',
          'Analyze performance and optimize'
        ],
        proFeatures: ['Campaign tracking', 'Historical data analysis', 'Benchmark comparisons'],
        tips: ['Track ROAS by campaign', 'Include all advertising costs', 'Set ROAS targets by channel']
      }
    ]
  }

  const proTips = [
    {
      category: 'Efficiency',
      icon: Zap,
      tips: [
        'Bookmark frequently used tools for quick access',
        'Use keyboard shortcuts when available',
        'Pro users can process multiple items simultaneously',
        'Save time with bulk operations in Pro version'
      ]
    },
    {
      category: 'Best Practices',
      icon: Star,
      tips: [
        'Always test generated content before use',
        'Keep backups of important generated data',
        'Use appropriate error correction levels',
        'Validate output with relevant testing tools'
      ]
    },
    {
      category: 'Pro Features',
      icon: Crown,
      tips: [
        'Advanced settings provide more control',
        'Custom templates speed up repetitive tasks',
        'Priority support helps resolve issues quickly',
        'Commercial licensing protects business use'
      ]
    }
  ]

  const quickStart = [
    {
      step: 1,
      title: 'Choose Your Tool',
      description: 'Browse by category or search for specific functionality',
      icon: Search
    },
    {
      step: 2,
      title: 'Input Your Data',
      description: 'Enter text, upload files, or configure settings',
      icon: FileText
    },
    {
      step: 3,
      title: 'Generate Results',
      description: 'Click generate and get instant results',
      icon: Zap
    },
    {
      step: 4,
      title: 'Download or Copy',
      description: 'Export in your preferred format or copy to clipboard',
      icon: Download
    }
  ]

  const renderGuideContent = () => {
    switch (activeCategory) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            {/* Quick Start */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStart.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-primary-600 mb-2">Step {item.step}</div>
                    <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Getting Started Guides */}
            {gettingStartedGuides.map((guide, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{guide.title}</h3>
                <p className="text-gray-600 mb-6">{guide.description}</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Steps:</h4>
                    <ul className="space-y-2">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                            {stepIndex + 1}
                          </div>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Tips:</h4>
                    <ul className="space-y-2">
                      {guide.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-3">
                          <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'tips':
        return (
          <div className="space-y-8">
            {proTips.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{section.category}</h3>
                </div>
                <ul className="space-y-3">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )
      
      default:
        const guides = toolGuides[activeCategory] || []
        return (
          <div className="space-y-8">
            {guides.map((guide, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
                      <guide.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{guide.tool}</h3>
                      <p className="text-gray-600">{guide.description}</p>
                    </div>
                  </div>
                  <Link
                    href={`/tools/${guide.tool.toLowerCase().replace(/\s+/g, '-')}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Try Tool
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">How to Use:</h4>
                    <ul className="space-y-2">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                            {stepIndex + 1}
                          </div>
                          <span className="text-gray-700 text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Crown className="w-4 h-4 text-purple-500 mr-2" />
                      Pro Features:
                    </h4>
                    <ul className="space-y-2">
                      {guide.proFeatures.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Crown className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Pro Tips:</h4>
                    <ul className="space-y-2">
                      {guide.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-3">
                          <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center text-slate-600 hover:text-sky-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Book className="w-8 h-8 text-white" />
            </div>
            <h1 className="heading-1 text-gray-900 mb-6">
              How to Use Zendz Tools
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Master our 75+ professional tools with step-by-step guides, pro tips, and best practices. 
              Get the most out of every feature.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-sky-600 mb-2">75+</div>
            <div className="text-slate-600">Tools Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-slate-600">Step-by-Step Guides</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
            <div className="text-slate-600">Professional Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">100+</div>
            <div className="text-slate-600">Pro Tips & Tricks</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Guide Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? 'bg-primary-50 text-primary-600 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </nav>

              {/* Pro Upgrade CTA */}
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <div className="text-center">
                  <Crown className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">Need Pro Features?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Unlock unlimited usage and advanced features
                  </p>
                  <Link
                    href="/pricing"
                    className="btn btn-primary btn-sm w-full"
                  >
                    Upgrade to Pro
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderGuideContent()}
            </motion.div>

            {/* Support CTA */}
            <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200 text-center">
              <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Need More Help?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/support"
                  className="btn btn-primary"
                >
                  Contact Support
                </Link>
                <Link
                  href="/tools"
                  className="btn btn-secondary"
                >
                  Browse All Tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowToUsePage