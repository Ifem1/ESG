'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GitMerge, RefreshCw, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfidenceScore } from '@/components/verdict/ConfidenceScore'
import { GreenwashingRiskBadge } from '@/components/verdict/GreenwashingRiskBadge'
import { LoadingState } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { useAllClaims } from '@/hooks/useClaim'
import { getVerdictHistory } from '@/lib/genlayer/contract'
import { verdictLabel, formatDateTime, claimCategoryLabel } from '@/lib/utils/format'
import type { Verdict } from '@/types/verdict'
import type { Claim } from '@/types/claim'

interface VerdictWithClaim {
  verdict: Verdict
  claim: Claim
}

export default function ConsensusPage() {
  const { claims, loading, error, refetch } = useAllClaims()
  const [allVerdicts, setAllVerdicts] = useState<VerdictWithClaim[]>([])
  const [verdictsLoading, setVerdictsLoading] = useState(true)

  useEffect(() => {
    if (claims.length === 0) { setVerdictsLoading(false); return }
    setVerdictsLoading(true)
    Promise.all(
      claims.map(async (c) => {
        const history = await getVerdictHistory(c.id)
        return history.map((v) => ({ verdict: v, claim: c }))
      })
    )
      .then((results) => {
        const flat = results.flat()
        flat.sort((a, b) => b.verdict.issued_at - a.verdict.issued_at)
        setAllVerdicts(flat)
      })
      .finally(() => setVerdictsLoading(false))
  }, [claims])

  const VERDICT_COLORS: Record<string, string> = {
    SUPPORTED: '#22c55e',
    PARTIALLY_SUPPORTED: '#eab308',
    INSUFFICIENT_EVIDENCE: '#6b7280',
    CONTRADICTED: '#ef4444',
    UNVERIFIABLE: '#6b7280',
  }

  if (loading || verdictsLoading) {
    return <LoadingState message="Loading consensus history..." className="min-h-[50vh]" />
  }
  if (error) return <ErrorState description={error} onRetry={refetch} />

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitMerge className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-text-primary">Consensus History</h1>
          </div>
          <p className="text-sm text-text-secondary">
            All AI consensus verdicts issued across the ESG Oracle network
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={refetch}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-[#1e2d22] bg-card p-4 text-center">
          <p className="text-2xl font-bold font-mono text-primary">{allVerdicts.length}</p>
          <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5">Total Verdicts</p>
        </div>
        <div className="rounded-lg border border-[#1e2d22] bg-card p-4 text-center">
          <p className="text-2xl font-bold font-mono text-text-primary">{claims.length}</p>
          <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5">Total Cases</p>
        </div>
        <div className="rounded-lg border border-[#1e2d22] bg-card p-4 text-center">
          <p className="text-2xl font-bold font-mono text-[#22c55e]">
            {allVerdicts.length > 0
              ? `${Math.round(
                  allVerdicts.reduce((s, { verdict: v }) => s + v.confidence_score, 0) /
                  allVerdicts.length
                )}%`
              : 'N/A'}
          </p>
          <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5">Avg Confidence</p>
        </div>
      </div>

      {/* Timeline */}
      {allVerdicts.length === 0 ? (
        <EmptyState
          title="No consensus verdicts yet"
          description="Submit ESG claims and request consensus reviews to see verdicts here."
          action={
            <Link href="/claims/new">
              <Button size="sm">Submit Claim</Button>
            </Link>
          }
        />
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-[#1e2d22]" />
          <div className="space-y-4">
            {allVerdicts.map(({ verdict, claim }, i) => (
              <div key={`${verdict.id}-${i}`} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#1e2d22] bg-card">
                  <span className="font-mono text-[10px] text-text-muted">R{verdict.consensus_round}</span>
                </div>

                {/* Card */}
                <Link href={`/claims/${claim.id}`} className="flex-1 mb-2">
                  <div className="rounded-lg border border-[#1e2d22] bg-card p-4 hover:border-primary/30 transition-colors group cursor-pointer">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs text-text-muted">#{claim.id}</span>
                          <span
                            className="text-xs font-semibold font-mono"
                            style={{ color: VERDICT_COLORS[verdict.verification_verdict] || '#6b7280' }}
                          >
                            {verdictLabel(verdict.verification_verdict)}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                          {claim.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-text-muted">
                          <span>{claim.company}</span>
                          <span>·</span>
                          <span>{claimCategoryLabel(claim.claim_category)}</span>
                          <span>·</span>
                          <span>{formatDateTime(verdict.issued_at)}</span>
                          <span>·</span>
                          <span>{verdict.validator_count} validators</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <GreenwashingRiskBadge risk={verdict.greenwashing_risk} size="sm" />
                        <ConfidenceScore score={verdict.confidence_score} size="sm" />
                        <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    {verdict.reasoning_summary && (
                      <p className="text-xs text-text-secondary mt-3 line-clamp-2 leading-relaxed border-t border-[#1e2d22] pt-3">
                        {verdict.reasoning_summary}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
