'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Headphones,
  Mail,
  MessageCircle,
  Book,
  Search,
  Clock,
  Check,
  Crown,
  Zap,
  AlertCircle,
  HelpCircle,
  Send,
  ExternalLink,
  Users,
  FileText,
  Bug,
  Lightbulb,
  Star,
  Globe,
  Shield,
  ChevronRight,
  Phone,
  Video,
  Download
} from 'lucide-react'

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    priority: 'normal',
    message: ''
  })

  const supportChannels = [
    {
      title: 'Priority Email Support',
      icon: Mail,
      description: 'Get direct help from our support team',
      responseTime: 'Within 4 hours',
      availability: 'Pro users only',
      isPro: true,
      action: 'Send Email',
      details: ['Dedicated support queue', 'Detailed troubleshooting', 'Feature guidance']
    },
    {
      title: 'Community Support',
      icon: Users,
      description: 'Get help from our user community',
      responseTime: 'Community driven',
      availability: 'All users',
      isPro: false,
      action: 'Join Community',
      details: ['User discussions', 'Shared solutions', 'Tool tips & tricks']
    },
    {
      title: 'Knowledge Base',
      icon: Book,
      description: 'Browse our comprehensive guides',
      responseTime: 'Instant access',
      availability: 'All users',
      isPro: false,
      action: 'Browse Guides',
      details: ['Step-by-step tutorials', 'Video guides', 'Best practices']
    },
    {
      title: 'Live Chat',
      icon: MessageCircle,
      description: 'Real-time chat with support team',
      responseTime: 'Instant',
      availability: 'Pro users only',
      isPro: true,
      action: 'Start Chat',
      details: ['Immediate assistance', 'Screen sharing', 'Technical guidance']
    }
  ]

  const faqCategories = [
    {
      title: 'Account & Billing',
      questions: [
        {
          q: 'How do I upgrade to Pro?',
          a: 'Click the "Upgrade to Pro" button in any tool or visit our pricing page. You can pay monthly ($2) or annually ($18) with all major credit cards or PayPal.'
        },
        {
          q: 'Can I cancel my Pro subscription anytime?',
          a: 'Yes! You can cancel anytime from your account settings. Your Pro features remain active until the end of your billing period, then you\'ll automatically return to the free plan.'
        },
        {
          q: 'Do you offer refunds?',
          a: 'We offer a 30-day money-back guarantee for all Pro subscriptions. Contact our support team if you\'re not satisfied.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal for secure payments.'
        }
      ]
    },
    {
      title: 'Tools & Features',
      questions: [
        {
          q: 'What\'s the difference between Free and Pro?',
          a: 'Free users get basic functionality with daily usage limits. Pro users get unlimited usage, advanced features, custom options, batch processing, and priority support.'
        },
        {
          q: 'Are there usage limits on free tools?',
          a: 'Yes, free users have daily limits per tool (typically 10 uses per day). Pro users have unlimited usage across all tools.'
        },
        {
          q: 'Can I use the tools for commercial projects?',
          a: 'Commercial use requires a Pro subscription. Free users can only use tools for personal, non-commercial purposes.'
        },
        {
          q: 'Do tools work offline?',
          a: 'Most tools work in your browser without internet, but some features like URL validation or external data fetching require an internet connection.'
        }
      ]
    },
    {
      title: 'Technical Support',
      questions: [
        {
          q: 'Why isn\'t a tool working properly?',
          a: 'First, try refreshing the page and clearing your browser cache. Ensure you\'re using a modern browser (Chrome, Firefox, Safari, Edge). If issues persist, contact support.'
        },
        {
          q: 'What browsers are supported?',
          a: 'All modern browsers are supported: Chrome, Firefox, Safari, Edge. We recommend keeping your browser updated for the best experience.'
        },
        {
          q: 'Can I request new tools or features?',
          a: 'Absolutely! We love hearing from users. Submit feature requests through our contact form or community forum. Pro users get priority consideration.'
        },
        {
          q: 'How do I report a bug?',
          a: 'Use our bug report form below or email support with details about the issue, including which tool, browser, and steps to reproduce the problem.'
        }
      ]
    }
  ]

  const quickLinks = [
    { title: 'How to Use Guides', href: '/guides', icon: Book },
    { title: 'All Tools', href: '/tools', icon: Zap },
    { title: 'Pricing Plans', href: '/pricing', icon: Crown },
    { title: 'System Status', href: '/status', icon: Globe },
    { title: 'Privacy Policy', href: '/privacy', icon: Shield },
    { title: 'Terms of Service', href: '/terms', icon: FileText }
  ]

  const supportStats = [
    { label: 'Average Response Time', value: '< 4 hours', icon: Clock },
    { label: 'Customer Satisfaction', value: '98%', icon: Star },
    { label: 'Issues Resolved', value: '99.5%', icon: Check },
    { label: 'Tools Available', value: '75+', icon: Zap }
  ]

  const handleFormSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you! Your message has been sent. We\'ll get back to you soon.')
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h1 className="heading-1 text-gray-900 mb-6">
              Support Center
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Get help with our tools, find answers to common questions, or contact our support team. 
              We're here to help you succeed.
            </p>
            
            {/* Search Box */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, tools, or features..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
              />
            </div>
          </motion.div>
        </div>

        {/* Support Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {supportStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 text-center"
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Support Channels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How Can We Help You?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg ${
                  channel.isPro 
                    ? 'border-purple-200 ring-2 ring-purple-100' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {channel.isPro && (
                  <div className="flex items-center justify-end mb-2">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro Only
                    </span>
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  channel.isPro ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-primary'
                }`}>
                  <channel.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2">{channel.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{channel.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{channel.responseTime}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{channel.availability}</span>
                  </div>
                </div>
                
                <ul className="space-y-1 mb-4">
                  {channel.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                      <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`btn w-full btn-sm ${
                    channel.isPro ? 'btn-primary' : 'btn-secondary'
                  } ${channel.isPro && !true ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={channel.isPro && !true}
                >
                  {channel.action}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'contact'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contact Support
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'faq'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                FAQ
              </button>
            </div>

            {/* Contact Form */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="general">General Question</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing & Account</option>
                        <option value="feature">Feature Request</option>
                        <option value="bug">Bug Report</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                      placeholder="Please provide as much detail as possible..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                </form>
              </motion.div>
            )}

            {/* FAQ Section */}
            {activeTab === 'faq' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {faqCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="bg-white rounded-2xl p-8 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{category.title}</h3>
                    <div className="space-y-6">
                      {category.questions.map((faq, faqIndex) => (
                        <div key={faqIndex} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <HelpCircle className="w-5 h-5 text-primary-500 mr-2" />
                            {faq.q}
                          </h4>
                          <p className="text-gray-600 leading-relaxed pl-7">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <link.icon className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
                    <span className="text-gray-700 group-hover:text-primary-600">{link.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Pro Support CTA */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
              <div className="text-center">
                <Crown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Need Priority Support?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Upgrade to Pro for priority email support, live chat, and faster response times.
                </p>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Response within 4 hours
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Live chat support
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Dedicated support queue
                  </div>
                </div>
                <Link
                  href="/pricing"
                  className="btn btn-primary w-full btn-sm"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">All Tools</span>
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Operational
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Website</span>
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Operational
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Support</span>
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Operational
                  </div>
                </div>
              </div>
              <Link
                href="/status"
                className="btn btn-secondary w-full btn-sm mt-4"
              >
                View Status Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportPage