'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useServerAction } from '@/hooks/server-action'
import { Send } from 'lucide-react'
import { resendEmailVerificationAction } from './actions'
import { toast } from 'sonner'

export default function ResendEmailVerificationButton() {
  const { execute, isPending, rateLimiter } = useServerAction(resendEmailVerificationAction, {
    rateLimitKey: 'resend-email-verification',
    onError: (error, router) => {
      toast.error(error.message)
      router.refresh()
    },
    onSuccess: ({ message }) => toast.success(message),
  })

  return (
    <Button disabled={rateLimiter.isLimit || isPending} onClick={() => execute()}>
      Resend {rateLimiter.isLimit ? `after ${rateLimiter.remainingSeconds} second/s` : isPending ? <Spinner /> : <Send />}
    </Button>
  )
}
