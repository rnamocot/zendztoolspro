'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Star, Users, Zap } from 'lucide-react'

const Hero = () => {
  const stats = [
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Tools Available', value: '70+', icon: Zap },
    { label: 'User Rating', value: '4.9', icon: Star },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      <div className="absolute inset-0">
        {/* Optional light background animation */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-100 rounded-full blur-xl animate-pulse-primary"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-sky-50 rounded-full blur-2xl animate-pulse-primary delay-300"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-100 rounded-full blur-xl animate-pulse-primary delay-700"></div>

        {/* Grid Pattern (light) */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        ></div>
      </div>

      <div className="relative container-custom text-center text-gray-900 pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-gray-100 backdrop-blur-custom rounded-full px-4 py-2 border border-gray-200">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ professionals worldwide</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="heading-1 text-gray-900 mb-6 leading-tight"
          >
            All-in-One{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Professional Tools</span>
              <motion.div
                className="absolute inset-0 bg-yellow-100 -rotate-1 rounded-lg"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              ></motion.div>
            </span>
            <br />
            for Everyone
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            Essential tools for <strong>SEO specialists</strong>, <strong>developers</strong>, <strong>marketers</strong>, <strong>designers</strong>, and <strong>advertisers</strong>. 
            Everything you need in one powerful platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              href="/tools"
              className="btn btn-primary btn-lg group"
            >
              <span>Explore Free Tools</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/pricing"
              className="btn btn-outline-dark btn-lg group"
            >
              <Play className="w-5 h-5 mr-2" />
              <span>View Pro Features</span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                custom={index}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 backdrop-blur-custom rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 text-gray-800" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                className="w-1 h-3 bg-gray-500 rounded-full mt-2"
              ></motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
