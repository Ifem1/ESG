import type { Metadata } from 'next'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ESG Oracle Protocol',
    template: '%s | ESG Oracle Protocol',
  },
  description:
    'Decentralized sustainability verification platform powered by GenLayer Intelligent Contracts. AI-consensus-based ESG claim analysis and greenwashing risk detection.',
  keywords: ['ESG', 'sustainability', 'verification', 'blockchain', 'greenwashing', 'GenLayer'],
  openGraph: {
    title: 'ESG Oracle Protocol',
    description: 'Decentralized sustainability verification platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-text-primary">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 overflow-x-hidden">
                {children}
              </main>
            </div>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
