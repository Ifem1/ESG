'use client'

import { RefreshCw, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EvidenceCard } from './EvidenceCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingState } from '@/components/shared/LoadingState'
import type { Evidence } from '@/types/evidence'

interface EvidenceRegistryProps {
  evidence: Evidence[]
  loading: boolean
  onRefresh?: () => void
}

export function EvidenceRegistry({ evidence, loading, onRefresh }: EvidenceRegistryProps) {
  return (
    <div className="rounded-lg border border-[#1e2d22] bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-text-muted" />
          <h3 className="text-sm font-semibold text-text-primary">Evidence Registry</h3>
          <span className="font-mono text-xs text-text-muted border border-[#1e2d22] rounded px-1.5 py-0.5">
            {evidence.length}
          </span>
        </div>
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingState message="Loading evidence..." className="py-8" />
      ) : evidence.length === 0 ? (
        <EmptyState
          title="No evidence submitted"
          description="Submit evidence URLs to support the verification process."
          className="py-8"
        />
      ) : (
        <div className="space-y-3">
          {evidence.map((ev) => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      )}
    </div>
  )
}
