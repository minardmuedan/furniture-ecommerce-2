'use client'

import { readdirSync } from 'fs'
import { productImages } from '../../../gg'
import { Blurhash } from 'react-blurhash'
import { useEffect, useRef, useState } from 'react'

export default function Homepage() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 gap-y-72">
      {Object.entries(productImages)
        .splice(0, 150)
        .map(([src, hash]) => (
          <div key={src} className="relative">
            <img key={src} src={src} className="border-primary size-full max-h-64 max-w-64 border" />
            <BH hash={hash} />
          </div>
        ))}
    </div>
  )
}

function BH({ hash }: { hash: string }) {
  return <Blurhash hash={hash} style={{ marginBottom: -6.5 }} resolutionX={32} resolutionY={32} punch={1} />
}
