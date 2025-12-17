'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()
  return (
    <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
      <ChevronLeft /> Back
    </Button>
  )
}
