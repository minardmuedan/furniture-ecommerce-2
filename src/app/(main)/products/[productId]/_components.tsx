'use client'

import ProductImage from '@/features/products/components/product-image'
import AddToCartButton from '@/features/user-cart/components/add-to-cart-btn'
import CheckoutDialog from '@/features/user-checkouts/components/checkout-dialog'
import { sessionStore } from '@/lib/zustand-store/session'
import type { Product, ProductImageType } from '@/types/products'
import { motion } from 'motion/react'
import { use, useState } from 'react'
import { useStore } from 'zustand'

const ProductDetailsImage = ({ images }: { images: ProductImageType[] }) => {
  const AnimatedProductImage = motion.create(ProductImage)

  const [activeIndex, setActiveIndex] = useState(0)
  const selectedImage = images[activeIndex]

  return (
    <>
      <div key={activeIndex} className="animate-in fade-in duration-1000">
        <AnimatedProductImage layoutId={`layout-${selectedImage.src}`} props={selectedImage} />
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

const ProductActionButtons = ({ product, productStocksPromise }: { product: Product; productStocksPromise: Promise<number> }) => {
  const productStocks = use(productStocksPromise)
  const session = useStore(sessionStore, (s) => s.session)

  if (productStocks <= 0) return <div className="text-muted-foreground">out of stock</div>
  // if (!session) return null

  return (
    <div aria-label="actions" className="flex items-center gap-2">
      <AddToCartButton productId={product.id} />
      <CheckoutDialog product={product} />
    </div>
  )
}

export { ProductActionButtons, ProductDetailsImage }
