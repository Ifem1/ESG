import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Failed to load data',
  description = 'Unable to fetch data from the GenLayer network.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1a0808] border border-[#ef4444]/30 mb-4">
        <AlertCircle className="h-7 w-7 text-[#ef4444]" />
      </div>
      <h3 className="text-base font-semibold text-[#ef4444] mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
          Retry
        </Button>
      )}
    </div>
  )
}
