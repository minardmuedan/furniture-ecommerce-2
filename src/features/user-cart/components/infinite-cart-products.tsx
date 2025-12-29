'use client'

import { InfiniteLoader } from '@/components/infinite-scroll-helpers'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserCartProducts } from '../hooks'
import CartQuantity from './cart-quantity'
import ProductImage from '@/features/products/components/product-image'

export default function InfiniteCartProducts() {
  const { data, remainingItems, isValidating, isLoading, fetchMore } = useUserCartProducts()

  return (
    <>
      <ul className={`flex flex-col gap-2 ${isValidating ? 'pointer-events-none' : ''}`}>
        {data.map((cart) => (
          <li key={cart.id} className="flex gap-10 rounded-xl border px-5 py-3">
            <ProductImage props={cart.product.image} className="w-24" />

            <div className="flex flex-1 flex-col justify-between">
              <span>{cart.product.title}</span>

              <CartQuantity cartId={cart.id} defaultQuantity={cart.quantity} max={cart.product.stocks.availableQuantity} />
            </div>
          </li>
        ))}

        {isValidating && [...Array(Math.min(isLoading ? 3 : remainingItems, 20))].map((_, i) => <CartProductSkeleton key={i} />)}
      </ul>

      <InfiniteLoader isLoading={isLoading} remainingItems={remainingItems} fetchMore={fetchMore} />
    </>
  )
}

function CartProductSkeleton() {
  return (
    <li className="flex gap-10 rounded-xl border px-5 py-3">
      <Skeleton className="size-24" />
      <div className="flex flex-1 flex-col justify-between">
        <Skeleton className="h-6 w-full max-w-72" />
        <Skeleton className="h-[34px] w-[74px]" />
      </div>
    </li>
  )
}
