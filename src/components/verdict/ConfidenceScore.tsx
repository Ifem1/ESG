import { cn } from '@/lib/utils/cn'

interface ConfidenceScoreProps {
  score: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ConfidenceScore({ score, size = 'md', className }: ConfidenceScoreProps) {
  const pct = Math.round(Math.max(0, Math.min(100, score)))

  const color =
    pct >= 75 ? '#22c55e' :
    pct >= 50 ? '#eab308' :
    pct >= 25 ? '#f97316' : '#ef4444'

  const sizeMap = {
    sm: { outer: 64, radius: 24, stroke: 3, text: 'text-sm', label: 'text-[8px]' },
    md: { outer: 96, radius: 36, stroke: 4, text: 'text-xl', label: 'text-[10px]' },
    lg: { outer: 128, radius: 48, stroke: 5, text: 'text-2xl', label: 'text-xs' },
  }

  const s = sizeMap[size]
  const circ = 2 * Math.PI * s.radius
  const off = circ - (pct / 100) * circ

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg width={s.outer} height={s.outer} viewBox={`0 0 ${s.outer} ${s.outer}`}>
        {/* Background ring */}
        <circle
          cx={s.outer / 2}
          cy={s.outer / 2}
          r={s.radius}
          fill="none"
          stroke="#1e2d22"
          strokeWidth={s.stroke}
        />
        {/* Progress ring */}
        <circle
          cx={s.outer / 2}
          cy={s.outer / 2}
          r={s.radius}
          fill="none"
          stroke={color}
          strokeWidth={s.stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={off}
          transform={`rotate(-90 ${s.outer / 2} ${s.outer / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        {/* Center text */}
        <text
          x={s.outer / 2}
          y={s.outer / 2 - 4}
          textAnchor="middle"
          fill={color}
          className={cn('font-mono font-bold', s.text)}
          fontSize={size === 'sm' ? 14 : size === 'md' ? 20 : 26}
          fontFamily="monospace"
        >
          {pct}%
        </text>
        <text
          x={s.outer / 2}
          y={s.outer / 2 + 12}
          textAnchor="middle"
          fill="#4a6650"
          fontSize={size === 'sm' ? 8 : 10}
          fontFamily="sans-serif"
        >
          CONFIDENCE
        </text>
      </svg>
    </div>
  )
}
