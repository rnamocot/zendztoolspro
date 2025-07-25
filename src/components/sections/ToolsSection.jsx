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
  ChevronLeft,
  Crown,
  TrendingUp,
  Scissors,
  Calculator,
  Eye,
  MousePointer,
  BarChart3,
  Target,
  DollarSign,
  Percent,
  Calendar,
  Mail,
  Megaphone,
  Crop,
  Download,
  Layers,
  Smartphone,
  Monitor,
  PaintBucket,
  Sliders,
  Grid,
  RotateCcw,
  Camera,
  FileImage,
  Minimize,
  MoreHorizontal
} from 'lucide-react'

const ToolsLanding = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTier, setSelectedTier] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  
  const itemsPerPage = 12

  const categories = [
    { id: 'all', name: 'All Tools', icon: Settings, count: 75 },
    { id: 'seo', name: 'SEO Specialists', icon: TrendingUp, count: 15 },
    { id: 'developers', name: 'Developers', icon: Code2, count: 15 },
    { id: 'marketers', name: 'Marketers', icon: Target, count: 15 },
    { id: 'designers', name: 'Designers', icon: Palette, count: 15 },
    { id: 'advertisers', name: 'Advertisers', icon: Megaphone, count: 15 },
  ]

  const tiers = [
    { id: 'all', name: 'All Tiers' },
    { id: 'freemium', name: 'Freemium' },
  ]

  const tools = [
    // SEO Specialists Tools (15)
    {
      id: 'meta-tags',
      name: 'Meta Tag Generator',
      description: 'Generate SEO meta tags for title, description, and keywords',
      icon: Tag,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 95,
      features: ['Basic meta tags', 'Open Graph', 'Twitter Cards'],
      proFeatures: ['Bulk generation', 'Templates', 'Character limits'],
      href: '/tools/meta-tags'
    },
    {
      id: 'robots-txt',
      name: 'Robots.txt Generator',
      description: 'Create and validate robots.txt files for your website',
      icon: Shield,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 88,
      features: ['Basic rules', 'Validation', 'Download'],
      proFeatures: ['Advanced directives', 'Sitemap integration', 'Bulk sites'],
      href: '/tools/robots-txt'
    },
    {
      id: 'sitemap-generator',
      name: 'XML Sitemap Generator',
      description: 'Generate XML sitemaps for better search engine indexing',
      icon: Globe,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 92,
      features: ['Basic sitemap', 'URL validation', 'Download XML'],
      proFeatures: ['Image sitemaps', 'Video sitemaps', 'Large sites'],
      href: '/tools/sitemap-generator'
    },
    {
      id: 'keyword-density',
      name: 'Keyword Density Checker',
      description: 'Analyze keyword frequency and density in your content',
      icon: Search,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 85,
      features: ['Basic analysis', 'Keyword count', 'Density percentage'],
      proFeatures: ['Competitor comparison', 'Bulk analysis', 'Export reports'],
      href: '/tools/keyword-density'
    },
    {
      id: 'schema-generator',
      name: 'Schema Markup Generator',
      description: 'Create structured data markup for rich snippets',
      icon: Database,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 90,
      features: ['Basic schemas', 'JSON-LD format', 'Copy code'],
      proFeatures: ['All schema types', 'Validation', 'Bulk generation'],
      href: '/tools/schema-generator'
    },
    {
      id: 'serp-preview',
      name: 'SERP Preview Tool',
      description: 'Preview how your pages appear in search results',
      icon: Eye,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 87,
      features: ['Basic preview', 'Title & description', 'Mobile view'],
      proFeatures: ['Multiple devices', 'Competitor analysis', 'A/B testing'],
      href: '/tools/serp-preview'
    },
    {
      id: 'canonical-url',
      name: 'Canonical URL Generator',
      description: 'Create canonical link tags to prevent duplicate content',
      icon: LinkIcon,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 82,
      features: ['Single URLs', 'Tag generation', 'Copy code'],
      proFeatures: ['Bulk processing', 'Validation', 'Auto-detection'],
      href: '/tools/canonical-url'
    },
    {
      id: 'hreflang-generator',
      name: 'Hreflang Generator',
      description: 'Generate international SEO hreflang tags',
      icon: Globe,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 78,
      features: ['Basic hreflang', 'Language codes', 'Copy tags'],
      proFeatures: ['Bulk generation', 'Validation', 'Auto-detection'],
      href: '/tools/hreflang-generator'
    },
    {
      id: 'page-speed-analyzer',
      name: 'Page Speed Analyzer',
      description: 'Analyze basic page performance metrics',
      icon: Zap,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 93,
      features: ['Load time', 'Basic metrics', 'Mobile check'],
      proFeatures: ['Detailed reports', 'Recommendations', 'Monitoring'],
      href: '/tools/page-speed-analyzer'
    },
    {
      id: 'redirect-checker',
      name: 'Redirect Checker',
      description: 'Check redirect chains and status codes',
      icon: RotateCcw,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 84,
      features: ['Single URL', 'Status codes', 'Redirect path'],
      proFeatures: ['Bulk checking', 'Chain analysis', 'Export results'],
      href: '/tools/redirect-checker'
    },
    {
      id: 'broken-link-detector',
      name: 'Broken Link Detector',
      description: 'Find broken links on your web pages',
      icon: Search,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 86,
      features: ['Single page', 'Link validation', 'Status check'],
      proFeatures: ['Full site crawl', 'Reporting', 'Monitoring'],
      href: '/tools/broken-link-detector'
    },
    {
      id: 'open-graph-generator',
      name: 'Open Graph Generator',
      description: 'Generate social media meta tags for better sharing',
      icon: Tag,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 89,
      features: ['Basic OG tags', 'Facebook preview', 'Copy code'],
      proFeatures: ['Multiple platforms', 'Bulk generation', 'Templates'],
      href: '/tools/open-graph-generator'
    },
    {
      id: 'mobile-friendly-checker',
      name: 'Mobile-Friendly Checker',
      description: 'Test mobile compatibility and responsiveness',
      icon: Smartphone,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 91,
      features: ['Basic test', 'Mobile preview', 'Pass/fail result'],
      proFeatures: ['Detailed analysis', 'Recommendations', 'Multiple devices'],
      href: '/tools/mobile-friendly-checker'
    },
    {
      id: 'local-seo-analyzer',
      name: 'Local SEO Analyzer',
      description: 'Analyze local business optimization factors',
      icon: Target,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 83,
      features: ['Basic analysis', 'NAP check', 'Local factors'],
      proFeatures: ['Competitor comparison', 'Recommendations', 'Reporting'],
      href: '/tools/local-seo-analyzer'
    },
    {
      id: 'seo-content-analyzer',
      name: 'SEO Content Analyzer',
      description: 'Analyze content for SEO optimization opportunities',
      icon: FileText,
      category: 'seo',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 94,
      features: ['Basic analysis', 'Readability', 'Keyword suggestions'],
      proFeatures: ['Detailed suggestions', 'Competitor analysis', 'Scoring'],
      href: '/tools/seo-content-analyzer'
    },

    // Developers Tools (15)
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      description: 'Format, validate, and minify JSON data with syntax highlighting',
      icon: Code2,
      category: 'developers',
      tier: 'freemium',
      status: 'available',
      popularity: 95,
      features: ['Format & prettify', 'Validate syntax', 'Minify JSON'],
      proFeatures: ['Schema validation', 'Batch processing', 'Error highlighting'],
      href: '/tools/json-formatter'
    },
    {
      id: 'base64-encoder',
      name: 'Base64 Encoder/Decoder',
      description: 'Encode and decode Base64 data and files',
      icon: FileText,
      category: 'developers',
      tier: 'freemium',
      status: 'available',
      popularity: 92,
      features: ['Text encoding', 'Decode Base64', 'Copy to clipboard'],
      proFeatures: ['File upload', 'Batch processing', 'Multiple formats'],
      href: '/tools/base64-encoder'
    },
    {
      id: 'url-encoder',
      name: 'URL Encoder/Decoder',
      description: 'Encode and decode URLs and components for web development',
      icon: LinkIcon,
      category: 'developers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 88,
      features: ['URL encoding', 'Component encoding', 'Real-time'],
      proFeatures: ['Batch processing', 'Custom encoding', 'Validation'],
      href: '/tools/url-encoder'
    },
    {
      id: 'hash-generator',
      name: 'Hash Generator',
      description: 'Generate MD5, SHA1, SHA256 hashes from text and files',
      icon: Hash,
      category: 'developers',
      tier: 'freemium',
      status: 'available',
      popularity: 90,
      features: ['MD5 & SHA1', 'Text input', 'Copy results'],
      proFeatures: ['SHA256, SHA512', 'File hashing', 'HMAC generation'],
      href: '/tools/hash-generator'
    },
    {
      id: 'password-generator',
      name: 'Password Generator',
      description: 'Generate secure passwords with customizable options',
      icon: Key,
      category: 'developers',
      tier: 'freemium',
      status: 'available',
      popularity: 94,
      features: ['Custom length', 'Character types', 'Strength meter'],
      proFeatures: ['Bulk generation', 'Custom patterns', 'Pronounceable passwords'],
      href: '/tools/password-generator'
    },
    {
      id: 'uuid-generator',
      name: 'UUID Generator',
      description: 'Generate unique identifiers for your projects',
      icon: Fingerprint,
      category: 'developers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 87,
      features: ['UUID v4', 'Copy to clipboard', 'Multiple UUIDs'],
      proFeatures: ['Custom versions', 'Bulk generation', 'Formatting options'],
      href: '/tools/uuid-generator'
    },
    {
      id: 'unix-timestamp',
      name: 'Unix Timestamp Converter',
      description: 'Convert Unix timestamps to human-readable dates',
      icon: Clock,
      category: 'developers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 85,
      features: ['Timestamp conversion', 'Multiple timezones', 'Current time'],
      proFeatures: ['Batch conversion', 'Custom formats', 'Time calculations'],
      href: '/tools/unix-timestamp'
    },
    {
      id: 'sql-formatter',
      name: 'SQL Formatter',
      description: 'Format and beautify SQL queries with syntax highlighting',
      icon: Database,
      category: 'developers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 83,
      features: ['Basic formatting', 'Syntax highlighting', 'Copy results'],
      proFeatures: ['Multiple dialects', 'Query optimization', 'Batch processing'],
      href: '/tools/sql-formatter'
    },
    {
      id: 'css-minifier',
      name: 'CSS Minifier',
      description: 'Minify and optimize CSS code for production',
      icon: Scissors,
      category: 'developers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 82,
      features: ['Basic minification', 'Remove comments', 'Copy results'],
      proFeatures: ['Advanced optimization', 'Sourcemaps', 'Batch processing'],
      href: '/tools/css-minifier'
    },
    {
      id: 'js-minifier',
      name: 'JavaScript Minifier',
      description: 'Minify and optimize JavaScript code',
      icon: Code2,
      category: 'developers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 86,
      features: ['Basic minification', 'Remove whitespace', 'Copy results'],
      proFeatures: ['Advanced optimization', 'Obfuscation', 'Sourcemaps'],
      href: '/tools/js-minifier'
    },
    {
      id: 'html-formatter',
      name: 'HTML Formatter',
      description: 'Format and validate HTML code with proper indentation',
      icon: FileText,
      category: 'developers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 81,
      features: ['Basic formatting', 'Indentation', 'Copy results'],
      proFeatures: ['Validation', 'Optimization', 'Error detection'],
      href: '/tools/html-formatter'
    },
    {
      id: 'regex-tester',
      name: 'RegEx Tester',
      description: 'Test regular expressions with explanations and examples',
      icon: Search,
      category: 'developers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 89,
      features: ['Basic testing', 'Match highlighting', 'Copy regex'],
      proFeatures: ['Pattern library', 'Performance analysis', 'Code generation'],
      href: '/tools/regex-tester'
    },
    {
      id: 'lorem-generator',
      name: 'Lorem Ipsum Generator',
      description: 'Generate placeholder text for development and design',
      icon: Type,
      category: 'developers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 78,
      features: ['Basic lorem text', 'Word/paragraph count', 'Copy text'],
      proFeatures: ['Custom templates', 'Multiple languages', 'Themed content'],
      href: '/tools/lorem-generator'
    },
    {
      id: 'code-beautifier',
      name: 'Code Beautifier',
      description: 'Format and beautify code in multiple programming languages',
      icon: Code2,
      category: 'developers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 84,
      features: ['Basic languages', 'Auto-format', 'Copy results'],
      proFeatures: ['All languages', 'Custom styles', 'Batch processing'],
      href: '/tools/code-beautifier'
    },
    {
      id: 'text-case',
      name: 'Text Case Converter',
      description: 'Convert text between different cases (upper, lower, title)',
      icon: Type,
      category: 'developers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 80,
      features: ['Multiple cases', 'Real-time preview', 'Copy results'],
      proFeatures: ['Custom patterns', 'Batch processing', 'RegEx support'],
      href: '/tools/text-case'
    },

    // Marketers Tools (15)
    {
      id: 'qr-generator',
      name: 'QR Code Generator',
      description: 'Create marketing QR codes for campaigns and promotions',
      icon: QrCode,
      category: 'marketers',
      tier: 'freemium',
      status: 'available',
      popularity: 93,
      features: ['URL & text QR', 'Download PNG', 'Multiple sizes'],
      proFeatures: ['Custom colors', 'Logo embedding', 'Analytics tracking'],
      href: '/tools/qr-generator'
    },
    {
      id: 'utm-builder',
      name: 'UTM Builder',
      description: 'Build campaign tracking URLs with UTM parameters',
      icon: TrendingUp,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 95,
      features: ['Basic parameters', 'URL generation', 'Copy links'],
      proFeatures: ['Templates', 'Bulk generation', 'Campaign management'],
      href: '/tools/utm-builder'
    },
    {
      id: 'email-subject-tester',
      name: 'Email Subject Line Tester',
      description: 'Score and optimize email subject lines for better open rates',
      icon: Mail,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 89,
      features: ['Basic scoring', 'Character count', 'Spam check'],
      proFeatures: ['A/B test suggestions', 'Advanced analytics', 'Templates'],
      href: '/tools/email-subject-tester'
    },
    {
      id: 'social-image-resizer',
      name: 'Social Media Image Resizer',
      description: 'Resize images for different social media platforms',
      icon: Crop,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 91,
      features: ['Basic platforms', 'Auto-resize', 'Download images'],
      proFeatures: ['All platforms', 'Batch processing', 'Custom sizes'],
      href: '/tools/social-image-resizer'
    },
    {
      id: 'hashtag-generator',
      name: 'Hashtag Generator',
      description: 'Generate relevant hashtags for social media posts',
      icon: Hash,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 87,
      features: ['Basic suggestions', 'Copy hashtags', 'Trending tags'],
      proFeatures: ['Competitor analysis', 'Performance tracking', 'Bulk generation'],
      href: '/tools/hashtag-generator'
    },
    {
      id: 'roi-calculator',
      name: 'Campaign ROI Calculator',
      description: 'Calculate marketing return on investment and campaign metrics',
      icon: Calculator,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 85,
      features: ['Basic calculation', 'ROI percentage', 'Profit/loss'],
      proFeatures: ['Advanced metrics', 'Reporting', 'Forecasting'],
      href: '/tools/roi-calculator'
    },
    {
      id: 'ab-test-calculator',
      name: 'A/B Test Calculator',
      description: 'Calculate statistical significance for A/B tests',
      icon: BarChart3,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 83,
      features: ['Basic calculation', 'Confidence intervals', 'Sample size'],
      proFeatures: ['Advanced statistics', 'Test planning', 'Results interpretation'],
      href: '/tools/ab-test-calculator'
    },
    {
      id: 'landing-page-analyzer',
      name: 'Landing Page Analyzer',
      description: 'Analyze landing page elements for conversion optimization',
      icon: MousePointer,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 88,
      features: ['Basic analysis', 'Element check', 'Recommendations'],
      proFeatures: ['Detailed insights', 'Competitor analysis', 'Scoring'],
      href: '/tools/landing-page-analyzer'
    },
    {
      id: 'email-template-generator',
      name: 'Email Template Generator',
      description: 'Create responsive email templates for campaigns',
      icon: Mail,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 84,
      features: ['Basic templates', 'Mobile responsive', 'HTML export'],
      proFeatures: ['Advanced templates', 'Custom branding', 'A/B variants'],
      href: '/tools/email-template-generator'
    },
    {
      id: 'conversion-calculator',
      name: 'Conversion Rate Calculator',
      description: 'Calculate conversion rates and optimization metrics',
      icon: Percent,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 86,
      features: ['Basic metrics', 'Conversion rate', 'Traffic analysis'],
      proFeatures: ['Advanced analytics', 'Forecasting', 'Goal tracking'],
      href: '/tools/conversion-calculator'
    },
    {
      id: 'clv-calculator',
      name: 'Customer Lifetime Value Calculator',
      description: 'Calculate customer lifetime value for business planning',
      icon: DollarSign,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 82,
      features: ['Basic calculation', 'Revenue per customer', 'Lifetime value'],
      proFeatures: ['Advanced models', 'Segments', 'Forecasting'],
      href: '/tools/clv-calculator'
    },
    {
      id: 'budget-planner',
      name: 'Marketing Budget Calculator',
      description: 'Plan and allocate marketing budgets across channels',
      icon: Calculator,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 79,
      features: ['Basic planning', 'Budget allocation', 'Cost tracking'],
      proFeatures: ['Advanced forecasting', 'Scenarios', 'ROI projections'],
      href: '/tools/budget-planner'
    },
    {
      id: 'content-calendar',
      name: 'Social Media Calendar Planner',
      description: 'Plan and schedule social media content calendars',
      icon: Calendar,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 90,
      features: ['Basic calendar', 'Content planning', 'Export schedule'],
      proFeatures: ['Advanced planning', 'Templates', 'Team collaboration'],
      href: '/tools/content-calendar'
    },
    {
      id: 'lead-magnet-generator',
      name: 'Lead Magnet Generator',
      description: 'Create effective lead capture forms and magnets',
      icon: Target,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 81,
      features: ['Basic forms', 'Templates', 'Download forms'],
      proFeatures: ['Advanced forms', 'A/B testing', 'Analytics'],
      href: '/tools/lead-magnet-generator'
    },
    {
      id: 'competitor-analyzer',
      name: 'Competitor Analysis Tool',
      description: 'Analyze competitors and market positioning',
      icon: Search,
      category: 'marketers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 92,
      features: ['Basic analysis', 'Competitor research', 'Market insights'],
      proFeatures: ['Detailed insights', 'Monitoring', 'Advanced metrics'],
      href: '/tools/competitor-analyzer'
    },

    // Designers Tools (15)
    {
      id: 'color-palette-generator',
      name: 'Color Palette Generator',
      description: 'Generate harmonious color schemes and palettes',
      icon: Palette,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 94,
      features: ['Basic palettes', 'Color harmony', 'Export colors'],
      proFeatures: ['Advanced harmony rules', 'Export formats', 'Color accessibility'],
      href: '/tools/color-palette-generator'
    },
    {
      id: 'gradient-generator',
      name: 'Gradient Generator',
      description: 'Create beautiful CSS gradients with live preview',
      icon: PaintBucket,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 91,
      features: ['Basic gradients', 'Live preview', 'CSS export'],
      proFeatures: ['Advanced gradients', 'Presets', 'Multiple formats'],
      href: '/tools/gradient-generator'
    },
    {
      id: 'font-pairing',
      name: 'Font Pairing Tool',
      description: 'Discover perfect font combinations for your designs',
      icon: Type,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 88,
      features: ['Basic pairings', 'Font preview', 'Google Fonts'],
      proFeatures: ['Advanced suggestions', 'Custom fonts', 'Export combinations'],
      href: '/tools/font-pairing'
    },
    {
      id: 'image-compressor',
      name: 'Image Compressor',
      description: 'Compress images without losing quality',
      icon: Minimize,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 95,
      features: ['Basic compression', 'JPEG/PNG support', 'Download compressed'],
      proFeatures: ['Advanced algorithms', 'Batch processing', 'WebP support'],
      href: '/tools/image-compressor'
    },
    {
      id: 'svg-optimizer',
      name: 'SVG Optimizer',
      description: 'Optimize SVG files for better performance',
      icon: Layers,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 87,
      features: ['Basic optimization', 'File size reduction', 'Download optimized'],
      proFeatures: ['Advanced optimization', 'Batch processing', 'Custom settings'],
      href: '/tools/svg-optimizer'
    },
    {
      id: 'box-shadow-generator',
      name: 'CSS Box Shadow Generator',
      description: 'Create CSS box shadows with visual editor',
      icon: Sliders,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 89,
      features: ['Basic shadows', 'Live preview', 'CSS export'],
      proFeatures: ['Advanced effects', 'Presets', 'Multiple shadows'],
      href: '/tools/box-shadow-generator'
    },
    {
      id: 'border-radius-generator',
      name: 'Border Radius Generator',
      description: 'Create rounded corners and complex shapes',
      icon: MoreHorizontal,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 85,
      features: ['Basic radius', 'Live preview', 'CSS export'],
      proFeatures: ['Complex shapes', 'Presets', 'Advanced controls'],
      href: '/tools/border-radius-generator'
    },
    {
      id: 'text-shadow-generator',
      name: 'Text Shadow Generator',
      description: 'Create CSS text effects and shadows',
      icon: Type,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 83,
      features: ['Basic shadows', 'Live preview', 'CSS export'],
      proFeatures: ['Advanced effects', 'Presets', 'Multiple shadows'],
      href: '/tools/text-shadow-generator'
    },
    {
      id: 'image-converter',
      name: 'Image Format Converter',
      description: 'Convert images between different formats',
      icon: RotateCcw,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 92,
      features: ['Basic formats', 'JPEG/PNG/WebP', 'Download converted'],
      proFeatures: ['All formats', 'Batch processing', 'Quality settings'],
      href: '/tools/image-converter'
    },
    {
      id: 'favicon-generator',
      name: 'Favicon Generator',
      description: 'Create favicons and app icons from images',
      icon: FileImage,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 86,
      features: ['Basic favicon', 'Multiple sizes', 'Download package'],
      proFeatures: ['All sizes', 'App icons', 'Multiple formats'],
      href: '/tools/favicon-generator'
    },
    {
      id: 'mockup-generator',
      name: 'Mockup Generator',
      description: 'Create device mockups for presentations',
      icon: Monitor,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 90,
      features: ['Basic devices', 'Upload images', 'Download mockups'],
      proFeatures: ['All devices', 'Custom mockups', 'Batch generation'],
      href: '/tools/mockup-generator'
    },
    {
      id: 'image-resizer',
      name: 'Image Resize Tool',
      description: 'Resize images while maintaining aspect ratio',
      icon: Crop,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 93,
      features: ['Basic resize', 'Aspect ratio lock', 'Download resized'],
      proFeatures: ['Batch processing', 'Smart crop', 'Multiple formats'],
      href: '/tools/image-resizer'
    },
    {
      id: 'color-blindness-simulator',
      name: 'Color Blindness Simulator',
      description: 'Test color accessibility for different vision types',
      icon: Eye,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 81,
      features: ['Basic simulation', 'Common types', 'Image upload'],
      proFeatures: ['All types', 'Recommendations', 'Batch testing'],
      href: '/tools/color-blindness-simulator'
    },
    {
      id: 'typography-scale',
      name: 'Typography Scale Generator',
      description: 'Create harmonious typography scales',
      icon: Type,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 84,
      features: ['Basic scales', 'Common ratios', 'Preview text'],
      proFeatures: ['Custom ratios', 'Export formats', 'Font integration'],
      href: '/tools/typography-scale'
    },
    {
      id: 'logo-placeholder',
      name: 'Logo Placeholder Generator',
      description: 'Generate logo placeholders for design mockups',
      icon: Image,
      category: 'designers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 79,
      features: ['Basic placeholders', 'Custom text', 'Download images'],
      proFeatures: ['Custom styles', 'Batch generation', 'Brand colors'],
      href: '/tools/logo-placeholder'
    },

    // Advertisers Tools (15)
    {
      id: 'ad-copy-generator',
      name: 'Ad Copy Generator',
      description: 'Generate compelling ad headlines and descriptions',
      icon: Megaphone,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 93,
      features: ['Basic generation', 'Multiple variants', 'Copy suggestions'],
      proFeatures: ['AI-powered copy', 'A/B variants', 'Performance scoring'],
      href: '/tools/ad-copy-generator'
    },
    {
      id: 'cpc-calculator',
      name: 'CPC Calculator',
      description: 'Calculate cost per click and advertising metrics',
      icon: Calculator,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 90,
      features: ['Basic calculation', 'CPC metrics', 'Cost analysis'],
      proFeatures: ['Advanced forecasting', 'Scenarios', 'Bidding strategies'],
      href: '/tools/cpc-calculator'
    },
    {
      id: 'roas-calculator',
      name: 'ROAS Calculator',
      description: 'Calculate return on ad spend and profitability',
      icon: DollarSign,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 94,
      features: ['Basic calculation', 'ROAS percentage', 'Profit analysis'],
      proFeatures: ['Advanced metrics', 'Reporting', 'Goal tracking'],
      href: '/tools/roas-calculator'
    },
    {
      id: 'ctr-calculator',
      name: 'CTR Calculator',
      description: 'Calculate click-through rates and performance metrics',
      icon: MousePointer,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 88,
      features: ['Basic calculation', 'CTR percentage', 'Performance tracking'],
      proFeatures: ['Benchmarking', 'Optimization tips', 'Industry comparison'],
      href: '/tools/ctr-calculator'
    },
    {
      id: 'impression-calculator',
      name: 'Impression Calculator',
      description: 'Calculate ad impressions needed for campaign goals',
      icon: Eye,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 85,
      features: ['Basic calculation', 'Impression planning', 'Reach estimation'],
      proFeatures: ['Advanced forecasting', 'Reach planning', 'Frequency capping'],
      href: '/tools/impression-calculator'
    },
    {
      id: 'ad-banner-resizer',
      name: 'Ad Banner Resizer',
      description: 'Resize display ads for different platforms and sizes',
      icon: Crop,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 91,
      features: ['Basic sizes', 'Common formats', 'Download banners'],
      proFeatures: ['All IAB sizes', 'Batch processing', 'Custom dimensions'],
      href: '/tools/ad-banner-resizer'
    },
    {
      id: 'campaign-budget-planner',
      name: 'Campaign Budget Planner',
      description: 'Plan and optimize advertising campaign budgets',
      icon: Calculator,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 87,
      features: ['Basic planning', 'Budget allocation', 'Cost estimation'],
      proFeatures: ['Advanced scenarios', 'Optimization', 'Performance forecasting'],
      href: '/tools/campaign-budget-planner'
    },
    {
      id: 'bid-calculator',
      name: 'Bid Calculator',
      description: 'Calculate optimal bid amounts for ad auctions',
      icon: Target,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 84,
      features: ['Basic calculation', 'Bid suggestions', 'Cost estimation'],
      proFeatures: ['Advanced algorithms', 'Recommendations', 'Competitive analysis'],
      href: '/tools/bid-calculator'
    },
    {
      id: 'landing-page-scorer',
      name: 'Landing Page Scorer',
      description: 'Score landing page effectiveness for ad campaigns',
      icon: BarChart3,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 89,
      features: ['Basic scoring', 'Element analysis', 'Recommendations'],
      proFeatures: ['Detailed analysis', 'Competitor comparison', 'A/B testing'],
      href: '/tools/landing-page-scorer'
    },
    {
      id: 'audience-calculator',
      name: 'Audience Size Calculator',
      description: 'Estimate audience reach and targeting potential',
      icon: Users,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 86,
      features: ['Basic estimation', 'Demographic targeting', 'Reach calculation'],
      proFeatures: ['Advanced targeting', 'Overlap analysis', 'Lookalike audiences'],
      href: '/tools/audience-calculator'
    },
    {
      id: 'ad-schedule-optimizer',
      name: 'Ad Schedule Optimizer',
      description: 'Plan optimal ad timing and scheduling',
      icon: Calendar,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 82,
      features: ['Basic scheduling', 'Time planning', 'Schedule export'],
      proFeatures: ['Advanced optimization', 'Timezone handling', 'Performance analysis'],
      href: '/tools/ad-schedule-optimizer'
    },
    {
      id: 'attribution-calculator',
      name: 'Attribution Model Calculator',
      description: 'Calculate attribution weights across marketing channels',
      icon: BarChart3,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 81,
      features: ['Basic models', 'Attribution weights', 'Channel analysis'],
      proFeatures: ['Custom models', 'Advanced analytics', 'Cross-platform tracking'],
      href: '/tools/attribution-calculator'
    },
    {
      id: 'keyword-match-tool',
      name: 'Keyword Match Type Tool',
      description: 'Understand and optimize PPC keyword match types',
      icon: Search,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 88,
      features: ['Basic explanation', 'Match type comparison', 'Examples'],
      proFeatures: ['Volume estimation', 'Suggestions', 'Negative keywords'],
      href: '/tools/keyword-match-tool'
    },
    {
      id: 'ad-performance-analyzer',
      name: 'Ad Performance Analyzer',
      description: 'Analyze and optimize ad campaign performance',
      icon: BarChart3,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 92,
      features: ['Basic analysis', 'Performance metrics', 'Trend analysis'],
      proFeatures: ['Advanced insights', 'Recommendations', 'Predictive analytics'],
      href: '/tools/ad-performance-analyzer'
    },
    {
      id: 'conversion-tracking-setup',
      name: 'Conversion Tracking Setup',
      description: 'Generate tracking codes for conversion measurement',
      icon: Target,
      category: 'advertisers',
      tier: 'freemium',
      status: 'coming-soon',
      popularity: 90,
      features: ['Basic tracking', 'Code generation', 'Setup guide'],
      proFeatures: ['Advanced events', 'Cross-platform', 'Custom conversions'],
      href: '/tools/conversion-tracking-setup'
    }
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

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedTier])

  // Pagination calculations
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTools = filteredTools.slice(startIndex, endIndex)

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page)
    // Scroll to tools section instead of very top
    const toolsSection = document.getElementById('tools-section')
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      // Fallback: scroll to a reasonable position (not the very top)
      window.scrollTo({ top: 300, behavior: 'smooth' })
    }
  }

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  const getTierBadge = (tier) => {
    switch (tier) {
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
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-custom py-8 ">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-2 text-slate-900 mb-4">
            Professional Tools Collection
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Essential online tools for SEO specialists, developers, marketers, designers, and advertisers. 
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
            <div className="text-3xl font-bold text-green-600 mb-2">{tools.filter(t => t.tier === 'freemium').length}</div>
            <div className="text-slate-600">Freemium Tools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{tools.filter(t => t.status === 'available').length}</div>
            <div className="text-slate-600">Available Now</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
            <div className="text-slate-600">Categories</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8" id="tools-section">
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
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTools.length)} of {filteredTools.length} tools
            {totalPages > 1 && (
              <span className="ml-2 text-slate-500">
                (Page {currentPage} of {totalPages})
              </span>
            )}
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
          {currentTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 space-x-2">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1
                const isCurrentPage = page === currentPage
                
                // Show first page, last page, current page, and pages around current
                const shouldShow = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                
                // Show ellipsis
                const showEllipsisBefore = page === currentPage - 2 && currentPage > 3
                const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2

                return (
                  <div key={page} className="flex items-center">
                    {showEllipsisBefore && (
                      <span className="px-2 py-1 text-slate-400">...</span>
                    )}
                    
                    {shouldShow && (
                      <button
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isCurrentPage
                            ? 'bg-sky-500 text-white'
                            : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                    
                    {showEllipsisAfter && (
                      <span className="px-2 py-1 text-slate-400">...</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

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
              Unlock unlimited usage, advanced features, batch processing, and premium options. 
              Perfect for professionals who need more power.
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
                className="btn btn-outline-dark  btn-lg"
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