'use client'

import { Button } from '@/components/ui/button'
import { useServerAction } from '@/hooks/server-action'
import { sessionStore } from '@/lib/zustand-store/session'
import { toast } from 'sonner'
import { verifyEmailAction } from '../actions'

export default function VerifyEmailButton({ jwtToken }: { jwtToken: string }) {
  const { execute, isHydrated, isPending, rateLimiter } = useServerAction(verifyEmailAction, {
    rateLimitKey: 'verify-email',
    onSuccess: (data, router) => {
      sessionStore.getState().revalidateSession()
      toast.success(data.message)
      router.replace(data.redirectTo)
    },
    onError: ({ message }, router) => router.replace(`/signup?error=${message}`),
  })

  return (
    <Button disabled={!isHydrated || isPending || rateLimiter.isLimit} onClick={() => execute({ jwtToken })}>
      {rateLimiter.isLimit ? `Verify after ${rateLimiter.secondsLeft} second/s` : 'Verify Email'}
    </Button>
  )
}
