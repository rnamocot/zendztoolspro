import SerpPreviewTool from '@/components/tools/SerpPreview/SerpPreviewTool'

export const metadata = {
  title: 'SERP Preview Tool - See How Your Pages Look in Search Results | Zendz Tools',
  description: 'Preview how your pages will appear in Google search results. Optimize your titles and descriptions for better click-through rates and SEO performance.',
  keywords: 'SERP preview, search result preview, SEO preview, meta title preview, meta description preview, Google search preview',
  openGraph: {
    title: 'SERP Preview Tool - Optimize Your Search Appearance',
    description: 'Preview and optimize how your web pages appear in Google search results',
    images: ['/images/tools/serp-preview-og.png'],
  },
}

export default function SerpPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SerpPreviewTool />
    </div>
  )
}