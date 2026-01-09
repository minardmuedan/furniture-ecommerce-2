import { Button } from '@/components/ui/button'
import ProductImage from '@/features/products/components/product-image'
import type { Product } from '@/types/products'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { RemoveScroll } from 'react-remove-scroll'

export default function CheckoutDialog({ product }: { product: Product }) {
  const AnimatedProductImage = motion.create(ProductImage)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="hover:[&>svg]:translate-x-1">
        Checkout <ArrowRight className="transition-transform" />
      </Button>

      {isDialogOpen && (
        <RemoveScroll className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
          <div onClick={() => setIsDialogOpen(false)} className="grid min-h-full place-items-center py-6">
            <div onClick={(e) => e.stopPropagation()} className="bg-background w-full max-w-[calc(100%-2rem)] rounded-lg p-6 *:border sm:max-w-lg">
              <AnimatedProductImage layoutId={`layout-${product.image.src}`} props={product.image} className="max-w-40" />

              {JSON.stringify(product.image)}
            </div>
          </div>
        </RemoveScroll>
      )}
    </>
  )
}

/*
 <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-14 sm:text-start">
          <div className="max-w-40">
            <ProductImage props={product.image} />
          </div>

          <div className="space-y-6">
            <div>
              <div>address</div>
            </div>

            <div>
              <div className="text-muted-foreground mb-2 text-sm">Choose Color: </div>
              <ProductDetailsColor colors={[product.image.color, '#EAD2C6', '#FF9A64', '#0A0A0A', '#FFFFF']} />
            </div>
          </div>
        </div>
*/
