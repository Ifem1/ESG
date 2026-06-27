'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ConnectButton } from '@/components/wallet/ConnectButton'
import { cn } from '@/lib/utils/cn'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/claims', label: 'Claims Ledger' },
  { href: '/greenwashing', label: 'Risk Terminal' },
  { href: '/consensus', label: 'Consensus' },
  { href: '/explorer', label: 'Explorer' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e2d22] bg-[#0a0f0d]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0f0d]/75">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 border border-primary/30 group-hover:bg-primary/20 transition-colors">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-text-primary leading-none">ESG Oracle</span>
              <span className="font-mono text-[10px] text-text-muted leading-none tracking-widest uppercase">Protocol</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-primary bg-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ConnectButton />
            <button
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#1e2d22] py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-primary bg-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
