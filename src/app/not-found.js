import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="container-custom text-center text-white">
        <div className="max-w-2xl mx-auto">
          {/* 404 Animation */}
          <div className="relative mb-8">
            <h1 className="text-9xl font-bold text-white/20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-custom rounded-full flex items-center justify-center animate-pulse">
                <Search className="w-16 h-16 text-white/60" />
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          <h2 className="text-4xl font-bold mb-4">
            Page Not Found
          </h2>
          
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="btn btn-secondary btn-lg group"
            >
              <Home className="w-5 h-5 mr-2" />
              <span>Go Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline btn-lg group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>
          
          {/* Popular Tools */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <h3 className="text-lg font-semibold mb-4 text-white/90">
              Popular Tools
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                'JSON Formatter',
                'Password Generator',
                'QR Code Generator',
                'Hash Generator',
                'Base64 Encoder'
              ].map((tool) => (
                <Link
                  key={tool}
                  href={`/tools/${tool.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                >
                  {tool}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}