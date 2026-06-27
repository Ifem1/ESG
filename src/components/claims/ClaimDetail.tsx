'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Globe,
  Tag,
  Factory,
  FileText,
  Target,
  Zap,
  PlusCircle,
  RefreshCw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ClaimStatusBadge } from './ClaimStatusBadge'
import { VerdictPanel } from '@/components/verdict/VerdictPanel'
import { EvidenceRegistry } from '@/components/evidence/EvidenceRegistry'
import { ConsensusHistory } from '@/components/verdict/ConsensusHistory'
import { TransactionStatus } from '@/components/shared/TransactionStatus'
import {
  claimCategoryLabel,
  industryLabel,
  formatDate,
  formatTimeAgo,
} from '@/lib/utils/format'
import { useLatestVerdict, useVerdictHistory } from '@/hooks/useConsensus'
import { useEvidence } from '@/hooks/useEvidence'
import { useRequestConsensus } from '@/hooks/useContract'
import { useAccount } from 'wagmi'
import type { Claim } from '@/types/claim'

interface ClaimDetailProps {
  claim: Claim
}

export function ClaimDetail({ claim }: ClaimDetailProps) {
  const { address } = useAccount()
  const { verdict, loading: verdictLoading, refetch: refetchVerdict } = useLatestVerdict(claim.id)
  const { history } = useVerdictHistory(claim.id)
  const { evidence, loading: evidenceLoading, refetch: refetchEvidence } = useEvidence(claim.id)
  const { requestConsensus, isPending, txState, reset: resetTx } = useRequestConsensus()

  const isOwner = address?.toLowerCase() === claim.owner?.toLowerCase()

  // Auto-dismiss stale error/success banners once a verdict is loaded
  useEffect(() => {
    if (verdict && (txState.status === 'FAILED_EXECUTION' || txState.status === 'SUCCESS')) {
      const t = setTimeout(resetTx, 3000)
      return () => clearTimeout(t)
    }
  }, [verdict, txState.status, resetTx])

  const isConsensusBusy =
    isPending ||
    (txState.status !== 'idle' &&
      txState.status !== 'SUCCESS' &&
      txState.status !== 'FAILED_EXECUTION' &&
      txState.status !== 'UNDETERMINED' &&
      txState.status !== 'VALIDATORS_TIMEOUT' &&
      txState.status !== 'LEADER_TIMEOUT' &&
      txState.status !== 'CANCELED')

  const handleRequestConsensus = async () => {
    try {
      await requestConsensus(String(claim.id))
    } catch {
      // error surface in txState
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs text-text-muted">CASE #{claim.id}</span>
            <ClaimStatusBadge status={claim.status} />
            <Badge variant="outline" className="text-xs">
              {claimCategoryLabel(claim.claim_category)}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">{claim.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-text-muted" />
              {claim.company}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-text-muted" />
              {claim.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Factory className="h-4 w-4 text-text-muted" />
              {industryLabel(claim.industry)}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-text-muted" />
              {formatDate(claim.created_at)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href={`/claims/${claim.id}/evidence`}>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Evidence
            </Button>
          </Link>
          {isOwner && (
            <Button
              size="sm"
              onClick={handleRequestConsensus}
              disabled={isConsensusBusy}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isConsensusBusy ? 'animate-spin' : ''}`} />
              {isConsensusBusy ? txState.status : 'Request Review'}
            </Button>
          )}
        </div>
      </div>

      {/* Consensus Transaction Status */}
      {txState.status !== 'idle' && (
        <TransactionStatus
          state={txState}
          onReset={txState.status === 'SUCCESS' ? undefined : resetTx}
        />
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Claim Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-lg border border-[#1e2d22] bg-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Claim Details</h2>
            <Separator />

            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <FileText className="h-3 w-3" /> ESG Claim
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">{claim.esg_claim}</p>
            </div>

            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Target className="h-3 w-3" /> Claimed Impact
              </p>
              <p className="text-sm text-text-secondary">{claim.claimed_impact}</p>
            </div>

            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Zap className="h-3 w-3" /> Claimed Action
              </p>
              <p className="text-sm text-text-secondary">{claim.claimed_action}</p>
            </div>

            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Tag className="h-3 w-3" /> Assessment Objective
              </p>
              <p className="text-sm text-text-secondary">{claim.assessment_objective}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-text-muted uppercase tracking-wider mb-0.5">Source</p>
                <p className="text-text-secondary truncate">{claim.claim_source}</p>
              </div>
              <div>
                <p className="text-text-muted uppercase tracking-wider mb-0.5">Period</p>
                <p className="text-text-secondary">{claim.reporting_period}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Evidence Summary</p>
              <p className="text-xs text-text-secondary leading-relaxed">{claim.evidence_summary}</p>
            </div>

            <Separator />
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Submitted By</p>
              <p className="font-mono text-xs text-text-secondary">{claim.owner}</p>
            </div>
          </div>
        </div>

        {/* Center: Verdict */}
        <div className="lg:col-span-2 space-y-6">
          <VerdictPanel
            verdict={verdict}
            loading={verdictLoading}
            onRefresh={refetchVerdict}
          />

          <EvidenceRegistry
            evidence={evidence}
            loading={evidenceLoading}
            onRefresh={refetchEvidence}
          />

          <ConsensusHistory history={history} />
        </div>
      </div>
    </div>
  )
}
