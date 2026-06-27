import { cn } from '@/lib/utils/cn'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface border border-[#1e2d22]', className)}
      {...props}
    />
  )
}

export { Skeleton }
