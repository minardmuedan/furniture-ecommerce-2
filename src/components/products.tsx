'use client'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useInfiniteFetcher } from '@/hooks/fetcher'
import type { Categories, Subcategories } from '@/lib/categories'
import type { Product } from '@/types/products'
import { BrushCleaning, ImageOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useState } from 'react'
import { Blurhash } from 'react-blurhash'
import { InView } from 'react-intersection-observer'
import { Skeleton } from './ui/skeleton'
import { Spinner } from './ui/spinner'

const ProductMapper = ({ children }: { children: React.ReactNode }) => {
  return <ul className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-[repeat(auto-fit,200px)] sm:gap-12 lg:gap-16">{children}</ul>
}

const ProductCard = memo(({ product }: { product: Product }) => {
  return (
    <li>
      <Link href={`/products/${product.id}`}>
        <div
          style={{ '--image-color': product.image.color } as React.CSSProperties}
          className="group flex h-full flex-col justify-center gap-2 rounded-md p-6 transition-colors ease-out hover:bg-(--image-color)/35"
        >
          <ProductImage props={product.image} />
          <p className="text-muted-foreground group-hover:text-foreground text-center text-sm text-pretty wrap-break-word transition-colors">
            {product.title}
          </p>
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
  const { data, remainingItems, isLoading, isValidating, fetchMore } = useInfiniteFetcher({ path: '/api/products', searchParams: filters })

  if (!isLoading && data.length <= 0) return <NoProduct />
  return (
    <>
      <ProductMapper>
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {isValidating && [...Array(Math.min(isLoading ? 20 : remainingItems, 20))].map((_, i) => <ProductCardSkeleton key={i} />)}
      </ProductMapper>

      <div className="text-muted-foreground flex justify-center pt-10 pb-6 text-sm">
        {isLoading || remainingItems > 0 ? (
          <InView key={remainingItems} onChange={(inview) => inview && fetchMore()} rootMargin="150px 0px">
            <span className="sr-only">trigger fetch more</span>
            <Spinner />
          </InView>
        ) : (
          <span>You&apos;re all caught up!</span>
        )}
      </div>
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
