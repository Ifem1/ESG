'use client'

import { useAccount, useChainId } from 'wagmi'
import { Shield, Wifi, FileCode2, ExternalLink, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ConnectButton } from '@/components/wallet/ConnectButton'
import { getContractExplorerUrl } from '@/lib/utils/explorer'
import { CONTRACT_ADDRESS, GENLAYER_RPC_URL, EXPLORER_URL, CHAIN_ID } from '@/lib/constants/contract'
import { useState } from 'react'

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1e2d22] last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">{label}</p>
        <p className="font-mono text-xs text-text-secondary truncate">{value || '—'}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={copy} className="flex-shrink-0 h-7 w-7 p-0">
        {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  )
}

export function SettingsPanel() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  const contractDeployed = CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'

  return (
    <div className="space-y-6">
      {/* Wallet */}
      <div className="rounded-lg border border-[#1e2d22] bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Wallet Connection</h2>
        </div>
        <Separator className="mb-4" />

        {isConnected ? (
          <div className="space-y-0">
            <CopyField label="Connected Address" value={address || ''} />
            <div className="flex items-center justify-between py-3 border-b border-[#1e2d22]">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">Network</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-text-secondary">GenLayer StudioNet</span>
                </div>
              </div>
              <span className="font-mono text-xs text-text-muted">Chain {chainId}</span>
            </div>
            <div className="pt-3">
              <ConnectButton />
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-text-secondary mb-4">
              Connect your wallet to submit ESG claims and request consensus reviews.
            </p>
            <ConnectButton />
          </div>
        )}
      </div>

      {/* Network */}
      <div className="rounded-lg border border-[#1e2d22] bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wifi className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Network Configuration</h2>
        </div>
        <Separator className="mb-4" />

        <div className="space-y-0">
          <CopyField label="RPC URL" value={GENLAYER_RPC_URL} />
          <CopyField label="Chain ID" value={String(CHAIN_ID)} />
          <CopyField label="Explorer URL" value={EXPLORER_URL} />
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">Native Currency</p>
              <p className="font-mono text-xs text-text-secondary">GEN</p>
            </div>
            <a
              href="https://studio.genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              GenLayer Studio
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Contract */}
      <div className="rounded-lg border border-[#1e2d22] bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileCode2 className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Contract</h2>
        </div>
        <Separator className="mb-4" />

        {contractDeployed ? (
          <div className="space-y-0">
            <CopyField label="Contract Address" value={CONTRACT_ADDRESS} />
            <div className="flex items-center justify-between py-3 border-b border-[#1e2d22]">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">Status</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-xs text-primary">Deployed</span>
                </div>
              </div>
            </div>
            <div className="pt-3">
              <a
                href={getContractExplorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-[#eab308]/30 bg-[#1a1500] p-4">
            <p className="text-xs text-[#eab308] mb-1">Contract not deployed</p>
            <p className="text-xs text-text-muted">
              Set <span className="font-mono">NEXT_PUBLIC_CONTRACT_ADDRESS</span> in your environment
              variables after deploying the ESG Oracle contract to StudioNet.
            </p>
          </div>
        )}
      </div>

      {/* About */}
      <div className="rounded-lg border border-[#1e2d22] bg-card p-6">
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">About</h2>
        <Separator className="mb-4" />
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-text-muted uppercase tracking-wider mb-0.5">Protocol</p>
            <p className="text-text-secondary">ESG Oracle Protocol</p>
          </div>
          <div>
            <p className="text-text-muted uppercase tracking-wider mb-0.5">Network</p>
            <p className="text-text-secondary">GenLayer StudioNet</p>
          </div>
          <div>
            <p className="text-text-muted uppercase tracking-wider mb-0.5">Contract Language</p>
            <p className="text-text-secondary">Python (GenLayer)</p>
          </div>
          <div>
            <p className="text-text-muted uppercase tracking-wider mb-0.5">Frontend</p>
            <p className="text-text-secondary">Next.js 14 / Vercel</p>
          </div>
        </div>
      </div>
    </div>
  )
}
