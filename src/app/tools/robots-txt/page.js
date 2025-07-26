import RobotsTxtGeneratorTool from '@/components/tools/RobotsTxtGenerator/RobotsTxtGeneratorTool'

export const metadata = {
  title: 'Robots.txt Generator - Create SEO Robots Files | Zendz Tools',
  description: 'Generate robots.txt files to control search engine crawlers. Set crawl rules, delays, and sitemaps for better SEO optimization.',
  keywords: 'robots.txt generator, SEO robots file, web crawler control, search engine optimization, sitemap, crawl delay',
  openGraph: {
    title: 'Robots.txt Generator - Control Search Engine Crawlers',
    description: 'Generate robots.txt files to control how search engines crawl your website',
    images: ['/images/tools/robots-txt-generator-og.png'],
  },
}

export default function RobotsTxtGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <RobotsTxtGeneratorTool />
    </div>
  )
}