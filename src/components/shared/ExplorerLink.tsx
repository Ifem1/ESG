import React from 'react'
import { ExternalLink } from 'lucide-react'
import { getTxExplorerUrl, getAddressExplorerUrl, truncateHash, truncateAddress } from '@/lib/utils/explorer'
import { cn } from '@/lib/utils/cn'

interface ExplorerLinkProps {
  type: 'tx' | 'address'
  value: string
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function ExplorerLink({ type, value, className, showIcon = true, children }: ExplorerLinkProps) {
  const href = type === 'tx' ? getTxExplorerUrl(value) : getAddressExplorerUrl(value)
  const display = type === 'tx' ? truncateHash(value) : truncateAddress(value)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1 font-mono text-xs text-text-secondary hover:text-primary transition-colors',
        className
      )}
    >
      {children ?? (
        <>
          {display}
          {showIcon && <ExternalLink className="h-3 w-3" />}
        </>
      )}
    </a>
  )
}
