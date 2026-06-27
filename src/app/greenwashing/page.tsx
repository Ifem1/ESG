'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RiskDistribution } from '@/components/dashboard/RiskMatrix'
import { GreenwashingRiskBadge } from '@/components/verdict/GreenwashingRiskBadge'
import { ConfidenceScore } from '@/components/verdict/ConfidenceScore'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { useAllClaims } from '@/hooks/useClaim'
import { getLatestVerdict } from '@/lib/genlayer/contract'
import { claimCategoryLabel, formatTimeAgo, verdictLabel } from '@/lib/utils/format'
import type { Verdict } from '@/types/verdict'
import type { Claim } from '@/types/claim'

const RISK_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'MINIMAL']

interface ClaimWithVerdict {
  claim: Claim
  verdict: Verdict
}

export default function GreenwashingPage() {
  const { claims, loading, error, refetch } = useAllClaims()
  const [claimsWithVerdicts, setClaimsWithVerdicts] = useState<ClaimWithVerdict[]>([])
  const [verdictsLoading, setVerdictsLoading] = useState(true)

  useEffect(() => {
    if (claims.length === 0) { setVerdictsLoading(false); return }
    setVerdictsLoading(true)
    Promise.all(
      claims.map(async (c) => {
        const v = await getLatestVerdict(c.id)
        return v ? { claim: c, verdict: v } : null
      })
    )
      .then((results) =>
        setClaimsWithVerdicts(results.filter(Boolean) as ClaimWithVerdict[])
      )
      .finally(() => setVerdictsLoading(false))
  }, [claims])

  const sortedByRisk = useMemo(() => {
    return [...claimsWithVerdicts].sort(
      (a, b) =>
        RISK_ORDER.indexOf(a.verdict.greenwashing_risk) -
        RISK_ORDER.indexOf(b.verdict.greenwashing_risk)
    )
  }, [claimsWithVerdicts])

  const riskDistribution = useMemo(() => {
    return claimsWithVerdicts.reduce<Record<string, number>>((acc, { verdict }) => {
      acc[verdict.greenwashing_risk] = (acc[verdict.greenwashing_risk] || 0) + 1
      return acc
    }, {})
  }, [claimsWithVerdicts])

  const criticalAndHigh = sortedByRisk.filter(
    ({ verdict }) =>
      verdict.greenwashing_risk === 'CRITICAL' || verdict.greenwashing_risk === 'HIGH'
  )

  if (loading || verdictsLoading) {
    return <LoadingState message="Analysing greenwashing risk..." className="min-h-[50vh]" />
  }
  if (error) return <ErrorState description={error} onRetry={refetch} />

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-5 w-5 text-[#f97316]" />
            <h1 className="text-2xl font-bold text-text-primary">Greenwashing Risk Terminal</h1>
          </div>
          <p className="text-sm text-text-secondary">
            AI-powered greenwashing risk analysis across all verified ESG claims
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={refetch}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {RISK_ORDER.map((risk) => {
          const count = riskDistribution[risk] || 0
          const colors: Record<string, string> = {
            CRITICAL: '#ef4444',
            HIGH: '#f97316',
            MEDIUM: '#eab308',
            LOW: '#22c55e',
            MINIMAL: '#22c55e',
          }
          return (
            <div
              key={risk}
              className="rounded-lg border p-4 text-center"
              style={{
                borderColor: `${colors[risk]}30`,
                backgroundColor: `${colors[risk]}08`,
              }}
            >
              <p className="text-2xl font-bold font-mono" style={{ color: colors[risk] }}>
                {count}
              </p>
              <p className="text-xs font-mono uppercase tracking-wider mt-0.5" style={{ color: colors[risk] }}>
                {risk}
              </p>
            </div>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: High-risk list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Claims by Risk Level
          </h2>

          {sortedByRisk.length === 0 ? (
            <EmptyState
              title="No verdicts issued"
              description="Submit evidence and run consensus reviews to generate greenwashing risk assessments."
            />
          ) : (
            <div className="space-y-3">
              {sortedByRisk.map(({ claim, verdict }) => (
                <Link key={claim.id} href={`/claims/${claim.id}`}>
                  <div className="rounded-lg border border-[#1e2d22] bg-card p-4 hover:border-primary/30 transition-colors group cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs text-text-muted">#{claim.id}</span>
                          <GreenwashingRiskBadge risk={verdict.greenwashing_risk} size="sm" />
                        </div>
                        <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                          {claim.title}
                        </h3>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {claim.company} · {claimCategoryLabel(claim.claim_category)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <ConfidenceScore score={verdict.confidence_score} size="sm" />
                        <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
                      <span>Verdict: <span className="text-text-secondary">{verdictLabel(verdict.verification_verdict)}</span></span>
                      <span>Evidence: <span className="text-text-secondary">{claim.evidence_count}</span></span>
                      <span className="ml-auto">{formatTimeAgo(verdict.issued_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right: Distribution + High risk spotlight */}
        <div className="space-y-4">
          <RiskDistribution distribution={riskDistribution} />

          {criticalAndHigh.length > 0 && (
            <div className="rounded-lg border border-[#ef4444]/30 bg-[#1a0808] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-[#ef4444]" />
                <h3 className="text-sm font-semibold text-[#ef4444]">Critical & High Risk</h3>
              </div>
              <div className="space-y-3">
                {criticalAndHigh.slice(0, 4).map(({ claim, verdict }) => (
                  <Link key={claim.id} href={`/claims/${claim.id}`}>
                    <div className="flex items-center gap-3 py-2 border-b border-[#ef4444]/10 last:border-0 group cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate group-hover:text-[#ef4444] transition-colors">
                          {claim.company}
                        </p>
                        <p className="text-[10px] text-text-muted truncate">{claim.title}</p>
                      </div>
                      <GreenwashingRiskBadge risk={verdict.greenwashing_risk} size="sm" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
