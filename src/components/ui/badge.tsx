import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-[#0a0f0d]',
        secondary:
          'border-[#1e2d22] bg-surface text-text-secondary',
        outline: 'border-[#1e2d22] text-text-primary bg-transparent',
        supported:
          'border-transparent bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30',
        partial:
          'border-transparent bg-[#eab308]/20 text-[#eab308] border-[#eab308]/30',
        contradicted:
          'border-transparent bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30',
        insufficient:
          'border-transparent bg-[#6b7280]/20 text-[#6b7280] border-[#6b7280]/30',
        critical:
          'border-transparent bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30',
        high:
          'border-transparent bg-[#f97316]/20 text-[#f97316] border-[#f97316]/30',
        medium:
          'border-transparent bg-[#eab308]/20 text-[#eab308] border-[#eab308]/30',
        low:
          'border-transparent bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
