import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#1e2d22] bg-[#0f1712] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 border border-primary/30">
              <Shield className="h-3 w-3 text-primary" />
            </div>
            <span className="font-mono text-sm text-text-muted">ESG Oracle Protocol</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-text-muted">
            <Link href="/claims" className="hover:text-text-secondary transition-colors">Claims</Link>
            <Link href="/consensus" className="hover:text-text-secondary transition-colors">Consensus</Link>
            <Link href="/explorer" className="hover:text-text-secondary transition-colors">Explorer</Link>
            <Link href="/settings" className="hover:text-text-secondary transition-colors">Settings</Link>
          </div>

          <div className="font-mono text-xs text-text-muted">
            Powered by GenLayer Intelligent Contracts
          </div>
        </div>
      </div>
    </footer>
  )
}
