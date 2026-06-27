import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ClaimStatusBadge } from '@/components/claims/ClaimStatusBadge'
import { claimCategoryLabel, formatTimeAgo } from '@/lib/utils/format'
import type { Claim } from '@/types/claim'

interface RecentClaimsProps {
  claims: Claim[]
  limit?: number
}

export function RecentClaims({ claims, limit = 5 }: RecentClaimsProps) {
  const recent = [...claims]
    .sort((a, b) => b.created_at - a.created_at)
    .slice(0, limit)

  return (
    <div className="rounded-lg border border-[#1e2d22] bg-card">
      <div className="flex items-center justify-between p-5 pb-3">
        <h3 className="text-sm font-semibold text-text-primary">Recent Claims</h3>
        <Link
          href="/claims"
          className="text-xs text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-text-muted">No claims submitted yet</p>
        </div>
      ) : (
        <div className="divide-y divide-[#1e2d22]">
          {recent.map((claim) => (
            <Link
              key={claim.id}
              href={`/claims/${claim.id}`}
              className="flex items-center gap-4 px-5 py-3 hover:bg-surface transition-colors group"
            >
              <span className="font-mono text-xs text-text-muted w-8 flex-shrink-0">
                #{claim.id}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                  {claim.title}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {claim.company} · {claimCategoryLabel(claim.claim_category)}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <ClaimStatusBadge status={claim.status} />
                <span className="text-xs text-text-muted hidden sm:block">
                  {formatTimeAgo(claim.created_at)}
                </span>
                <ArrowRight className="h-3 w-3 text-text-muted group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
