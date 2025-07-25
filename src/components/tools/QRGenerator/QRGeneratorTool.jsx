'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import { useAuth } from '@/app/contexts/AuthProvider'
import { 
  Download, 
  Copy,
  Crown,
  ArrowLeft,
  CheckCircle,
  Zap,
  Info,
  Smartphone,
  Mail,
  Phone,
  Wifi,
  User,
  ExternalLink,
  Palette,
  RefreshCw,
  AlertTriangle,
  Lock,
  Star,
  Settings
} from 'lucide-react'

const QRGeneratorTool = () => {
  // Real auth integration
  const { 
    user, 
    isSignedIn,
    updateUsage, 
    canUseTool, 
    getRemainingUsage 
  } = useAuth()

  const [qrType, setQrType] = useState('text')
  const [inputData, setInputData] = useState({
    text: 'Hello, World!',
    url: 'https://example.com',
    email: 'contact@example.com',
    phone: '+1234567890',
    sms: '+1234567890',
    smsMessage: 'Hello!',
    wifi: {
      ssid: 'MyWiFi',
      password: 'password123',
      security: 'WPA'
    },
    contact: {
      name: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      organization: 'Company Inc.'
    }
  })
  
  const [qrSettings, setQrSettings] = useState({
    size: 256,
    errorCorrection: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF'
  })
  
  const [qrGenerated, setQrGenerated] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const canvasRef = useRef(null)

  // Tool configuration
  const TOOL_ID = 'qr-generator'
  const FREE_USAGE_LIMIT = 10

  // Real usage data from auth context
  const currentUsage = user?.usageToday?.[TOOL_ID] || 0
  const usageRemaining = getRemainingUsage(TOOL_ID, FREE_USAGE_LIMIT)
  const canUse = canUseTool(TOOL_ID, FREE_USAGE_LIMIT)
  const isNearLimit = typeof usageRemaining === 'number' && usageRemaining <= 2
  const isAtLimit = !canUse && isSignedIn

  const qrTypes = [
    { id: 'text', name: 'Text', icon: ExternalLink, description: 'Plain text or message', proOnly: false },
    { id: 'url', name: 'URL/Website', icon: ExternalLink, description: 'Website link or URL', proOnly: false },
    { id: 'email', name: 'Email', icon: Mail, description: 'Email address', proOnly: false },
    { id: 'phone', name: 'Phone', icon: Phone, description: 'Phone number', proOnly: false },
    { id: 'sms', name: 'SMS', icon: Smartphone, description: 'SMS with message', proOnly: false },
    { id: 'wifi', name: 'WiFi', icon: Wifi, description: 'WiFi network credentials', proOnly: true },
    { id: 'contact', name: 'Contact', icon: User, description: 'Contact information (vCard)', proOnly: true },
  ]

  const errorCorrectionLevels = [
    { value: 'L', name: 'Low (7%)', description: 'Fastest generation', proOnly: false },
    { value: 'M', name: 'Medium (15%)', description: 'Balanced (recommended)', proOnly: false },
    { value: 'Q', name: 'Quartile (25%)', description: 'Good for damaged codes', proOnly: true },
    { value: 'H', name: 'High (30%)', description: 'Best error recovery', proOnly: true },
  ]

  const sizes = [
    { value: 128, name: '128x128', description: 'Small', proOnly: false },
    { value: 256, name: '256x256', description: 'Medium (recommended)', proOnly: false },
    { value: 512, name: '512x512', description: 'Large', proOnly: true },
    { value: 1024, name: '1024x1024', description: 'Extra Large', proOnly: true },
  ]

  const generateQRCode = async () => {
    // Check if user can use this tool
    if (!canUse) {
      setShowUpgradePrompt(true)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const content = getCurrentContent()
      
      const options = {
        errorCorrectionLevel: qrSettings.errorCorrection,
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: qrSettings.foregroundColor,
          light: qrSettings.backgroundColor
        },
        width: qrSettings.size
      }

      await QRCode.toCanvas(canvas, content, options)
      
      setQrGenerated(true)
      
      // Update usage count (this will work for both signed in and anonymous users)
      updateUsage(TOOL_ID)
      
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const getCurrentContent = () => {
    switch (qrType) {
      case 'text':
        return inputData.text
      case 'url':
        return inputData.url
      case 'email':
        return `mailto:${inputData.email}`
      case 'phone':
        return `tel:${inputData.phone}`
      case 'sms':
        return `sms:${inputData.sms}?body=${encodeURIComponent(inputData.smsMessage)}`
      case 'wifi':
        return `WIFI:T:${inputData.wifi.security};S:${inputData.wifi.ssid};P:${inputData.wifi.password};;`
      case 'contact':
        return `BEGIN:VCARD
VERSION:3.0
FN:${inputData.contact.name}
TEL:${inputData.contact.phone}
EMAIL:${inputData.contact.email}
ORG:${inputData.contact.organization}
END:VCARD`
      default:
        return inputData.text
    }
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setInputData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setInputData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const downloadQRCode = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `qr-code-${qrType}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const copyQRCode = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      canvas.toBlob(blob => {
        const item = new ClipboardItem({ 'image/png': blob })
        navigator.clipboard.write([item])
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
    } catch (err) {
      const dataUrl = canvas.toDataURL()
      navigator.clipboard.writeText(dataUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const renderInputFields = () => {
    switch (qrType) {
      case 'text':
        return (
          <textarea
            value={inputData.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
            placeholder="Enter your text or message..."
            className="w-full h-32 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        )
      
      case 'url':
        return (
          <input
            type="url"
            value={inputData.url}
            onChange={(e) => handleInputChange('url', e.target.value)}
            placeholder="https://example.com"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        )
      
      case 'email':
        return (
          <input
            type="email"
            value={inputData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="contact@example.com"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        )
      
      case 'phone':
        return (
          <input
            type="tel"
            value={inputData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1234567890"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        )
      
      case 'sms':
        return (
          <div className="space-y-3">
            <input
              type="tel"
              value={inputData.sms}
              onChange={(e) => handleInputChange('sms', e.target.value)}
              placeholder="Phone number"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <textarea
              value={inputData.smsMessage}
              onChange={(e) => handleInputChange('smsMessage', e.target.value)}
              placeholder="SMS message"
              className="w-full h-20 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        )
      
      case 'wifi':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={inputData.wifi.ssid}
              onChange={(e) => handleInputChange('wifi.ssid', e.target.value)}
              placeholder="WiFi Network Name (SSID)"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              disabled={!user?.isPro}
            />
            <input
              type="password"
              value={inputData.wifi.password}
              onChange={(e) => handleInputChange('wifi.password', e.target.value)}
              placeholder="WiFi Password"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              disabled={!user?.isPro}
            />
            <select
              value={inputData.wifi.security}
              onChange={(e) => handleInputChange('wifi.security', e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              disabled={!user?.isPro}
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </div>
        )
      
      case 'contact':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={inputData.contact.name}
              onChange={(e) => handleInputChange('contact.name', e.target.value)}
              placeholder="Full Name"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              disabled={!user?.isPro}
            />
            <input
              type="tel"
              value={inputData.contact.phone}
              onChange={(e) => handleInputChange('contact.phone', e.target.value)}
              placeholder="Phone Number"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              disabled={!user?.isPro}
            />
            <input
              type="email"
              value={inputData.contact.email}
              onChange={(e) => handleInputChange('contact.email', e.target.value)}
              placeholder="Email Address"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              disabled={!user?.isPro}
            />
            <input
              type="text"
              value={inputData.contact.organization}
              onChange={(e) => handleInputChange('contact.organization', e.target.value)}
              placeholder="Organization"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              disabled={!user?.isPro}
            />
          </div>
        )
      
      default:
        return (
          <input
            type="text"
            value={inputData.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
            placeholder="Enter your content..."
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        )
    }
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
            Unlimited QR codes • Pro Plan
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
          </span> QR codes today
          {isNearLimit && (
            <span className="ml-2 text-orange-600">• Almost at limit!</span>
          )}
        </span>
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
              QR Code Generator
              {user?.isPro && (
                <span className="ml-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Pro
                </span>
              )}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Create custom QR codes for URLs, text, contact info, and more. Download as PNG with customizable sizes and colors.
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
                  You've used all {FREE_USAGE_LIMIT} QR codes for today. Upgrade to Pro for unlimited usage.
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
                  ? `You've used all ${FREE_USAGE_LIMIT} QR codes for today.`
                  : `Sign up to get ${FREE_USAGE_LIMIT} daily QR codes, or upgrade to Pro for unlimited usage.`
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

        {/* QR Type Selector */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">QR Code Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {qrTypes.map((type) => {
              const isLocked = type.proOnly && !user?.isPro
              return (
                <button
                  key={type.id}
                  onClick={() => !isLocked ? setQrType(type.id) : null}
                  className={`p-4 border rounded-lg transition-all text-left relative ${
                    isLocked
                      ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                      : qrType === type.id
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isLocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-4 h-4 text-purple-500" />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <type.icon className="w-5 h-5 text-slate-600" />
                    {type.proOnly && (
                      <Crown className="w-4 h-4 text-purple-500" />
                    )}
                  </div>
                  <div className="font-semibold text-slate-900 mb-1">{type.name}</div>
                  <div className="text-xs text-slate-600">{type.description}</div>
                  {isLocked && (
                    <div className="text-xs text-purple-600 mt-1">Pro only</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Content</h3>
              {renderInputFields()}
              
              {(qrType === 'wifi' || qrType === 'contact') && !user?.isPro && (
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-sm text-purple-800 flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    This QR type requires a Pro subscription. 
                    <Link href="/pricing" className="underline ml-1">Upgrade now</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                QR Code Settings
              </h3>
              
              {/* Size */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {sizes.map((size) => {
                    const isLocked = size.proOnly && !user?.isPro
                    return (
                      <button
                        key={size.value}
                        onClick={() => !isLocked && setQrSettings(prev => ({ ...prev, size: size.value }))}
                        className={`p-3 text-sm border rounded-lg transition-all relative ${
                          isLocked
                            ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                            : qrSettings.size === size.value
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isLocked && (
                          <Lock className="absolute top-1 right-1 w-3 h-3 text-purple-500" />
                        )}
                        <div className="font-medium">{size.name}</div>
                        <div className="text-xs text-slate-600">{size.description}</div>
                        {isLocked && (
                          <Crown className="w-3 h-3 text-purple-500 mt-1" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Colors (Pro Feature) */}
              {user?.isPro ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Palette className="w-4 h-4 inline mr-1" />
                      Foreground Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={qrSettings.foregroundColor}
                        onChange={(e) => setQrSettings(prev => ({ ...prev, foregroundColor: e.target.value }))}
                        className="w-12 h-10 border border-slate-300 rounded"
                      />
                      <input
                        type="text"
                        value={qrSettings.foregroundColor}
                        onChange={(e) => setQrSettings(prev => ({ ...prev, foregroundColor: e.target.value }))}
                        className="flex-1 p-2 border border-slate-300 rounded font-mono text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Palette className="w-4 h-4 inline mr-1" />
                      Background Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={qrSettings.backgroundColor}
                        onChange={(e) => setQrSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-12 h-10 border border-slate-300 rounded"
                      />
                      <input
                        type="text"
                        value={qrSettings.backgroundColor}
                        onChange={(e) => setQrSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="flex-1 p-2 border border-slate-300 rounded font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center text-sm text-purple-800">
                    <Palette className="w-4 h-4 mr-2" />
                    <span>Custom colors available in Pro</span>
                    <Link href="/pricing" className="ml-2 underline">Upgrade</Link>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generateQRCode}
                disabled={isAtLimit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {isAtLimit ? 'Daily Limit Reached' : 'Generate QR Code'}
              </button>

              {isAtLimit && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  <Link href="/pricing" className="underline">Upgrade to Pro</Link> for unlimited usage
                </p>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">QR Code Preview</h3>
                {qrGenerated && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyQRCode}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadQRCode}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PNG
                    </button>
                  </div>
                )}
              </div>

              {/* QR Code Canvas */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white border-2 border-slate-200 rounded-lg">
                  <canvas
                    ref={canvasRef}
                    className="block"
                    style={{ 
                      width: Math.min(qrSettings.size, 300), 
                      height: Math.min(qrSettings.size, 300) 
                    }}
                  />
                </div>
              </div>

              {/* QR Code Info */}
              {qrGenerated && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500">Type</div>
                    <div className="font-semibold capitalize">{qrType}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Size</div>
                    <div className="font-semibold">{qrSettings.size}x{qrSettings.size}px</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Error Correction</div>
                    <div className="font-semibold">Level {qrSettings.errorCorrection}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Content Length</div>
                    <div className="font-semibold">{getCurrentContent().length} chars</div>
                  </div>
                </div>
              )}
            </div>

            {/* Pro Features Callout for Free Users */}
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
                      Get unlimited QR generation, custom colors, WiFi & contact QR codes, and advanced options.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Unlimited QR codes
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Custom colors & styles
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        WiFi & contact QR codes
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Advanced settings
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

export default QRGeneratorTool