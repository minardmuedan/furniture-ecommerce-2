'use client'

import { InfiniteLoader } from '@/components/infinite-scroll-helpers'
import { useState } from 'react'
import { useUserCartProducts } from '../hooks'
import CartProductList from './cart-product-list'
import CartProductSkeleton from './cart-product-skeleton'
import CartProductsHeader from './cart-products-header'

export default function InfiniteCartProducts() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { data, remainingItems, isValidating, isLoading, fetchMore } = useUserCartProducts()

  const toggleSelect = (cartId: string) => {
    if (selectedIds.includes(cartId)) setSelectedIds((prev) => prev.filter((id) => id !== cartId))
    else setSelectedIds((prev) => [...prev, cartId])
  }

  return (
    <>
      <CartProductsHeader selectedIds={selectedIds} setSelectedIds={setSelectedIds} />

      <ul className={`flex flex-col gap-2 ${isValidating ? 'pointer-events-none animate-pulse' : ''} `}>
        {data.map((cart) => (
          <CartProductList key={cart.id} cart={cart} selectedIds={selectedIds} onSelect={() => toggleSelect(cart.id)} />
        ))}

        {isValidating && [...Array(Math.min(isLoading ? 3 : remainingItems, 20))].map((_, i) => <CartProductSkeleton key={i} />)}
      </ul>

      <InfiniteLoader isLoading={isLoading} remainingItems={remainingItems} fetchMore={fetchMore} />
    </>
  )
}
