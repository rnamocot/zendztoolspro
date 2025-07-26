import KeywordDensityCheckerTool from '@/components/tools/KeywordDensityChecker/KeywordDensityCheckerTool'

export const metadata = {
  title: 'Keyword Density Checker - SEO Content Analysis | Zendz Tools',
  description: 'Analyze keyword frequency and density in your content. Get SEO recommendations and optimize your content for better search engine rankings.',
  keywords: 'keyword density checker, SEO analysis, content optimization, keyword frequency, search engine optimization',
  openGraph: {
    title: 'Keyword Density Checker - Optimize Your Content for SEO',
    description: 'Analyze keyword density and get actionable SEO recommendations for your content',
    images: ['/images/tools/keyword-density-checker-og.png'],
  },
}

export default function KeywordDensityCheckerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <KeywordDensityCheckerTool />
    </div>
  )
}