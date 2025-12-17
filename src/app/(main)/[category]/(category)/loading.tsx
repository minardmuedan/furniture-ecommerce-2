import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function CategoryLoading() {
  return [...Array(3)].map((_, i) => (
    <div key={i} className={`${i == 0 ? 'col-span-6' : 'col-span-3'} sm:col-span-1`}>
      <div
        className={cn(
          'flex h-full items-center rounded-md border px-12 py-3 sm:px-6',
          i === 0 ? 'flex-row gap-12 py-1 *:flex-1 sm:flex-col sm:gap-2 sm:py-3 sm:*:flex-none' : 'flex-col gap-2',
        )}
      >
        <Skeleton className="aspect-square w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  ))
}
