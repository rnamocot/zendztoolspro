import MetaTagsGeneratorTool from '@/components/tools/MetaTagsGenerator/MetaTagsGeneratorTool'

export const metadata = {
  title: 'Meta Tags Generator - Create SEO Meta Tags | Zendz Tools',
  description: 'Generate SEO meta tags for title, description, keywords, Open Graph, and Twitter Cards. Optimize your website for search engines and social media.',
  keywords: 'meta tags generator, SEO meta tags, open graph tags, twitter cards, meta description, meta keywords, SEO optimization',
  openGraph: {
    title: 'Meta Tags Generator - Create SEO Meta Tags Online',
    description: 'Generate complete meta tags for better SEO and social media sharing',
    images: ['/images/tools/meta-tags-generator-og.png'],
  },
}

export default function MetaTagsGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <MetaTagsGeneratorTool />
    </div>
  )
}