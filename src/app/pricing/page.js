'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Check, 
  Star, 
  Zap, 
  Users, 
  Crown, 
  Shield,
  Infinity,
  Globe,
  Headphones,
  Code,
  BarChart3,
  Settings,
  Palette,
  Download,
  ArrowLeft,
  X,
  TrendingUp,
  Target,
  Megaphone,
  Code2,
  Hash,
  QrCode,
  Calculator,
  Eye,
  Search,
  Crop
} from 'lucide-react'

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for trying out our tools',
      icon: Star,
      color: 'from-gray-500 to-gray-600',
      features: [
        '75+ essential tools',
        'Basic functionality',
        'Limited usage per day',
        'Standard features only',
        'Community support',
        'Personal use',
        'Basic export options'
      ],
      limitations: [
        'Usage limits per tool',
        'Basic features only',
        'No premium options'
      ],
      cta: 'Get Started',
      ctaStyle: 'btn-secondary',
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 2, annual: 18 },
      description: 'For professionals and power users',
      icon: Zap,
      color: 'from-primary-500 to-primary-600',
      features: [
        'Everything in Free',
        '75+ professional tools',
        'Unlimited usage',
        'All advanced features',
        'Premium options',
        'Custom colors & styles',
        'Batch processing',
        'Priority email support',
        'Commercial use',
        'All export formats',
        'No watermarks',
        'Advanced settings',
        'Premium templates'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      ctaStyle: 'btn-primary',
      popular: true,
      badge: 'Most Popular'
    }
  ]

  const comparisonFeatures = [
    {
      category: 'Usage & Limits',
      features: [
        { name: 'Daily usage limit', free: '10 uses per tool', pro: 'Unlimited' },
        { name: 'File size limit', free: '5MB max', pro: 'No limits' },
        { name: 'Batch processing', free: '1 item at a time', pro: 'Bulk operations' },
        { name: 'Export formats', free: 'Basic formats', pro: 'All formats' },
      ]
    },
    {
      category: 'Features & Customization',
      features: [
        { name: 'Advanced features', free: false, pro: true },
        { name: 'Custom colors & styles', free: false, pro: true },
        { name: 'Premium templates', free: false, pro: true },
        { name: 'Watermark removal', free: false, pro: true },
      ]
    },
    {
      category: 'Support & Usage',
      features: [
        { name: 'Support level', free: 'Community', pro: 'Priority email' },
        { name: 'Commercial use', free: false, pro: true },
        { name: 'Advanced settings', free: false, pro: true },
        { name: 'Tool updates', free: 'Standard', pro: 'Early access' },
      ]
    }
  ]

  const toolCategories = [
    {
      name: 'SEO Specialists',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      tools: ['Meta Tag Generator', 'Sitemap Creator', 'Keyword Analyzer', 'Schema Generator'],
      count: 15
    },
    {
      name: 'Developers',
      icon: Code2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tools: ['JSON Formatter', 'Hash Generator', 'Base64 Encoder', 'Password Generator'],
      count: 15
    },
    {
      name: 'Marketers',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tools: ['QR Code Generator', 'UTM Builder', 'Email Tester', 'ROI Calculator'],
      count: 15
    },
    {
      name: 'Designers',
      icon: Palette,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      tools: ['Color Palette', 'Image Compressor', 'Gradient Generator', 'Icon Creator'],
      count: 15
    },
    {
      name: 'Advertisers',
      icon: Megaphone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      tools: ['Ad Copy Generator', 'CPC Calculator', 'Landing Page Scorer', 'ROAS Calculator'],
      count: 15
    }
  ]

  const additionalFeatures = [
    {
      icon: Infinity,
      title: 'Unlimited Usage',
      description: 'No daily limits on any tools with Pro subscription'
    },
    {
      icon: Palette,
      title: 'Premium Features',
      description: 'Access to advanced options and customization'
    },
    {
      icon: Download,
      title: 'All Export Formats',
      description: 'Download in any format without restrictions'
    },
    {
      icon: Settings,
      title: 'Advanced Options',
      description: 'Fine-tune settings for professional results'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'SEO Specialist',
      company: 'Digital Growth Co.',
      content: 'The meta tag generator and schema tools have saved me hours of work. Pro features are absolutely worth it!',
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Full Stack Developer',
      company: 'TechStart Inc.',
      content: 'Love the JSON formatter and hash generators. Clean, fast, and the unlimited usage is perfect for my workflow.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Thompson',
      role: 'Marketing Manager',
      company: 'Creative Agency',
      content: 'QR code generator with custom branding and the UTM builder are game-changers for our campaigns.',
      avatar: '👩‍🎨'
    }
  ]

  const faq = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.'
    },
    {
      question: 'Is there a free trial for Pro?',
      answer: 'Yes! All Pro features are available for 14 days free. No credit card required to start.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'You can continue using the free plan. All your generated content remains accessible, but you\'ll return to free plan limits.'
    },
    {
      question: 'Can I use Pro for commercial projects?',
      answer: 'Absolutely! Pro plan includes commercial use rights for all tools and generated content.'
    }
  ]

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
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="heading-1 text-gray-900 mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Unlock the full potential of 75+ professional tools. Start free, upgrade when you need unlimited access and advanced features.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  !isAnnual
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isAnnual
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                  Save 25%
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-primary-500 ring-4 ring-primary-100 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Crown className="w-4 h-4 inline mr-1" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`w-20 h-20 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <plan.icon className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {plan.name}
                </h3>
                
                <p className="text-gray-600 mb-6 text-lg">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-6xl font-bold text-gray-900">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-gray-600 ml-2 text-xl">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                
                {isAnnual && plan.price.monthly > 0 && (
                  <div className="text-green-600 font-medium mb-6">
                    Save ${(plan.price.monthly * 12) - plan.price.annual}/year • Only $1.50/month
                  </div>
                )}

                {/* CTA Button */}
                <button className={`btn ${plan.ctaStyle} w-full btn-lg mb-6`}>
                  {plan.cta}
                </button>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tool Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 lg:p-12 mb-20 border border-gray-200"
        >
          <div className="text-center mb-12">
            <h3 className="heading-3 text-gray-900 mb-4">
              Tools for Every Professional
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite covers all your needs across different disciplines. 
              Each category includes specialized tools designed for your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {toolCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${category.bgColor} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-16 h-16 ${category.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-sm`}>
                  <category.icon className={`w-8 h-8 ${category.color}`} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{category.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{category.count} specialized tools</p>
                <div className="space-y-1 text-xs text-gray-500">
                  {category.tools.map((tool, idx) => (
                    <div key={idx}>• {tool}</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 lg:p-12 mb-20 border border-gray-200"
        >
          <div className="text-center mb-12">
            <h3 className="heading-3 text-gray-900 mb-4">
              Detailed Feature Comparison
            </h3>
            <p className="text-lg text-gray-600">
              See exactly what you get with each plan
            </p>
          </div>

          <div className="space-y-8">
            {comparisonFeatures.map((section, sectionIndex) => (
              <div key={section.category}>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {section.category}
                </h4>
                <div className="space-y-3">
                  {section.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-0">
                      <div className="font-medium text-gray-900">{feature.name}</div>
                      <div className="text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-600">{feature.free}</span>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-primary-600 font-medium">{feature.pro}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="heading-3 text-gray-900 mb-4">
              Trusted by Professionals
            </h3>
            <p className="text-lg text-gray-600">
              See what our Pro users are saying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Upgrade Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 lg:p-12 mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="heading-3 text-gray-900 mb-4">
              Why Upgrade to Pro?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pro removes all limitations and unlocks advanced features 
              for professional workflows and enhanced productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="heading-3 text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-gray-200"
              >
                <h4 className="font-bold text-gray-900 mb-3">
                  {item.question}
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {item.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >
          {/* Background with animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-blue-500 to-purple-600 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-purple-400/20 rounded-3xl animate-pulse"></div>
          
          {/* Content */}
          <div className="relative bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-8 lg:p-16 text-center text-white shadow-2xl border border-sky-400/20">
            {/* Crown icon */}
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Crown className="w-10 h-10 text-yellow-300" />
            </div>
            
            <h3 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Upgrade?
            </h3>
            <p className="text-xl lg:text-2xl mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who've upgraded to Pro. 
              Start your <span className="font-semibold text-yellow-300">14-day free trial</span> today.
            </p>
            
            {/* Special offer box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-md mx-auto border border-white/20">
              <div className="text-yellow-300 font-semibold text-lg mb-2">Special Launch Price</div>
              <div className="text-3xl font-bold">Only $1.50/month</div>
              <div className="text-sm opacity-80">when billed annually • 25% savings</div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button className="btn bg-white text-sky-600 hover:bg-gray-50 btn-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Zap className="w-5 h-5 mr-2" />
                Start Pro Trial Now
              </button>
              <Link
                href="/tools"
                className="btn border-2 border-white/30 text-white hover:bg-white/10 btn-lg transition-all duration-300"
              >
                Explore Tools First
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm opacity-90">
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-300" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-300" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-300" />
                30-day money-back guarantee
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PricingPage