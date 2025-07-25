'use client'

import { useState } from 'react'
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
  Download
} from 'lucide-react'

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for trying out our tools',
      icon: Star,
      color: 'from-gray-500 to-gray-600',
      features: [
        '25+ essential tools',
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
        '25+ professional tools',
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

  return (
    <section className="section-padding bg-white" id="pricing">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Start free, upgrade when you need more power. 
              No hidden fees, no surprises.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`card card-hover relative flex flex-col h-full ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
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
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-5xl font-bold text-gray-900">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-gray-600 ml-2">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                
                {isAnnual && plan.price.monthly > 0 && (
                  <div className="text-sm text-green-600 font-medium">
                    Save ${(plan.price.monthly * 12) - plan.price.annual}/year
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-8 flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <button className={`btn ${plan.ctaStyle} w-full`}>
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
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
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h3 className="heading-3 text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-lg text-gray-600">
              Have questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            {faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <h4 className="font-bold text-gray-900 mb-3">
                  {item.question}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12 p-8 bg-gray-50 rounded-2xl">
            <Headphones className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h4>
            <p className="text-gray-600 mb-6">
              Our team is here to help you choose the right plan.
            </p>
            <button className="btn btn-primary">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection