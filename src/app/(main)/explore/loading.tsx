import { Skeleton } from '@/components/ui/skeleton'

export default function ExploreLoading() {
  return (
    <div className="min-h-svhminusnav flex flex-col">
      <header className="my-30 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <Skeleton className="size-8" />
          <Skeleton className="h-12 w-[185.23]" />
        </div>
        <Skeleton className="h-5 w-[163.48]" />
      </header>

      <Skeleton className="from-accent to-background max-h-[400px] w-full flex-1 bg-linear-to-b" />
    </div>
  )
}
