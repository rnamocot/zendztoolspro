'use client'

import { motion } from 'framer-motion'
import {
  Zap,
  Shield,
  Globe,
  Smartphone,
  Code,
  Users,
  Clock,
  BarChart3,
  Lock,
  Rocket,
  Heart,
  Award
} from 'lucide-react'

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'All tools process instantly in your browser. No server delays, no waiting times.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays in your browser. We never store or transmit your sensitive information.'
    },
    {
      icon: Globe,
      title: 'Works Everywhere',
      description: 'Access all tools from any device, anywhere. No downloads or installations required.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Optimized for mobile devices. Use all features on your phone or tablet seamlessly.'
    },
    {
      icon: Code,
      title: 'Developer Focused',
      description: 'Built by developers, for developers. Every tool solves real development problems.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share results easily with your team. Pro users get advanced collaboration features.'
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Why Choose Zendz Tools?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            We've built the most accessible, private, and fast toolkit for developers everywhere.
          </motion.p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition duration-300 bg-gray-50 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
