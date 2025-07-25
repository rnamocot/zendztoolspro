'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/app/contexts/AuthProvider'

import { 
  User,
  Crown,
  Zap,
  Settings,
  BarChart3,
  Clock,
  Star,
  TrendingUp,
  Target,
  Palette,
  Megaphone,
  Code2,
  QrCode,
  Hash,
  FileText,
  Key,
  Database,
  Tag,
  ChevronRight,
  Plus,
  Calendar,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Infinity,
  LogOut,
  Bell,
  Search,
  Bookmark,
  History,
  Shield,
  CreditCard,
  HelpCircle
} from 'lucide-react'

const Dashboard = () => {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) return null

  const usageData = {
    today: Object.entries(user.usageToday || {}).reduce((acc, [tool, count]) => {
      acc[tool] = { used: count, limit: 10 }
      return acc
    }, {}),
    thisMonth: user.usageThisMonth || {
      totalUsage: 0,
      toolsUsed: 0,
      favoriteCategory: 'None'
    }
  }

  const recentTools = [
    { name: 'QR Code Generator', href: '/tools/qr-generator', icon: QrCode, lastUsed: '2 hours ago', category: 'Marketing' },
    { name: 'JSON Formatter', href: '/tools/json-formatter', icon: Code2, lastUsed: '4 hours ago', category: 'Developer' },
    { name: 'Password Generator', href: '/tools/password-generator', icon: Key, lastUsed: '1 day ago', category: 'Security' },
    { name: 'Hash Generator', href: '/tools/hash-generator', icon: Hash, lastUsed: '2 days ago', category: 'Security' }
  ]

  const favoriteTools = [
    { name: 'Meta Tag Generator', href: '/tools/meta-tags', icon: Tag, category: 'SEO' },
    { name: 'Base64 Encoder', href: '/tools/base64-encoder', icon: FileText, category: 'Developer' },
    { name: 'Color Palette Generator', href: '/tools/color-palette', icon: Palette, category: 'Design' }
  ]

  const toolCategories = [
    { name: 'SEO Specialists', icon: TrendingUp, count: 15, color: 'text-green-600', bgColor: 'bg-green-50', href: '/tools?category=seo' },
    { name: 'Developers', icon: Code2, count: 15, color: 'text-blue-600', bgColor: 'bg-blue-50', href: '/tools?category=developers' },
    { name: 'Marketers', icon: Target, count: 15, color: 'text-purple-600', bgColor: 'bg-purple-50', href: '/tools?category=marketers' },
    { name: 'Designers', icon: Palette, count: 15, color: 'text-pink-600', bgColor: 'bg-pink-50', href: '/tools?category=designers' },
    { name: 'Advertisers', icon: Megaphone, count: 15, color: 'text-orange-600', bgColor: 'bg-orange-50', href: '/tools?category=advertisers' }
  ]

  const getTotalUsageToday = () => {
    return Object.values(usageData.today).reduce((sum, tool) => sum + tool.used, 0)
  }

  const getTotalLimitToday = () => {
    return Object.values(usageData.today).reduce((sum, tool) => sum + tool.limit, 0)
  }

  const getUsagePercentage = () => {
    const used = getTotalUsageToday()
    const limit = getTotalLimitToday()
    return limit > 0 ? Math.round((used / limit) * 100) : 0
  }

  const isApproachingLimit = () => {
    return !user.isPro && getUsagePercentage() >= 70
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-custom py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                Welcome back, {user.name.split(' ')[0]}!
                {user.isPro && (
                  <span className="ml-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Pro
                  </span>
                )}
              </h1>
              <p className="text-gray-600">
                {user.isPro ? 'Enjoy unlimited access to all tools' : 'You have great tools at your fingertips'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link
              href="/dashboard/settings"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>

<button
  onClick={() => signOut()}
  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
>
  <LogOut className="w-5 h-5" />
</button>



          </div>
        </div>

        {/* Usage Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Usage Stats */}
          <div className={`lg:col-span-2 bg-white rounded-2xl p-6 border-2 ${
            isApproachingLimit() ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Usage</h3>
              {user.isPro ? (
                <span className="flex items-center text-green-600 font-medium">
                  <Infinity className="w-4 h-4 mr-1" />
                  Unlimited
                </span>
              ) : (
                <span className={`text-sm font-medium ${
                  isApproachingLimit() ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  {getTotalUsageToday()}/{getTotalLimitToday()} uses
                </span>
              )}
            </div>
            
            {user.isPro ? (
              <div className="flex items-center space-x-3">
                <div className="w-full bg-green-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full w-full"></div>
                </div>
                <span className="text-green-600 font-bold">Pro</span>
              </div>
            ) : (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className={`h-3 rounded-full ${
                      isApproachingLimit() 
                        ? 'bg-gradient-to-r from-orange-400 to-red-500' 
                        : 'bg-gradient-primary'
                    }`}
                    style={{ width: `${getUsagePercentage()}%` }}
                  ></div>
                </div>
                
                {isApproachingLimit() && (
                  <div className="flex items-center space-x-2 text-orange-700 bg-orange-100 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Approaching daily limit. Upgrade for unlimited access!</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center mb-3">
              <BarChart3 className="w-5 h-5 text-primary-500 mr-2" />
              <h4 className="font-semibold text-gray-900">This Month</h4>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{usageData.thisMonth.totalUsage}</div>
            <div className="text-sm text-gray-600">Total uses</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center mb-3">
              <Zap className="w-5 h-5 text-primary-500 mr-2" />
              <h4 className="font-semibold text-gray-900">Tools Used</h4>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{usageData.thisMonth.toolsUsed}</div>
            <div className="text-sm text-gray-600">Different tools</div>
          </div>
        </div>

        {/* Pro Upgrade Banner for Free Users */}
        {!user.isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-6 lg:p-8 text-white mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h3 className="text-2xl font-bold mb-2 flex items-center">
                  <Crown className="w-6 h-6 mr-2 text-yellow-300" />
                  Upgrade to Pro
                </h3>
                <p className="text-lg opacity-90 mb-2">
                  Get unlimited usage and advanced features
                </p>
                <div className="text-sm opacity-80">
                  Only $1.50/month when billed annually • 14-day free trial
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/pricing"
                  className="btn bg-white text-purple-600 hover:bg-gray-50"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Start Free Trial
                </Link>
                <Link
                  href="/pricing"
                  className="btn border-2 border-white/30 text-white hover:bg-white/10"
                >
                  View Plans
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Tools */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <History className="w-5 h-5 mr-2 text-primary-500" />
                  Recently Used
                </h3>
                <Link
                  href="/tools"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center"
                >
                  View All Tools
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentTools.map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.href}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <tool.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-primary-600">{tool.name}</h4>
                      <p className="text-sm text-gray-600">{tool.category} • {tool.lastUsed}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Tool Categories */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Browse by Category</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {toolCategories.map((category, index) => (
                  <Link
                    key={index}
                    href={category.href}
                    className={`${category.bgColor} rounded-xl p-4 hover:shadow-md transition-all duration-300 group`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center border-2 border-white shadow-sm`}>
                        <category.icon className={`w-5 h-5 ${category.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary-600">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.count} tools available</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Favorite Tools */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Bookmark className="w-4 h-4 mr-2 text-primary-500" />
                  Favorites
                </h3>
                <button className="text-primary-600 hover:text-primary-500">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {favoriteTools.map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.href}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <tool.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm group-hover:text-primary-600 truncate">{tool.name}</h4>
                      <p className="text-xs text-gray-600">{tool.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Account Settings</span>
                </Link>
                
                {user.isPro ? (
                  <Link
                    href="/dashboard/billing"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Billing & Usage</span>
                  </Link>
                ) : (
                  <Link
                    href="/pricing"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors text-purple-600"
                  >
                    <Crown className="w-5 h-5" />
                    <span className="font-medium">Upgrade to Pro</span>
                  </Link>
                )}
                
                <Link
                  href="/support"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Get Support</span>
                </Link>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Account Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className={`font-medium ${user.isPro ? 'text-purple-600' : 'text-gray-900'}`}>
                    {user.isPro ? 'Pro' : 'Free'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(user.joinDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard