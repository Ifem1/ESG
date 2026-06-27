'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  GitMerge,
  Search,
  PlusCircle,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const SIDEBAR_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/claims', label: 'Claims Ledger', icon: FileText },
  { href: '/claims/new', label: 'Submit Claim', icon: PlusCircle },
  { href: '/greenwashing', label: 'Risk Terminal', icon: AlertTriangle },
  { href: '/consensus', label: 'Consensus', icon: GitMerge },
  { href: '/explorer', label: 'Explorer', icon: Search },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-56 min-h-screen border-r border-[#1e2d22] bg-[#0f1712] pt-6 pb-8">
      <nav className="flex flex-col gap-1 px-3">
        {SIDEBAR_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/claims' && pathname.startsWith(href + '/'))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                active
                  ? 'text-primary bg-primary/10 border border-primary/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              )}
            >
              <Icon className={cn('h-4 w-4', active ? 'text-primary' : 'text-text-muted')} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto px-3">
        <div className="rounded-md border border-[#1e2d22] bg-card p-3">
          <p className="text-xs font-mono text-text-muted">NETWORK</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-slow" />
            <span className="text-xs text-text-secondary">GenLayer StudioNet</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
