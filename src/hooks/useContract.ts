'use client'

/**
 * Contract write hooks — injected wallet only.
 *
 * Rules:
 *  - Connected wagmi address = msg.sender (never generated).
 *  - window.ethereum = EIP-1193 signer.
 *  - Each hook watches the tx hash via useGenLayerTx (polls to FINALIZED).
 *  - Only FINALIZED + FINISHED_WITH_RETURN = success.
 *  - One pending tx per hook at a time (duplicate submission blocked).
 */

import { useState, useCallback, useRef } from 'react'
import { useAccount } from 'wagmi'
import { contractWrite } from '@/lib/genlayer/client'
import { useGenLayerTx } from './useGenLayerTx'
import type { ClaimFormData } from '@/types/claim'
import type { EvidenceFormData } from '@/types/evidence'

// ---------------------------------------------------------------------------
// EIP-1193 provider
// ---------------------------------------------------------------------------

function getInjectedProvider(): unknown {
  if (typeof window === 'undefined') return null
  return (window as Window & { ethereum?: unknown }).ethereum ?? null
}

// ---------------------------------------------------------------------------
// Shared submission guard — prevents duplicate submissions while pending
// ---------------------------------------------------------------------------

function useSubmitGuard() {
  const submitting = useRef(false)

  const guard = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    if (submitting.current) {
      throw new Error(
        'A transaction is already pending for this account. GenLayer queues transactions per account — wait for the current one to finalize.'
      )
    }
    submitting.current = true
    try {
      return await fn()
    } finally {
      submitting.current = false
    }
  }, [])

  return { guard, isSubmitting: () => submitting.current }
}

// ---------------------------------------------------------------------------
// useCreateCase
// ---------------------------------------------------------------------------

export function useCreateCase() {
  const { address, isConnected } = useAccount()
  const { state: txState, watch, reset } = useGenLayerTx()
  const { guard } = useSubmitGuard()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createCase = useCallback(
    async (data: ClaimFormData) => {
      if (!isConnected || !address) throw new Error('Connect your wallet to continue.')
      const provider = getInjectedProvider()
      if (!provider) throw new Error('No injected wallet found.')

      return guard(async () => {
        setError(null)
        setIsPending(true)
        try {
          const hash = await contractWrite(
            'create_case',
            [
              data.title,
              data.company,
              data.claim_category,
              data.industry,
              data.location,
              data.esg_claim,
              data.claim_source,
              data.reporting_period,
              data.claimed_impact,
              data.claimed_action,
              data.assessment_objective,
              data.evidence_summary,
            ],
            provider,
            address
          )
          watch(hash)
          return hash
        } catch (e) {
          const err = e instanceof Error ? e : new Error(String(e))
          setError(err)
          throw err
        } finally {
          setIsPending(false)
        }
      })
    },
    [address, isConnected, guard, watch]
  )

  return { createCase, txState, isPending, hash: txState.hash, error, reset }
}

// ---------------------------------------------------------------------------
// useAddEvidence
// ---------------------------------------------------------------------------

export function useAddEvidence() {
  const { address, isConnected } = useAccount()
  const { state: txState, watch, reset } = useGenLayerTx()
  const { guard } = useSubmitGuard()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const addEvidence = useCallback(
    async (caseId: string, data: EvidenceFormData) => {
      if (!isConnected || !address) throw new Error('Connect your wallet to continue.')
      const provider = getInjectedProvider()
      if (!provider) throw new Error('No injected wallet found.')

      return guard(async () => {
        setError(null)
        setIsPending(true)
        try {
          const hash = await contractWrite(
            'add_evidence',
            [
              caseId,
              data.title,
              data.ev_type,
              data.url,
              data.url_hash,
              data.source_name,
              data.credibility_note,
              data.relevance,
              data.category,
            ],
            provider,
            address
          )
          watch(hash)
          return hash
        } catch (e) {
          const err = e instanceof Error ? e : new Error(String(e))
          setError(err)
          throw err
        } finally {
          setIsPending(false)
        }
      })
    },
    [address, isConnected, guard, watch]
  )

  return { addEvidence, txState, isPending, hash: txState.hash, error, reset }
}

// ---------------------------------------------------------------------------
// useRequestConsensus
// ---------------------------------------------------------------------------

export function useRequestConsensus() {
  const { address, isConnected } = useAccount()
  const { state: txState, watch, reset } = useGenLayerTx()
  const { guard } = useSubmitGuard()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const requestConsensus = useCallback(
    async (caseId: string) => {
      if (!isConnected || !address) throw new Error('Connect your wallet to continue.')
      const provider = getInjectedProvider()
      if (!provider) throw new Error('No injected wallet found.')

      return guard(async () => {
        setError(null)
        setIsPending(true)
        try {
          const hash = await contractWrite(
            'request_consensus_review',
            [caseId],
            provider,
            address
          )
          watch(hash)
          return hash
        } catch (e) {
          const err = e instanceof Error ? e : new Error(String(e))
          setError(err)
          throw err
        } finally {
          setIsPending(false)
        }
      })
    },
    [address, isConnected, guard, watch]
  )

  return { requestConsensus, txState, isPending, hash: txState.hash, error, reset }
}

// ---------------------------------------------------------------------------
// Legacy shim — useTransactionReceipt kept for any remaining consumers
// ---------------------------------------------------------------------------

export function useTransactionReceipt(hash?: `0x${string}`) {
  // No-op shim — polling is now done inside useGenLayerTx
  return { isLoading: false, isSuccess: false, isError: false, data: undefined }
}
