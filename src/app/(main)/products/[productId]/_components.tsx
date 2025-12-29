'use client'

import ProductImage from '@/features/products/components/product-image'
import AddToCartButton from '@/features/user-cart/components/add-to-cart-btn'
import CheckoutButton from '@/features/user-checkouts/components/checkout-button'
import { getContrastColor } from '@/lib/utils'
import { sessionStore } from '@/lib/zustand-store/session'
import type { ProductImageType } from '@/types/products'
import { Check } from 'lucide-react'
import { use, useState } from 'react'
import { useStore } from 'zustand'

const ProductDetailsImage = ({ images }: { images: ProductImageType[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      <div key={activeIndex} className="animate-in fade-in duration-1000">
        <ProductImage props={images[activeIndex]} />
      </div>

      <ul className="mt-4 flex max-w-[300px] gap-4 overflow-hidden px-4">
        {images.map((image, index) => (
          <li
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`rounded border p-1 ${activeIndex === index ? 'border-primary' : 'border-transparent'}`}
          >
            <ProductImage props={image} />
          </li>
        ))}
      </ul>
    </>
  )
}

const ProductDetailsColor = ({ colors }: { colors: string[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <ul className="flex gap-4">
      {colors.map((color, index) => (
        <li
          key={index}
          onClick={() => setActiveIndex(index)}
          style={{ backgroundColor: color }}
          className={`grid size-10 place-items-center rounded-md border ${activeIndex === index ? 'border-primary' : ''}`}
        >
          <span className="sr-only">color</span>
          {activeIndex === index && <Check style={{ color: getContrastColor(color) }} className="invert-1" />}
        </li>
      ))}
    </ul>
  )
}

const ProductActionButtons = ({ productId, productStocksPromise }: { productId: string; productStocksPromise: Promise<number> }) => {
  const productStocks = use(productStocksPromise)
  const session = useStore(sessionStore, (s) => s.session)

  if (productStocks <= 0) return <div className="text-muted-foreground">out of stock</div>
  // if (!session) return null

  return (
    <div aria-label="actions" className="flex items-center gap-2">
      <AddToCartButton productId={productId} />
      <CheckoutButton productId={productId} />
    </div>
  )
}

export { ProductActionButtons, ProductDetailsColor, ProductDetailsImage }
