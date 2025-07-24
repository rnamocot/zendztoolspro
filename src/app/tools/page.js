import ToolsLanding from '@/components/sections/ToolsLanding'

export const metadata = {
  title: 'Developer Tools - Free Online Tools for Developers | Zendz Tools',
  description: 'Browse our collection of free online developer tools. JSON formatter, password generator, hash calculator, and more. Essential tools for developers and SEO specialists.',
  keywords: 'developer tools, online tools, JSON formatter, password generator, web tools, coding tools, SEO tools',
  openGraph: {
    title: 'Developer Tools - Free Online Tools Collection',
    description: 'Essential online tools for developers and SEO specialists',
    images: ['/images/tools-collection-og.png'],
  },
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ToolsLanding />
    </div>
  )
}