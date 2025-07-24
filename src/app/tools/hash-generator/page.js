import HashGeneratorTool from '@/components/tools/HashGenerator/HashGeneratorTool'

export const metadata = {
  title: 'Hash Generator - MD5, SHA1, SHA256 Hash Calculator | Zendz Tools',
  description: 'Generate MD5, SHA1, SHA256 hashes from text and files. Free online hash calculator with support for multiple algorithms and file uploads.',
  keywords: 'hash generator, MD5 hash, SHA1 hash, SHA256 hash, hash calculator, checksum, online hash tool',
  openGraph: {
    title: 'Hash Generator - Calculate MD5, SHA1, SHA256 Hashes',
    description: 'Free online hash generator for text and files',
    images: ['/images/tools/hash-generator-og.png'],
  },
}

export default function HashGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <HashGeneratorTool />
    </div>
  )
}