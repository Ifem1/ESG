'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EvidenceForm } from '@/components/evidence/EvidenceForm'
import { EvidenceRegistry } from '@/components/evidence/EvidenceRegistry'
import { LoadingState } from '@/components/shared/LoadingState'
import { useEvidence } from '@/hooks/useEvidence'

interface Params {
  id: string
}

export default function EvidencePage({ params }: { params: Params }) {
  const { id } = params
  const caseId = parseInt(id, 10)
  const { evidence, loading, refetch } = useEvidence(isNaN(caseId) ? null : caseId)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/claims/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Claim #{id}
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Evidence Registry</h1>
        <p className="text-sm text-text-secondary mt-1">
          Submit publicly accessible URLs as evidence for Claim #{id}.
          The AI consensus engine will analyse these pages when running a verification review.
        </p>
      </div>

      <div className="space-y-6">
        <EvidenceForm caseId={caseId} />

        {loading ? (
          <LoadingState message="Loading evidence..." />
        ) : (
          <EvidenceRegistry evidence={evidence} loading={false} onRefresh={refetch} />
        )}
      </div>
    </div>
  )
}
