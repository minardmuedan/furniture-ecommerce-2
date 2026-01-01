'use client'

import { ProductCard } from '@/features/products/components/product-card'
import ProductMapper from '@/features/products/components/product-mapper'
import { useUserCartProductIds } from '@/features/user-cart/hooks'
import type { Product } from '@/types/products'

export function ExploreProducts({ products }: { products: Product[] }) {
  const { cartProductIds } = useUserCartProductIds()

  return (
    <ProductMapper>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} inCart={!!cartProductIds?.includes(product.id)} />
      ))}
    </ProductMapper>
  )
}
