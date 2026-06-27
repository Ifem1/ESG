import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { riskLabel } from '@/lib/utils/format'
import type { GreenwashingRisk } from '@/types/verdict'

const RISK_CONFIG: Record<
  GreenwashingRisk,
  { color: string; bg: string; border: string; icon: React.ElementType }
> = {
  CRITICAL: { color: '#ef4444', bg: '#1a0808', border: '#ef4444', icon: XCircle },
  HIGH: { color: '#f97316', bg: '#1a0c00', border: '#f97316', icon: AlertTriangle },
  MEDIUM: { color: '#eab308', bg: '#1a1500', border: '#eab308', icon: AlertCircle },
  LOW: { color: '#22c55e', bg: '#0a1a0d', border: '#22c55e', icon: CheckCircle },
  MINIMAL: { color: '#22c55e', bg: '#0a1a0d', border: '#22c55e', icon: CheckCircle },
}

interface GreenwashingRiskBadgeProps {
  risk: GreenwashingRisk
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function GreenwashingRiskBadge({ risk, size = 'md', className }: GreenwashingRiskBadgeProps) {
  const config = RISK_CONFIG[risk]
  const Icon = config.icon

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  }

  const iconSizes = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border font-semibold font-mono',
        sizeClasses[size],
        className
      )}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: `${config.border}40`,
      }}
    >
      <Icon className={iconSizes[size]} />
      {riskLabel(risk)}
    </div>
  )
}
