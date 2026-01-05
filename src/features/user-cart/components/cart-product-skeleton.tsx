import { Skeleton } from '@/components/ui/skeleton'

export default function CartProductSkeleton() {
  return (
    <li className="flex gap-10 rounded-xl border px-5 py-3">
      <Skeleton className="size-20" />
      <div className="flex flex-1 flex-col justify-between">
        <Skeleton className="h-5 w-full max-w-72" />
        <Skeleton className="h-[34px] w-[74px]" />
      </div>
    </li>
  )
}
