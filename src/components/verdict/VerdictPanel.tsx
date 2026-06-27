'use client'

import { RefreshCw, CheckCircle2, Clock, ArrowRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ConfidenceScore } from './ConfidenceScore'
import { GreenwashingRiskBadge } from './GreenwashingRiskBadge'
import { VerdictMetricRow } from './VerdictMetricRow'
import { LoadingState } from '@/components/shared/LoadingState'
import { verdictLabel, formatDateTime } from '@/lib/utils/format'
import type { Verdict } from '@/types/verdict'
import { cn } from '@/lib/utils/cn'

const VERDICT_COLORS: Record<string, string> = {
  SUPPORTED: '#22c55e',
  PARTIALLY_SUPPORTED: '#eab308',
  INSUFFICIENT_EVIDENCE: '#6b7280',
  CONTRADICTED: '#ef4444',
  UNVERIFIABLE: '#6b7280',
}

interface VerdictPanelProps {
  verdict: Verdict | null
  loading: boolean
  onRefresh?: () => void
}

export function VerdictPanel({ verdict, loading, onRefresh }: VerdictPanelProps) {
  return (
    <div className="rounded-lg border border-[#1e2d22] bg-card">
      <div className="flex items-center justify-between p-5 pb-0">
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
          AI Consensus Verdict
        </h3>
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingState message="Loading verdict..." className="py-10" />
      ) : !verdict ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface border border-[#1e2d22] mb-3">
            <Clock className="h-6 w-6 text-text-muted" />
          </div>
          <p className="text-sm font-medium text-text-primary mb-1">No Verdict Yet</p>
          <p className="text-xs text-text-secondary max-w-xs">
            Submit evidence and request a consensus review to trigger the AI verification process.
          </p>
        </div>
      ) : (
        <div className="p-5 space-y-5">
          {/* Top: Verdict + Confidence + Risk */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <ConfidenceScore score={verdict.confidence_score} size="lg" />

            <div className="flex-1 space-y-2">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Verification Verdict</p>
                <div
                  className="text-lg font-bold font-mono"
                  style={{ color: VERDICT_COLORS[verdict.verification_verdict] || '#6b7280' }}
                >
                  {verdictLabel(verdict.verification_verdict)}
                </div>
              </div>

              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Greenwashing Risk</p>
                <GreenwashingRiskBadge risk={verdict.greenwashing_risk} size="md" />
              </div>
            </div>

            <div className="sm:text-right text-xs text-text-muted space-y-1">
              <p>Round #{verdict.consensus_round}</p>
              <p>{verdict.validator_count} validators</p>
              <p>{formatDateTime(verdict.issued_at)}</p>
            </div>
          </div>

          <Separator />

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <div>
              <VerdictMetricRow label="Compliance Assessment" value={verdict.compliance_assessment} />
              <VerdictMetricRow label="Data Quality" value={verdict.data_quality} />
              <VerdictMetricRow label="Impact Scale" value={verdict.impact_scale} />
              <VerdictMetricRow
                label="Methodology Soundness"
                value={`${Math.round(verdict.methodology_soundness * 100)}%`}
                mono
              />
            </div>
            <div>
              <VerdictMetricRow
                label="Transparency Score"
                value={`${Math.round(verdict.transparency_score * 100)}%`}
                mono
              />
              <VerdictMetricRow
                label="Third-Party Verified"
                value={verdict.third_party_verification}
                valueClass={verdict.third_party_verification ? 'text-[#22c55e]' : 'text-[#ef4444]'}
              />
              <VerdictMetricRow
                label="Follow-Up Audit"
                value={verdict.follow_up_audit_needed ? 'Required' : 'Not Required'}
                valueClass={verdict.follow_up_audit_needed ? 'text-[#f97316]' : 'text-[#22c55e]'}
              />
              <VerdictMetricRow label="Model Version" value={verdict.model_version} mono />
            </div>
          </div>

          <Separator />

          {/* Reasoning */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Reasoning Summary</p>
            <p className="text-sm text-text-secondary leading-relaxed">{verdict.reasoning_summary}</p>
          </div>

          {/* Supporting Evidence */}
          {verdict.key_supporting_evidence?.length > 0 && (
            <div>
              <p className="text-xs text-[#22c55e] uppercase tracking-wider mb-2">Key Supporting Evidence</p>
              <ul className="space-y-1">
                {verdict.key_supporting_evidence.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                    <CheckCircle2 className="h-3 w-3 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contradicting Evidence */}
          {verdict.key_contradicting_evidence?.length > 0 && (
            <div>
              <p className="text-xs text-[#ef4444] uppercase tracking-wider mb-2">Key Contradicting Evidence</p>
              <ul className="space-y-1">
                {verdict.key_contradicting_evidence.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                    <AlertTriangle className="h-3 w-3 text-[#ef4444] mt-0.5 flex-shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence Gaps */}
          {verdict.evidence_gaps && (
            <div className="rounded-md border border-[#eab308]/30 bg-[#1a1500] p-3">
              <p className="text-xs text-[#eab308] uppercase tracking-wider mb-1">Evidence Gaps</p>
              <p className="text-xs text-text-secondary">{verdict.evidence_gaps}</p>
            </div>
          )}

          {/* Recommended Action */}
          {verdict.recommended_next_action && (
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
              <p className="text-xs text-primary uppercase tracking-wider mb-1">Recommended Next Action</p>
              <div className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-text-secondary">{verdict.recommended_next_action}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
