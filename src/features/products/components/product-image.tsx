'use client'

import type { Product } from '@/types/products'
import { ImageOff } from 'lucide-react'
import Image from 'next/image'
import { memo, useState } from 'react'
import { Blurhash } from 'react-blurhash'

const MemoizedBlurhash = memo(Blurhash)

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
        className={`absolute! inset-0! -z-1 transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-50'}`}
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

export default ProductImage
