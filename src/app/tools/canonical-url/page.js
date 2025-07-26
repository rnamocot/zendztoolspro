import CanonicalUrlGeneratorTool from '@/components/tools/CanonicalUrlGenerator/CanonicalUrlGeneratorTool'

export const metadata = {
  title: 'Canonical URL Generator - Prevent Duplicate Content Issues | Zendz Tools',
  description: 'Generate canonical link tags to prevent duplicate content issues. Manage URL parameters and consolidate page authority for better SEO.',
  keywords: 'canonical URL generator, duplicate content, canonical tags, SEO canonical, URL parameters, page authority',
  openGraph: {
    title: 'Canonical URL Generator - Fix Duplicate Content Issues',
    description: 'Generate canonical link tags to consolidate page authority and prevent SEO penalties',
    images: ['/images/tools/canonical-url-generator-og.png'],
  },
}

export default function CanonicalUrlGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <CanonicalUrlGeneratorTool />
    </div>
  )
}