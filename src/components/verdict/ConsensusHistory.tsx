import { GitMerge, Clock } from 'lucide-react'
import { ConfidenceScore } from './ConfidenceScore'
import { GreenwashingRiskBadge } from './GreenwashingRiskBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDateTime, verdictLabel } from '@/lib/utils/format'
import type { Verdict } from '@/types/verdict'
import { cn } from '@/lib/utils/cn'

const VERDICT_COLORS: Record<string, string> = {
  SUPPORTED: '#22c55e',
  PARTIALLY_SUPPORTED: '#eab308',
  INSUFFICIENT_EVIDENCE: '#6b7280',
  CONTRADICTED: '#ef4444',
  UNVERIFIABLE: '#6b7280',
}

interface ConsensusHistoryProps {
  history: Verdict[]
}

export function ConsensusHistory({ history }: ConsensusHistoryProps) {
  return (
    <div className="rounded-lg border border-[#1e2d22] bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <GitMerge className="h-4 w-4 text-text-muted" />
        <h3 className="text-sm font-semibold text-text-primary">Consensus History</h3>
        <span className="font-mono text-xs text-text-muted border border-[#1e2d22] rounded px-1.5 py-0.5">
          {history.length}
        </span>
      </div>

      {history.length === 0 ? (
        <EmptyState
          title="No consensus rounds"
          description="No consensus review has been run for this case."
          icon={<Clock className="h-7 w-7 text-text-muted" />}
          className="py-8"
        />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-[#1e2d22]" />

          <div className="space-y-4">
            {[...history].reverse().map((v, i) => (
              <div key={v.id} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className={cn(
                  'relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border',
                  i === 0 ? 'bg-primary/10 border-primary/40' : 'bg-surface border-[#1e2d22]'
                )}>
                  <span className="font-mono text-[10px] text-text-muted">{v.consensus_round}</span>
                </div>

                <div className="flex-1 rounded-md border border-[#1e2d22] bg-surface p-4 mb-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div
                        className="text-sm font-semibold font-mono mb-1"
                        style={{ color: VERDICT_COLORS[v.verification_verdict] || '#6b7280' }}
                      >
                        {verdictLabel(v.verification_verdict)}
                      </div>
                      <GreenwashingRiskBadge risk={v.greenwashing_risk} size="sm" />
                    </div>
                    <div className="flex items-center gap-3">
                      <ConfidenceScore score={v.confidence_score} size="sm" />
                      <div className="text-right text-xs text-text-muted">
                        <p>{formatDateTime(v.issued_at)}</p>
                        <p>{v.validator_count} validators</p>
                      </div>
                    </div>
                  </div>

                  {v.reasoning_summary && (
                    <p className="text-xs text-text-secondary mt-3 leading-relaxed line-clamp-3">
                      {v.reasoning_summary}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
