'use client'

import { useAccount, useBalance } from 'wagmi'
import { Wallet, CheckCircle, XCircle } from 'lucide-react'
import { truncateAddress } from '@/lib/utils/explorer'
import { cn } from '@/lib/utils/cn'

export function WalletStatus({ className }: { className?: string }) {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })

  if (!isConnected || !address) {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-text-muted', className)}>
        <XCircle className="h-4 w-4 text-risk-critical" />
        <span>Not connected</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-primary" />
        <span className="text-sm text-text-secondary font-mono">{truncateAddress(address)}</span>
      </div>
      {balance && (
        <span className="text-xs font-mono text-text-muted border border-[#1e2d22] rounded px-2 py-0.5">
          {Number(balance.formatted).toFixed(4)} {balance.symbol}
        </span>
      )}
    </div>
  )
}
