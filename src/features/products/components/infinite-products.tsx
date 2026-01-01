'use client'

import { InfiniteLoader } from '@/components/infinite-scroll-helpers'
import { SectionError } from '@/components/sections'
import { useUserCartProductIds } from '@/features/user-cart/hooks'
import { useInfiniteFetcher } from '@/hooks/fetcher'
import type { Categories, Subcategories } from '@/lib/categories'
import NoProduct from './no-product'
import { ProductCard, ProductCardSkeleton } from './product-card'
import ProductMapper from './product-mapper'

export default function InfiniteProducts({ filters }: { filters?: { category?: Categories; subcategory?: Subcategories } }) {
  const { cartProductIds } = useUserCartProductIds()
  const { data, error, remainingItems, isLoading, isValidating, fetchMore } = useInfiniteFetcher({ path: '/api/products', searchParams: filters })

  if (error) return <SectionError message={error.message} />
  if (!isLoading && data.length <= 0) return <NoProduct />

  return (
    <>
      <ProductMapper>
        {data.map((product) => (
          <ProductCard key={product.id} product={product} inCart={!!cartProductIds?.includes(product.id)} />
        ))}

        {isValidating && [...Array(Math.min(isLoading ? 20 : remainingItems, 20))].map((_, i) => <ProductCardSkeleton key={i} />)}
      </ProductMapper>

      <InfiniteLoader isLoading={isLoading} remainingItems={remainingItems} fetchMore={fetchMore} />
    </>
  )
}
