'use client'

import { CheckCircle, XCircle, Loader2, ExternalLink, AlertTriangle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTxExplorerUrl, truncateHash } from '@/lib/utils/explorer'
import type { GenLayerTxState, GenLayerTxStatus } from '@/hooks/useGenLayerTx'
import { cn } from '@/lib/utils/cn'

interface TransactionStatusProps {
  state: GenLayerTxState
  onReset?: () => void
  className?: string
}

const STATUS_META: Record<
  GenLayerTxStatus,
  { label: string; sub: string; color: 'green' | 'yellow' | 'red' | 'blue' | 'muted'; spin?: boolean }
> = {
  idle: { label: '', sub: '', color: 'muted' },
  PENDING:           { label: 'Submitted',  sub: 'Waiting for a validator to pick up the transaction…', color: 'muted',  spin: true },
  PROPOSING:         { label: 'Proposing',  sub: 'Leader validator is executing the contract…',         color: 'blue',   spin: true },
  COMMITTING:        { label: 'Committing', sub: 'Validators are committing their votes…',              color: 'blue',   spin: true },
  REVEALING:         { label: 'Revealing',  sub: 'Validators are revealing vote results…',              color: 'blue',   spin: true },
  ACCEPTED:          { label: 'Accepted',   sub: 'Consensus reached — waiting for finalization…',       color: 'yellow', spin: true },
  FINALIZED:         { label: 'Finalized',  sub: 'Transaction finalized — checking execution result…',  color: 'yellow', spin: true },
  SUCCESS:           { label: 'Success',    sub: 'Execution finished — result stored on-chain.',        color: 'green'  },
  FAILED_EXECUTION:  { label: 'Execution Error', sub: 'The contract threw an error. Check dev console for the debug trace.', color: 'red' },
  UNDETERMINED:      { label: 'Undetermined', sub: 'Validators could not reach consensus. You can retry.', color: 'red' },
  VALIDATORS_TIMEOUT:{ label: 'Validators Timeout', sub: 'Validators did not respond in time. This is a Studionet network issue — retry.', color: 'yellow' },
  LEADER_TIMEOUT:    { label: 'Leader Timeout', sub: 'Leader validator timed out. Retry the transaction.', color: 'yellow' },
  CANCELED:          { label: 'Canceled',   sub: 'Transaction was canceled.',                           color: 'muted' },
}

const PIPELINE: GenLayerTxStatus[] = [
  'PENDING', 'PROPOSING', 'COMMITTING', 'REVEALING', 'ACCEPTED', 'FINALIZED',
]

export function TransactionStatus({ state, onReset, className }: TransactionStatusProps) {
  if (state.status === 'idle') return null

  const meta = STATUS_META[state.status] ?? STATUS_META.PENDING
  const isActive = PIPELINE.includes(state.status) || state.status === 'FINALIZED'
  const isFinal = state.status === 'SUCCESS' || state.status === 'FAILED_EXECUTION'
  const isWarning = state.status === 'VALIDATORS_TIMEOUT' || state.status === 'LEADER_TIMEOUT' || state.status === 'UNDETERMINED'

  const borderClass =
    state.status === 'SUCCESS' ? 'border-[#22c55e]/30 bg-[#0a1a0d]' :
    isFinal ? 'border-[#ef4444]/30 bg-[#1a0808]' :
    isWarning ? 'border-[#eab308]/30 bg-[#1a1500]' :
    'border-[#1e2d22] bg-surface'

  return (
    <div className={cn('rounded-lg border p-4 space-y-3', borderClass, className)}>

      {/* Header */}
      <div className="flex items-start gap-3">
        {state.status === 'SUCCESS' && <CheckCircle className="h-5 w-5 text-[#22c55e] flex-shrink-0 mt-0.5" />}
        {isFinal && state.status !== 'SUCCESS' && <XCircle className="h-5 w-5 text-[#ef4444] flex-shrink-0 mt-0.5" />}
        {isWarning && <AlertTriangle className="h-5 w-5 text-[#eab308] flex-shrink-0 mt-0.5" />}
        {(isActive) && !isFinal && !isWarning && <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0 mt-0.5" />}
        {!isActive && !isFinal && !isWarning && <Clock className="h-5 w-5 text-text-muted flex-shrink-0 mt-0.5" />}

        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-medium',
            state.status === 'SUCCESS' ? 'text-[#22c55e]' :
            isFinal ? 'text-[#ef4444]' :
            isWarning ? 'text-[#eab308]' :
            'text-text-primary'
          )}>
            {meta.label}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">{meta.sub}</p>
          {state.error && !isFinal && (
            <p className="text-xs text-[#eab308] mt-1 break-all">{state.error}</p>
          )}
          {state.error && isFinal && (
            <p className="text-xs text-[#ef4444]/80 mt-1 break-all font-mono">{state.error}</p>
          )}
        </div>

        {onReset && (isFinal || isWarning || state.status === 'CANCELED') && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-text-muted text-xs flex-shrink-0">
            {isWarning ? 'Retry' : 'Dismiss'}
          </Button>
        )}
      </div>

      {/* Pipeline progress bar */}
      {(isActive || isWarning) && !isFinal && (
        <div className="flex items-center gap-1">
          {PIPELINE.map((s) => {
            const idx = PIPELINE.indexOf(s)
            const curIdx = PIPELINE.indexOf(state.status as GenLayerTxStatus)
            const done = idx < curIdx
            const active = idx === curIdx

            return (
              <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
                <div className={cn(
                  'h-1.5 w-1.5 rounded-full flex-shrink-0',
                  done ? 'bg-primary' :
                  active ? 'bg-primary animate-pulse' :
                  'bg-[#1e2d22]'
                )} />
                {idx < PIPELINE.length - 1 && (
                  <div className={cn('h-px flex-1', done ? 'bg-primary' : 'bg-[#1e2d22]')} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Pipeline labels */}
      {(isActive || isWarning) && !isFinal && (
        <div className="flex justify-between">
          {PIPELINE.map((s) => (
            <span key={s} className={cn(
              'text-[9px] font-mono uppercase tracking-wider',
              state.status === s ? 'text-primary' : 'text-text-muted'
            )}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </span>
          ))}
        </div>
      )}

      {/* Explorer link */}
      {state.hash && (
        <div className="flex items-center gap-2 pt-1 border-t border-[#1e2d22]">
          <span className="text-xs font-mono text-text-muted">{truncateHash(state.hash)}</span>
          <a
            href={getTxExplorerUrl(state.hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary flex items-center gap-1 hover:underline ml-auto"
          >
            Explorer <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  )
}
