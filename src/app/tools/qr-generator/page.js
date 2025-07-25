import QRGeneratorTool from '@/components/tools/QRGenerator/QRGeneratorTool'

export const metadata = {
  title: 'QR Code Generator - Create QR Codes for URLs & Text | Zendz Tools',
  description: 'Free online QR code generator. Create QR codes for URLs, text, contact info, and more. Download as PNG with custom sizes and error correction.',
  keywords: 'QR code generator, create QR code, QR code maker, URL to QR code, text to QR code, online QR generator',
  openGraph: {
    title: 'QR Code Generator - Create Custom QR Codes Online',
    description: 'Generate QR codes for URLs, text, and contact information',
    images: ['/images/tools/qr-generator-og.png'],
  },
}

export default function QRGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <QRGeneratorTool />
    </div>
  )
}