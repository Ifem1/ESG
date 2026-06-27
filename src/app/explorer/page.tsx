'use client'

import { useState } from 'react'
import { ExternalLink, Search, Hash, FileCode2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CONTRACT_ADDRESS, EXPLORER_URL } from '@/lib/constants/contract'
import { getAddressExplorerUrl as explorerAddressUrl, getTxExplorerUrl as explorerTxUrl } from '@/lib/utils/explorer'
import { cn } from '@/lib/utils/cn'

const EXPLORER_LINKS = [
  {
    label: 'Contract Address',
    description: 'View the ESG Oracle Intelligent Contract on StudioNet',
    value: CONTRACT_ADDRESS,
    url: explorerAddressUrl(CONTRACT_ADDRESS),
  },
  {
    label: 'GenLayer Studio',
    description: 'Deploy and manage contracts via GenLayer Studio',
    value: 'studio.genlayer.com',
    url: 'https://studio.genlayer.com',
  },
  {
    label: 'GenLayer Docs',
    description: 'Official GenLayer developer documentation',
    value: 'docs.genlayer.com',
    url: 'https://docs.genlayer.com',
  },
]

export default function ExplorerPage() {
  const [txSearch, setTxSearch] = useState('')
  const [addrSearch, setAddrSearch] = useState('')

  const contractDeployed = CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Explorer</h1>
        <p className="text-sm text-text-secondary mt-1">
          On-chain verification — search transactions, view contract state, and audit evidence records.
        </p>
      </div>

      {/* Contract status */}
      <div className="rounded-lg border border-[#1e2d22] bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileCode2 className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-text-primary">ESG Oracle Contract</h2>
          {contractDeployed && (
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary">Live on StudioNet</span>
            </div>
          )}
        </div>

        {contractDeployed ? (
          <div className="space-y-3">
            <div className="rounded-md bg-surface border border-[#1e2d22] p-3">
              <p className="text-xs text-text-muted mb-1">Contract Address</p>
              <p className="font-mono text-sm text-text-primary break-all">{CONTRACT_ADDRESS}</p>
            </div>
            <a href={explorerAddressUrl(CONTRACT_ADDRESS)} target="_blank" rel="noopener noreferrer">
              <Button className="w-full sm:w-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GenLayer Explorer
              </Button>
            </a>
          </div>
        ) : (
          <div className="rounded-md border border-[#eab308]/30 bg-[#1a1500] p-4">
            <p className="text-xs text-[#eab308] mb-1">Not yet deployed</p>
            <p className="text-xs text-text-muted">
              Set <span className="font-mono">NEXT_PUBLIC_CONTRACT_ADDRESS</span> to enable explorer links.
            </p>
          </div>
        )}
      </div>

      {/* Transaction lookup */}
      <div className="rounded-lg border border-[#1e2d22] bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="h-4 w-4 text-text-secondary" />
          <h2 className="text-sm font-semibold text-text-primary">Transaction Lookup</h2>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="0x transaction hash..."
            value={txSearch}
            onChange={(e) => setTxSearch(e.target.value)}
            className="font-mono text-sm"
          />
          <a
            href={txSearch ? explorerTxUrl(txSearch) : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(!txSearch && 'pointer-events-none opacity-50')}
          >
            <Button disabled={!txSearch}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
          </a>
        </div>
      </div>

      {/* Address lookup */}
      <div className="rounded-lg border border-[#1e2d22] bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-text-secondary" />
          <h2 className="text-sm font-semibold text-text-primary">Address Lookup</h2>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="0x wallet or contract address..."
            value={addrSearch}
            onChange={(e) => setAddrSearch(e.target.value)}
            className="font-mono text-sm"
          />
          <a
            href={addrSearch ? explorerAddressUrl(addrSearch) : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(!addrSearch && 'pointer-events-none opacity-50')}
          >
            <Button disabled={!addrSearch}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
          </a>
        </div>
      </div>

      {/* Quick links */}
      <div className="rounded-lg border border-[#1e2d22] bg-card p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Protocol Resources</h2>
        <div className="space-y-3">
          {EXPLORER_LINKS.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-md border border-[#1e2d22] bg-surface hover:border-primary/30 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                  {link.label}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{link.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors flex-shrink-0 ml-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
