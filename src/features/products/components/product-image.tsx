'use client'

import { ImageOff } from 'lucide-react'
import Image, { type ImageProps } from 'next/image'
import { memo, useState } from 'react'
import { Blurhash } from 'react-blurhash'

const MemoizedBlurhash = memo(Blurhash)

type Props = { src: string; alt: string; width: number; height: number; blurhash: string }

const ProductImage = ({ blurhash, src, alt, width, height }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (!src || hasError)
    return (
      <div className="grid aspect-square w-full place-items-center rounded-md">
        <ImageOff className="text-muted-foreground size-16" />
      </div>
    )

  const loader = () => `/product-images/${src}.png`
  const onError = () => setHasError(true)
  const onLoadingComplete = () => setIsLoaded(true)

  return (
    <div className={'aspect-square w-full content-center overflow-hidden border border-red-300'}>
      <div style={{ aspectRatio: width / height }} className="relative mx-auto max-h-full border">
        <Image src={src} alt={alt} fill loader={loader} onError={onError} onLoadingComplete={onLoadingComplete} />

        {/* <MemoizedBlurhash
          hash={blurhash}
          style={{ opacity: isLoaded ? 0 : 0.75 }}
          className="absolute! inset-0 size-full! transition-opacity duration-300"
        /> */}
      </div>
    </div>
  )
}

export default ProductImage
