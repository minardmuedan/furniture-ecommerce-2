import { Skeleton } from '@/components/ui/skeleton'

export default function CartProductSkeleton() {
  return (
    <li className="flex h-26 items-center gap-5 rounded-xl border py-2 pr-5 pl-12">
      <Skeleton className="size-20" />
      <div className="flex h-full flex-1 flex-col justify-between">
        <Skeleton className="h-5 w-full max-w-64" />
        <Skeleton className="h-[34px] w-[82px]" />
      </div>
    </li>
  )
}
