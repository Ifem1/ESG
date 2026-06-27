'use client'

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { truncateAddress } from '@/lib/utils/explorer'

export function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        if (!ready) {
          return (
            <Button variant="outline" size="sm" disabled>
              <Wallet className="h-4 w-4 mr-2" />
              Connect
            </Button>
          )
        }

        if (!connected) {
          return (
            <Button variant="outline" size="sm" onClick={openConnectModal}>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )
        }

        if (chain.unsupported) {
          return (
            <Button variant="destructive" size="sm" onClick={openChainModal}>
              Wrong Network
            </Button>
          )
        }

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={openChainModal}
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#1e2d22] bg-surface text-xs text-text-secondary hover:text-text-primary hover:bg-card transition-colors"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {chain.name}
            </button>
            <button
              onClick={openAccountModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#1e2d22] bg-surface text-sm text-text-primary hover:bg-card transition-colors font-mono"
            >
              <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <span className="text-[8px] text-primary font-bold">
                  {account.displayName?.charAt(0) || 'W'}
                </span>
              </div>
              {truncateAddress(account.address)}
            </button>
          </div>
        )
      }}
    </RainbowConnectButton.Custom>
  )
}
