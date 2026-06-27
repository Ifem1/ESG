'use client'

/**
 * Polls a GenLayer transaction until it reaches a terminal state,
 * then resolves success/failure from the execution result fields.
 *
 * GenLayer has TWO result fields:
 *   txExecutionResultName — GenVM:       FINISHED_WITH_RETURN | FINISHED_WITH_ERROR
 *   resultName            — Consensus:   SUCCESS | FAILURE | AGREE | MAJORITY_AGREE | …
 *
 * Either field signalling success = SUCCESS state.
 * ACCEPTED is treated as terminal on Studionet (it does not always progress to FINALIZED).
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from 'genlayer-js'
import { studionet } from 'genlayer-js/chains'
import { GENLAYER_RPC_URL } from '@/lib/constants/contract'

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------

export type GenLayerTxStatus =
  | 'idle'
  | 'PENDING'
  | 'PROPOSING'
  | 'COMMITTING'
  | 'REVEALING'
  | 'ACCEPTED'
  | 'FINALIZED'
  | 'UNDETERMINED'
  | 'VALIDATORS_TIMEOUT'
  | 'LEADER_TIMEOUT'
  | 'CANCELED'
  | 'FAILED_EXECUTION'
  | 'SUCCESS'

export interface GenLayerTxState {
  status: GenLayerTxStatus
  hash?: `0x${string}`
  executionResult?: string
  error?: string
}

const TERMINAL_STATES = new Set([
  'FINALIZED',
  'ACCEPTED',          // Studionet often stops here
  'UNDETERMINED',
  'CANCELED',
  'VALIDATORS_TIMEOUT',
  'LEADER_TIMEOUT',
])

const SUCCESS_RESULTS = new Set([
  'FINISHED_WITH_RETURN',
  'SUCCESS',
  'AGREE',
  'MAJORITY_AGREE',
])

const ERROR_RESULTS = new Set([
  'FINISHED_WITH_ERROR',
  'FAILURE',
])

const POLL_MS = 2500

function getReadClient() {
  return createClient({ chain: studionet, endpoint: GENLAYER_RPC_URL })
}

// -------------------------------------------------------------------------
// Hook
// -------------------------------------------------------------------------

export function useGenLayerTx() {
  const [state, setState] = useState<GenLayerTxState>({ status: 'idle' })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeHash = useRef<string | null>(null)

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const poll = useCallback(
    async (hash: `0x${string}`) => {
      if (activeHash.current !== hash) return

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = getReadClient() as any
        const tx = await client.getTransaction({ hash })

        const statusName: string = tx?.statusName ?? tx?.status ?? 'PENDING'
        const execResult: string = tx?.txExecutionResultName ?? ''
        const consensusResult: string = tx?.resultName ?? ''

        if (process.env.NODE_ENV === 'development') {
          console.log('[GenLayerTx]', { statusName, execResult, consensusResult, tx })
        }

        // Always update the pipeline status in the UI
        setState((prev) => ({ ...prev, status: statusName as GenLayerTxStatus, hash }))

        if (!TERMINAL_STATES.has(statusName)) {
          // Not done — keep polling
          timerRef.current = setTimeout(() => poll(hash), POLL_MS)
          return
        }

        // Terminal — resolve
        stopPolling()
        activeHash.current = null

        const resultToken = execResult || consensusResult

        if (SUCCESS_RESULTS.has(resultToken) || SUCCESS_RESULTS.has(execResult) || SUCCESS_RESULTS.has(consensusResult)) {
          setState({ status: 'SUCCESS', hash, executionResult: resultToken })
          return
        }

        if (ERROR_RESULTS.has(resultToken) || ERROR_RESULTS.has(execResult) || ERROR_RESULTS.has(consensusResult)) {
          setState({
            status: 'FAILED_EXECUTION',
            hash,
            executionResult: execResult,
            error: `GenVM execution failed: ${execResult || consensusResult}`,
          })
          // Fetch debug trace in dev
          try {
            const trace = await client.debugTraceTransaction({ hash, round: 0 })
            console.group(`[GenLayer] Debug trace ${hash}`)
            if (trace?.stderr) console.error('stderr:', trace.stderr)
            if (trace?.genvm_log) console.log('genvm_log:', trace.genvm_log)
            console.log('trace:', trace)
            console.groupEnd()
          } catch {
            console.warn('[GenLayer] debugTraceTransaction unavailable')
          }
          return
        }

        if (statusName === 'VALIDATORS_TIMEOUT' || statusName === 'LEADER_TIMEOUT') {
          setState({
            status: statusName as GenLayerTxStatus,
            hash,
            error: `${statusName.replace(/_/g, ' ')} — validators did not reach agreement. Retry the transaction.`,
          })
          return
        }

        if (statusName === 'UNDETERMINED') {
          setState({
            status: 'UNDETERMINED',
            hash,
            error: 'Validators could not reach consensus (UNDETERMINED). Retry the transaction.',
          })
          return
        }

        // ACCEPTED/FINALIZED with no known result token — assume success
        // (Studionet sometimes omits resultName when consensus passed cleanly)
        setState({ status: 'SUCCESS', hash, executionResult: statusName })
      } catch (err) {
        console.warn('[GenLayer] poll error:', err)
        timerRef.current = setTimeout(() => poll(hash), POLL_MS * 2)
      }
    },
    [stopPolling]
  )

  const watch = useCallback(
    (hash: `0x${string}`) => {
      stopPolling()
      activeHash.current = hash
      setState({ status: 'PENDING', hash })
      timerRef.current = setTimeout(() => poll(hash), POLL_MS)
    },
    [poll, stopPolling]
  )

  const reset = useCallback(() => {
    stopPolling()
    activeHash.current = null
    setState({ status: 'idle' })
  }, [stopPolling])

  useEffect(() => () => stopPolling(), [stopPolling])

  return { state, watch, reset }
}
