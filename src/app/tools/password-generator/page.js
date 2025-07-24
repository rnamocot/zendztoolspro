import PasswordGeneratorTool from '@/components/tools/PasswordGenerator/PasswordGeneratorTool'

export const metadata = {
  title: 'Password Generator - Generate Secure Passwords | Zendz Tools',
  description: 'Generate strong, secure passwords with customizable options. Create random passwords with letters, numbers, symbols. Free online password generator tool.',
  keywords: 'password generator, secure password, random password, strong password, password creator, online password tool',
  openGraph: {
    title: 'Password Generator - Generate Secure Passwords Online',
    description: 'Create strong, secure passwords with customizable options',
    images: ['/images/tools/password-generator-og.png'],
  },
}

export default function PasswordGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <PasswordGeneratorTool />
    </div>
  )
}