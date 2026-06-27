'use client'

import { useAccount, useChainId } from 'wagmi'
import { CONTRACT_ADDRESS, CHAIN_ID } from '@/lib/constants/contract'

/**
 * Rendered only in development (NODE_ENV=development).
 * Shows wallet wiring at a glance — wallet address, chain, contract address.
 * The write client account is derived from the same wallet address at call time.
 */
export function DebugPanel() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  if (process.env.NODE_ENV !== 'development') return null

  const chainMatch = chainId === CHAIN_ID

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-mono text-[10px] bg-black/90 border border-yellow-500/40 rounded-lg p-3 w-80 space-y-1.5 shadow-xl">
      <p className="text-yellow-400 font-bold text-[11px] mb-2">⚙ Dev — Wallet Wiring</p>

      <Row label="Wallet connected" value={isConnected ? '✅ yes' : '❌ no'} />
      <Row
        label="Connected address"
        value={address ?? '—'}
        warn={!address}
      />
      <Row
        label="Write client account"
        value={address ? `${address} (same)` : '— (not set)'}
        warn={!address}
      />
      <Row
        label="Chain ID"
        value={`${chainId}`}
        warn={!chainMatch}
        note={chainMatch ? '✅ correct' : `❌ expected ${CHAIN_ID}`}
      />
      <Row label="Contract address" value={CONTRACT_ADDRESS} />
      <Row
        label="Signer source"
        value="window.ethereum (injected)"
      />

      {!chainMatch && (
        <p className="text-red-400 text-[10px] mt-1 pt-1 border-t border-red-500/30">
          Wrong network — switch to GenLayer StudioNet (chain {CHAIN_ID}) in your wallet.
        </p>
      )}
      {!address && (
        <p className="text-yellow-400 text-[10px] mt-1 pt-1 border-t border-yellow-500/30">
          No wallet connected — connect to enable writes.
        </p>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  warn = false,
  note,
}: {
  label: string
  value: string
  warn?: boolean
  note?: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-gray-500 uppercase tracking-wider text-[9px]">{label}</span>
      <span className={`break-all ${warn ? 'text-red-400' : 'text-green-300'}`}>
        {value}
        {note && <span className="text-gray-400 ml-1">{note}</span>}
      </span>
    </div>
  )
}
