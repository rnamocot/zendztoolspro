import XmlSitemapGeneratorTool from '@/components/tools/XmlSitemapGenerator/XmlSitemapGeneratorTool'

export const metadata = {
  title: 'XML Sitemap Generator - Create SEO Sitemaps | Zendz Tools',
  description: 'Generate XML sitemaps to help search engines discover and index your website pages. Include priority, change frequency, and last modified dates.',
  keywords: 'XML sitemap generator, SEO sitemap, search engine optimization, website indexing, sitemap.xml, URL discovery',
  openGraph: {
    title: 'XML Sitemap Generator - Help Search Engines Find Your Pages',
    description: 'Generate XML sitemaps to improve your website\'s search engine visibility',
    images: ['/images/tools/xml-sitemap-generator-og.png'],
  },
}

export default function XmlSitemapGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <XmlSitemapGeneratorTool />
    </div>
  )
}