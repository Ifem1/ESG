import { Badge } from '@/components/ui/badge'
import type { ClaimStatus } from '@/types/claim'

const STATUS_CONFIG: Record<
  ClaimStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'supported' | 'partial' | 'contradicted' | 'insufficient' | 'critical' | 'high' | 'medium' | 'low' }
> = {
  pending: { label: 'Pending', variant: 'insufficient' },
  under_review: { label: 'Under Review', variant: 'medium' },
  verdict_issued: { label: 'Verdict Issued', variant: 'supported' },
  disputed: { label: 'Disputed', variant: 'critical' },
  archived: { label: 'Archived', variant: 'secondary' },
}

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'secondary' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
