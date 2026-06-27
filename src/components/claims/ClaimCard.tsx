'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Building2, Calendar, MapPin, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClaimStatusBadge } from './ClaimStatusBadge'
import { claimCategoryLabel, formatTimeAgo } from '@/lib/utils/format'
import type { Claim } from '@/types/claim'

interface ClaimCardProps {
  claim: Claim
  index?: number
}

export function ClaimCard({ claim, index = 0 }: ClaimCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/claims/${claim.id}`}>
        <Card className="hover:border-primary/40 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-xs text-text-muted">#{claim.id}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {claimCategoryLabel(claim.claim_category)}
                  </Badge>
                  <ClaimStatusBadge status={claim.status} />
                </div>
                <h3 className="font-semibold text-text-primary text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {claim.title}
                </h3>
              </div>
              <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-primary transition-all group-hover:translate-x-0.5 flex-shrink-0 mt-1" />
            </div>

            <p className="text-xs text-text-secondary line-clamp-2 mb-3">{claim.esg_claim}</p>

            <div className="flex items-center gap-4 text-xs text-text-muted">
              <div className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{claim.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[80px]">{claim.location}</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <Calendar className="h-3 w-3" />
                <span>{formatTimeAgo(claim.created_at)}</span>
              </div>
            </div>

            {claim.has_verdict && (
              <div className="mt-3 pt-3 border-t border-[#1e2d22]">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <span className="text-xs text-primary font-medium">Verdict issued</span>
                  <span className="text-xs text-text-muted ml-auto">{claim.evidence_count} evidence</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
