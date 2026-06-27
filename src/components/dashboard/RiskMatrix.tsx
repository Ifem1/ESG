import { cn } from '@/lib/utils/cn'
import type { Claim } from '@/types/claim'

const RISK_LEVELS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'MINIMAL'] as const
const VERDICT_LEVELS = ['CONTRADICTED', 'INSUFFICIENT_EVIDENCE', 'PARTIALLY_SUPPORTED', 'SUPPORTED'] as const

const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#22c55e',
  MINIMAL: '#22c55e',
}

const RISK_LABELS: Record<string, string> = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  MINIMAL: 'Minimal',
}

const VERDICT_LABELS: Record<string, string> = {
  CONTRADICTED: 'Contradicted',
  INSUFFICIENT_EVIDENCE: 'Insufficient',
  PARTIALLY_SUPPORTED: 'Partial',
  SUPPORTED: 'Supported',
}

interface RiskMatrixData {
  riskLevel: string
  verdictLevel: string
  count: number
}

interface RiskMatrixProps {
  data: RiskMatrixData[]
  className?: string
}

export function RiskMatrix({ data, className }: RiskMatrixProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  const getCount = (risk: string, verdict: string) =>
    data.find((d) => d.riskLevel === risk && d.verdictLevel === verdict)?.count || 0

  return (
    <div className={cn('rounded-lg border border-[#1e2d22] bg-card p-5', className)}>
      <h3 className="text-sm font-semibold text-text-primary mb-4">Greenwashing Risk Matrix</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left py-2 pr-4 text-text-muted font-normal w-20">Risk \ Verdict</th>
              {VERDICT_LEVELS.map((v) => (
                <th key={v} className="text-center py-2 px-2 text-text-muted font-normal">
                  {VERDICT_LABELS[v]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RISK_LEVELS.map((risk) => (
              <tr key={risk} className="border-t border-[#1e2d22]">
                <td className="py-2 pr-4 font-medium" style={{ color: RISK_COLORS[risk] }}>
                  {RISK_LABELS[risk]}
                </td>
                {VERDICT_LEVELS.map((verdict) => {
                  const count = getCount(risk, verdict)
                  const intensity = count / maxCount
                  return (
                    <td key={verdict} className="py-2 px-2 text-center">
                      <div
                        className="mx-auto flex h-8 w-12 items-center justify-center rounded text-xs font-mono font-bold transition-all"
                        style={{
                          backgroundColor: count > 0
                            ? `${RISK_COLORS[risk]}${Math.round(intensity * 40).toString(16).padStart(2, '0')}`
                            : 'transparent',
                          border: count > 0
                            ? `1px solid ${RISK_COLORS[risk]}30`
                            : '1px solid #1e2d22',
                          color: count > 0 ? RISK_COLORS[risk] : '#4a6650',
                        }}
                      >
                        {count}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Distribution bar chart using CSS only
export function RiskDistribution({
  distribution,
}: {
  distribution: Record<string, number>
}) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1

  return (
    <div className="rounded-lg border border-[#1e2d22] bg-card p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Risk Distribution</h3>
      <div className="space-y-3">
        {RISK_LEVELS.map((risk) => {
          const count = distribution[risk] || 0
          const pct = Math.round((count / total) * 100)
          return (
            <div key={risk} className="flex items-center gap-3">
              <span className="text-xs font-medium w-16 flex-shrink-0" style={{ color: RISK_COLORS[risk] }}>
                {RISK_LABELS[risk]}
              </span>
              <div className="flex-1 h-2 bg-surface rounded-full border border-[#1e2d22] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: RISK_COLORS[risk],
                  }}
                />
              </div>
              <span className="text-xs font-mono text-text-muted w-12 text-right">
                {count} ({pct}%)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
