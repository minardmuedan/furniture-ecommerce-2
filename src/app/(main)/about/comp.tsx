'use client'

import { Blurhash } from 'react-blurhash'

export default function Bhash({ hash }: { hash: string }) {
  return <Blurhash hash={hash} className="border-primary border" />
}
