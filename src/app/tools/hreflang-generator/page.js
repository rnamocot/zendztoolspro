import HreflangGeneratorTool from '@/components/tools/HreflangGenerator/HreflangGeneratorTool'

export const metadata = {
  title: 'Hreflang Generator - International SEO Tags | Zendz Tools',
  description: 'Generate international SEO hreflang tags for multi-language and multi-regional websites. Improve global search visibility and user experience.',
  keywords: 'hreflang generator, international SEO, multi-language SEO, hreflang tags, global SEO, language targeting',
  openGraph: {
    title: 'Hreflang Generator - International SEO Made Easy',
    description: 'Generate hreflang tags for better international search visibility and user targeting',
    images: ['/images/tools/hreflang-generator-og.png'],
  },
}

export default function HreflangGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <HreflangGeneratorTool />
    </div>
  )
}