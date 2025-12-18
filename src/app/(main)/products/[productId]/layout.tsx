import BackButton from '@/components/back-button'
import { sectionTriggerStyle } from '@/components/sections'
import { Suspense } from 'react'

export default function ProductDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={sectionTriggerStyle()}>
      <BackButton />
      <Suspense>{children}</Suspense>
    </div>
  )
}
