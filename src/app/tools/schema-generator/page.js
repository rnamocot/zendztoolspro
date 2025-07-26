import SchemaMarkupGeneratorTool from '@/components/tools/SchemaMarkupGenerator/SchemaMarkupGeneratorTool'

export const metadata = {
  title: 'Schema Markup Generator - Create Structured Data | Zendz Tools',
  description: 'Generate structured data markup for better search engine understanding. Create JSON-LD schema for articles, businesses, products, and more.',
  keywords: 'schema markup generator, structured data, JSON-LD, rich snippets, SEO schema, microdata',
  openGraph: {
    title: 'Schema Markup Generator - Boost Your SEO with Structured Data',
    description: 'Create professional schema markup to enhance your search results with rich snippets',
    images: ['/images/tools/schema-generator-og.png'],
  },
}

export default function SchemaMarkupGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SchemaMarkupGeneratorTool />
    </div>
  )
}