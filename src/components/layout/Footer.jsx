'use client'

import Link from 'next/link'
import { Zap, Github, Twitter, Mail, Heart, ExternalLink } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Tools',
      links: [
        { name: 'JSON Formatter', href: '/tools/json-formatter' },
        { name: 'Password Generator', href: '/tools/password-generator' },
        { name: 'Hash Generator', href: '/tools/hash-generator' },
        { name: 'QR Code Generator', href: '/tools/qr-generator' },
        { name: 'Base64 Encoder', href: '/tools/base64-encoder' },
        { name: 'All Tools', href: '/tools', icon: ExternalLink },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'How to Use', href: '/guides' },
        { name: 'Tips & Tricks', href: '/tips' },
        { name: 'Blog', href: '/blog' },
        { name: 'Changelog', href: '/changelog' },
        { name: 'Tool Requests', href: '/requests' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Contact', href: '/contact' },
        { name: 'Support', href: '/support' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { name: 'GitHub', href: 'https://github.com/zendztools', icon: Github, external: true },
        { name: 'Twitter', href: 'https://twitter.com/zendztools', icon: Twitter, external: true },
        { name: 'Email', href: 'mailto:hello@zendztools.tech', icon: Mail, external: true },
      ],
    },
  ]

  const popularTools = [
    'JSON Formatter',
    'Password Generator', 
    'QR Code Generator',
    'Hash Generator',
    'Base64 Encoder',
    'Meta Tag Generator'
  ]

  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200">
  <div className="container-custom py-16">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
      
      {/* Brand + Popular Tools */}
      <div className="lg:col-span-2">
        <Link href="/" className="flex items-center space-x-2 mb-6 group">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">
            Zendz Tools
          </span>
        </Link>

        <p className="text-gray-500 mb-6 leading-relaxed max-w-md">
          All-in-one browser-based tools for SEO specialists, developers, marketers, designers, and advertisers. 
          Start free with essential features, upgrade to Pro for unlimited usage and advanced options.
        </p>

        <div className="mb-6">
          <h4 className="text-gray-800 font-semibold mb-3">Popular Tools</h4>
          <div className="flex flex-wrap gap-2">
            {popularTools.map((tool) => (
              <Link
                key={tool}
                href={`/tools/${tool.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-primary-500 px-3 py-1 rounded-md text-sm transition-colors"
              >
                {tool}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          {footerSections[3].links.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-primary-500 text-gray-500 hover:text-white rounded-lg transition-all duration-200 hover:scale-110 shadow-sm"
              aria-label={social.name}
            >
              {social.icon && <social.icon className="w-5 h-5" />}
            </a>
          ))}
        </div>
      </div>

      {/* Other Footer Sections */}
      {footerSections.slice(0, 3).map((section) => (
        <div key={section.title}>
          <h3 className="text-gray-800 font-semibold mb-4">{section.title}</h3>
          <ul className="space-y-3">
            {section.links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="flex items-center text-gray-500 hover:text-primary-500 transition-colors group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.name}
                  </span>
                  {link.icon && (
                    <link.icon className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>

  {/* Footer Bottom Bar */}
  <div className="border-t border-gray-200">
    <div className="container-custom py-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <span>© {currentYear} Zendz Tools. Made with</span>
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span>for professionals worldwide.</span>
        </div>
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-primary-500">Privacy</Link>
          <Link href="/terms" className="hover:text-primary-500">Terms</Link>
          <Link href="/sitemap" className="hover:text-primary-500">Sitemap</Link>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>

  )
}

export default Footer