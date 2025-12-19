import { Section } from '@/components/sections'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductDetailsLoading() {
  return (
    <Section className="mt-19 flex max-h-[calc(100svh-8.25rem)] flex-col items-center gap-20 overflow-hidden lg:flex-row lg:items-start lg:justify-center">
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

        <ul>
          {[...Array(2)].map((_, i) => (
            <li key={i} className="flex justify-between border-b py-4">
              <Skeleton className="h-6 w-40" />
            </li>
          ))}
        </ul>
      </main>
    </Section>
  )
}
