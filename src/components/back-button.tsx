'use client'

import type { VariantProps } from 'class-variance-authority'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button, type buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'

export default function BackButton({ variant, className, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  const router = useRouter()
  return (
    <Button {...props} variant={variant ?? 'ghost'} onClick={() => router.back()} className={cn('text-muted-foreground', className)}>
      <ChevronLeft /> Back
    </Button>
  )
}
