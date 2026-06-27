import { FileSearch } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = 'No data found',
  description = 'Nothing to display here yet.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface border border-[#1e2d22] mb-4">
        {icon || <FileSearch className="h-7 w-7 text-text-muted" />}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
