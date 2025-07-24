import JsonFormatterTool from '@/components/tools/JsonFormatter/JsonFormatterTool'

export const metadata = {
  title: 'JSON Formatter - Format & Validate JSON Online | Zendz Tools',
  description: 'Free online JSON formatter and validator. Beautify, minify, and validate JSON with syntax highlighting. Convert JSON to different formats instantly.',
  keywords: 'JSON formatter, JSON validator, JSON beautifier, JSON minifier, JSON parser, online JSON tool',
  openGraph: {
    title: 'JSON Formatter - Format & Validate JSON Online',
    description: 'Free online JSON formatter and validator with syntax highlighting',
    images: ['/images/tools/json-formatter-og.png'],
  },
}

export default function JsonFormatterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <JsonFormatterTool />
    </div>
  )
}