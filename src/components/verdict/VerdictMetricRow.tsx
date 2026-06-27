import { cn } from '@/lib/utils/cn'

interface VerdictMetricRowProps {
  label: string
  value: string | number | boolean
  valueClass?: string
  mono?: boolean
  subtext?: string
}

export function VerdictMetricRow({
  label,
  value,
  valueClass,
  mono = false,
  subtext,
}: VerdictMetricRowProps) {
  const display =
    typeof value === 'boolean'
      ? value ? 'Yes' : 'No'
      : String(value)

  return (
    <div className="flex items-start justify-between py-2 border-b border-[#1e2d22] last:border-0 gap-4">
      <div className="flex flex-col">
        <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>
        {subtext && <span className="text-[10px] text-text-muted">{subtext}</span>}
      </div>
      <span
        className={cn(
          'text-sm text-right flex-shrink-0',
          mono ? 'font-mono' : 'font-medium',
          valueClass || 'text-text-primary'
        )}
      >
        {display}
      </span>
    </div>
  )
}
