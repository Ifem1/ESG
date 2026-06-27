'use client'

import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'
import { ClaimDetail } from '@/components/claims/ClaimDetail'
import { useClaim } from '@/hooks/useClaim'

interface Params {
  id: string
}

export default function ClaimDetailPage({ params }: { params: Params }) {
  const { id } = params
  const caseId = parseInt(id, 10)
  const { claim, loading, error, refetch } = useClaim(isNaN(caseId) ? null : caseId)

  if (loading) return <LoadingState message="Loading claim dossier..." className="min-h-[50vh]" />
  if (error) return <ErrorState description={error} onRetry={refetch} />
  if (!claim) return <ErrorState title="Claim not found" description={`No claim found with ID #${id}`} />

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ClaimDetail claim={claim} />
    </div>
  )
}
