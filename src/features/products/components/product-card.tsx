import type { Product } from '@/types/products'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { memo } from 'react'
import ProductImage from './product-image'
import { Skeleton } from '@/components/ui/skeleton'
import { getProductHoverColor } from '../lib/get-hover-color'
import { getContrastColor } from '@/lib/utils'

const ProductCard = memo(({ product, inCart }: { product: Product; inCart: boolean }) => {
  return (
    <li>
      <Link href={`/products/${product.id}`}>
        <div
          data-incart={inCart}
          style={{ '--hover-color': getProductHoverColor(product.image.color) } as React.CSSProperties}
          className="group h-full gap-2 rounded-md transition-colors ease-out hover:bg-(--hover-color) data-[incart=true]:opacity-50"
        >
          <div className={`flex justify-end px-2 pt-2 ${inCart ? 'opacity-100' : 'opacity-0'}`}>
            <ShoppingCart className="text-muted-foreground size-4" />
          </div>

          <div className="px-6">
            <ProductImage {...product.image} />
          </div>

          <div className="px-6 pb-6">
            <p className="text-muted-foreground group-hover:text-foreground text-center text-sm text-pretty wrap-break-word transition-colors">
              {product.title}
            </p>
          </div>
        </div>
      </Link>
    </li>
  )
})

const ProductCardSkeleton = () => {
  return (
    <li className="flex h-full flex-col justify-center gap-2 rounded-md border p-6">
      <Skeleton className="aspect-square w-full" />

      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
      </div>
    </li>
  )
}

export { ProductCard, ProductCardSkeleton }
