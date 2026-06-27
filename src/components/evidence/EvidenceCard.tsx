import { ExternalLink, Shield, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { evidenceTypeLabel } from '@/lib/utils/format'
import { truncateHash } from '@/lib/utils/explorer'
import type { Evidence } from '@/types/evidence'
import { cn } from '@/lib/utils/cn'

const CATEGORY_COLORS: Record<string, string> = {
  supporting: 'text-[#22c55e] border-[#22c55e]/30 bg-[#22c55e]/10',
  contradicting: 'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10',
  contextual: 'text-[#6b7280] border-[#6b7280]/30 bg-[#6b7280]/10',
  methodology: 'text-[#eab308] border-[#eab308]/30 bg-[#eab308]/10',
  baseline: 'text-[#f97316] border-[#f97316]/30 bg-[#f97316]/10',
}

interface EvidenceCardProps {
  evidence: Evidence
}

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  return (
    <div className="rounded-md border border-[#1e2d22] bg-surface p-4 hover:border-[#2d4432] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                CATEGORY_COLORS[evidence.category] || CATEGORY_COLORS.contextual
              )}
            >
              {evidence.category}
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {evidenceTypeLabel(evidence.ev_type)}
            </Badge>
          </div>
          <h4 className="text-sm font-medium text-text-primary">{evidence.title}</h4>
        </div>
        <a
          href={evidence.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-text-muted hover:text-primary transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="space-y-1.5 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <Shield className="h-3 w-3 text-text-muted" />
          <span className="font-medium">{evidence.source_name}</span>
          {evidence.credibility_note && (
            <span className="text-text-muted">— {evidence.credibility_note}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Tag className="h-3 w-3 text-text-muted" />
          <span>{evidence.relevance}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-text-muted">Hash:</span>
          <span className="font-mono text-[10px] text-text-muted">{truncateHash(evidence.url_hash, 12)}</span>
        </div>
      </div>
    </div>
  )
}
