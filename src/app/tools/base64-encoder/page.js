import Base64EncoderTool from '@/components/tools/Base64Encoder/Base64EncoderTool'

export const metadata = {
  title: 'Base64 Encoder & Decoder - Encode Text & Files | Zendz Tools',
  description: 'Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 to text. Support for file uploads and batch processing with Pro.',
  keywords: 'base64 encoder, base64 decoder, base64 converter, encode base64, decode base64, online base64 tool',
  openGraph: {
    title: 'Base64 Encoder & Decoder - Convert Text & Files',
    description: 'Free online Base64 encoder and decoder with file support',
    images: ['/images/tools/base64-encoder-og.png'],
  },
}

export default function Base64EncoderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Base64EncoderTool />
    </div>
  )
}