'use client'

import { getContrastColor } from '@/lib/utils'
import { Check } from 'lucide-react'
import { useState } from 'react'

export default function ProductDetailsColor({ colors }: { colors: string[] }) {
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
