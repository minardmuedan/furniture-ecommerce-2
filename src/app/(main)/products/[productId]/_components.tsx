'use client'

import { ProductImage } from '@/components/products'
import type { ProductImage as ProductImageType } from '@/types/products'
import { Check } from 'lucide-react'
import { useState } from 'react'

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

  const getContrastColor = (hexColor: string) => {
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }

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

export { ProductDetailsImage, ProductDetailsColor }
