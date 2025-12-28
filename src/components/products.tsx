'use client'

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useFetcher, useInfiniteFetcher } from '@/hooks/fetcher'
import type { Categories, Subcategories } from '@/lib/categories'
import type { Product } from '@/types/products'
import { AlertTriangle, BrushCleaning, ImageOff, RotateCcw, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useState } from 'react'
import { Blurhash } from 'react-blurhash'
import { InfiniteLoader } from './infinite-scroll-helpers'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

const ProductMapper = ({ children }: { children: React.ReactNode }) => {
  return <ul className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-[repeat(auto-fit,200px)] sm:gap-12 lg:gap-16">{children}</ul>
}

const ProductCard = memo(({ product, inCart }: { product: Product; inCart: boolean }) => {
  return (
    <li>
      <Link href={`/products/${product.id}`}>
        <div
          data-incart={inCart}
          style={{ '--image-color': product.image.color } as React.CSSProperties}
          className="group h-full gap-2 rounded-md transition-colors ease-out hover:bg-(--image-color)/35 data-[incart=true]:opacity-50"
        >
          <div className={`flex justify-end px-2 pt-2 ${inCart ? 'opacity-100' : 'opacity-0'}`}>
            <ShoppingCart className="text-muted-foreground size-4" />
          </div>

          <div className="px-6">
            <ProductImage props={product.image} />
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

const InfiniteProducts = ({ filters }: { filters?: { category?: Categories; subcategory?: Subcategories } }) => {
  const { data: cartProductIds } = useFetcher('/api/user/cart')
  const { data, error, remainingItems, isLoading, isValidating, fetchMore } = useInfiniteFetcher({ path: '/api/products', searchParams: filters })

  if (error)
    return (
      <Empty className="border-destructive border">
        <EmptyHeader className="text-destructive">
          <EmptyMedia variant="icon">
            <AlertTriangle className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>{error.message}</EmptyTitle>
          <EmptyDescription>Please reload the page</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => window.location.reload()}>
            Reload <RotateCcw />
          </Button>
        </EmptyContent>
      </Empty>
    )

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

const ProductImage = ({ props, className }: { props?: Product['image']; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (hasError || !props)
    return (
      <div className="grid aspect-square w-full place-items-center rounded-md border">
        <ImageOff className="text-muted-foreground size-16" />
      </div>
    )

  return (
    <div className="relative aspect-square overflow-hidden">
      <MemoizedBlurhash
        hash={props.blurHash}
        resolutionX={32}
        resolutionY={32}
        width="100%"
        height="100%"
        punch={1}
        className={`absolute! inset-0! transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-50'}`}
      />

      <Image
        src={props.src}
        alt={props.alt}
        width={300}
        height={300}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loader={({ src }) => `/product-images/${src}/300.png`}
        className={className}
      />
    </div>
  )
}

const MemoizedBlurhash = memo(Blurhash)

const NoProduct = () => {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BrushCleaning />
        </EmptyMedia>
        <EmptyTitle>No Products</EmptyTitle>
        <EmptyDescription>Seller did not yet publish any products in this category</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export { InfiniteProducts, NoProduct, ProductCard, ProductCardSkeleton, ProductImage, ProductMapper }
