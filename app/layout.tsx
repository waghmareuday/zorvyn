import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Vault | Luminous Ledger',
  description:
    'A premium private financial dashboard — track your portfolio, investments, and spending with elegance.',
  keywords: ['finance', 'dashboard', 'portfolio', 'wealth management'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="antialiased" style={{ background: '#0b1326', color: '#dae2fd' }}>
        {children}
      </body>
    </html>
  )
}
