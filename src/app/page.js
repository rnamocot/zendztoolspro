import Hero from '@/components/sections/Hero'
import ToolsSection from '@/components/sections/ToolsSection'
import PricingSection from '@/components/sections/PricingSection'
import FeaturesSection from '@/components/sections/FeaturesSection'

export const metadata = {
  title: 'Zendz Tools - Professional Developer Tools',
  description: 'Free online tools for developers and SEO specialists. JSON formatter, password generator, API testing, and more. Upgrade to Pro for advanced features.',
  openGraph: {
    title: 'Zendz Tools - Professional Developer Tools',
    description: 'Free online tools for developers and SEO specialists',
    images: ['/images/home-og.png'],
  },
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Tools Section */}
      <ToolsSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Pricing Section */}
      <PricingSection />
    </>
  )
}