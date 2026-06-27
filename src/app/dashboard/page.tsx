'use client'

import Link from 'next/link'
import { PlusCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardStats } from '@/components/dashboard/StatsRow'
import { RiskDistribution } from '@/components/dashboard/RiskMatrix'
import { RecentClaims } from '@/components/dashboard/RecentClaims'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'
import { useAllClaims } from '@/hooks/useClaim'
import type { Verdict } from '@/types/verdict'
import { useState, useEffect } from 'react'
import { getLatestVerdict } from '@/lib/genlayer/contract'

export default function DashboardPage() {
  const { claims, loading, error, refetch } = useAllClaims()
  const [verdicts, setVerdicts] = useState<(Verdict | null)[]>([])
  const [verdictsLoading, setVerdictsLoading] = useState(true)

  useEffect(() => {
    if (claims.length === 0) { setVerdictsLoading(false); return }
    setVerdictsLoading(true)
    Promise.all(claims.map((c) => getLatestVerdict(c.id)))
      .then(setVerdicts)
      .finally(() => setVerdictsLoading(false))
  }, [claims])

  const resolvedVerdicts = verdicts.filter(Boolean) as Verdict[]

  const pendingReview = claims.filter(
    (c) => c.status === 'pending' || c.status === 'under_review'
  ).length

  const verdictsIssued = resolvedVerdicts.length

  const avgConfidence =
    resolvedVerdicts.length > 0
      ? resolvedVerdicts.reduce((sum, v) => sum + v.confidence_score, 0) /
        resolvedVerdicts.length
      : 0

  const riskDistribution = resolvedVerdicts.reduce<Record<string, number>>(
    (acc, v) => {
      acc[v.greenwashing_risk] = (acc[v.greenwashing_risk] || 0) + 1
      return acc
    },
    {}
  )

  if (loading) return <LoadingState message="Loading dashboard..." className="min-h-[50vh]" />
  if (error) return <ErrorState description={error} onRetry={refetch} />

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            ESG Oracle Protocol — sustainability verification overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Link href="/claims/new">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Claim
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats
        totalCases={claims.length}
        pendingReview={pendingReview}
        verdictsIssued={verdictsIssued}
        avgConfidence={avgConfidence}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentClaims claims={claims} limit={8} />
        </div>
        <div className="space-y-4">
          <RiskDistribution distribution={riskDistribution} />

          <div className="rounded-lg border border-[#1e2d22] bg-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/claims/new" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Submit ESG Claim
                </Button>
              </Link>
              <Link href="/claims" className="block">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Browse Claims Ledger
                </Button>
              </Link>
              <Link href="/greenwashing" className="block">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Greenwashing Risk Terminal
                </Button>
              </Link>
              <Link href="/consensus" className="block">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Consensus History
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[#1e2d22] bg-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Network Status</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Network</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-text-secondary">StudioNet</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Contract</span>
                <span className="font-mono text-text-secondary truncate max-w-[120px]">
                  {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.slice(0, 10) || 'Not deployed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Total Claims</span>
                <span className="font-mono text-text-primary font-bold">{claims.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
