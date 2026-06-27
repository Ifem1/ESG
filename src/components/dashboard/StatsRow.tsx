import { FileText, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Stat {
  label: string
  value: string | number
  subtext?: string
  icon: React.ElementType
  trend?: 'up' | 'down' | 'neutral'
  color?: string
}

interface StatsRowProps {
  stats: Stat[]
  className?: string
}

export function StatsRow({ stats, className }: StatsRowProps) {
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <div
            key={i}
            className="rounded-lg border border-[#1e2d22] bg-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-text-muted uppercase tracking-wider">{stat.label}</p>
              <div className="h-7 w-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
            <p
              className="text-2xl font-bold font-mono"
              style={{ color: stat.color || '#e8f0ea' }}
            >
              {stat.value}
            </p>
            {stat.subtext && (
              <p className="text-xs text-text-muted mt-0.5">{stat.subtext}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function DashboardStats({
  totalCases,
  pendingReview,
  verdictsIssued,
  avgConfidence,
}: {
  totalCases: number
  pendingReview: number
  verdictsIssued: number
  avgConfidence: number
}) {
  return (
    <StatsRow
      stats={[
        {
          label: 'Total Cases',
          value: totalCases,
          icon: FileText,
          subtext: 'All submitted claims',
        },
        {
          label: 'Pending Review',
          value: pendingReview,
          icon: Clock,
          subtext: 'Awaiting consensus',
          color: pendingReview > 0 ? '#eab308' : undefined,
        },
        {
          label: 'Verdicts Issued',
          value: verdictsIssued,
          icon: CheckCircle,
          subtext: 'AI consensus complete',
          color: '#22c55e',
        },
        {
          label: 'Avg Confidence',
          value: `${Math.round(avgConfidence)}%`,
          icon: TrendingUp,
          subtext: 'Across all verdicts',
          color:
            avgConfidence >= 70 ? '#22c55e' :
            avgConfidence >= 40 ? '#eab308' : '#ef4444',
        },
      ]}
    />
  )
}
