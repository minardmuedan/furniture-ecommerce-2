import { Skeleton } from '@/components/ui/skeleton'

export default function ProductDetailsLoading() {
  return (
    <section className="mt-10 mb-10 flex flex-col items-center justify-center gap-20 lg:flex-row">
      <div className="flex w-full max-w-[300px] flex-col">
        <Skeleton className="aspect-square w-full" />
        <div className="mt-4 flex w-full gap-4 overflow-hidden px-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-square flex-1 rounded p-1" />
          ))}
        </div>
      </div>

      <main className="w-full max-w-[700px] space-y-14">
        <header>
          <Skeleton className="mb-1 h-[17px] w-40" />
          <Skeleton className="h-9 w-full max-w-[500px] md:h-10" />
        </header>

        <div>
          <Skeleton className="mb-1 h-5 w-[106.94]" />
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="size-10 rounded-md" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="flex flex-col gap-1 *:h-5">
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-3/4" />
          <Skeleton className="w-1/2" />
        </div>

        <ul className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <li key={i} className="flex h-10 justify-between border-b">
              <Skeleton className="h-5 w-40" />
            </li>
          ))}
        </ul>
      </main>
    </section>
  )
}
