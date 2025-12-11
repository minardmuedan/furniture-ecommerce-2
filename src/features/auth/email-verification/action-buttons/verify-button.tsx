'use client'

import { Button } from '@/components/ui/button'
import { useServerAction } from '@/hooks/server-action'
import { verifyEmailAction } from '../actions'
import { toast } from 'sonner'
import { sessionStore } from '@/lib/zustand-store/session'

export default function VerifyEmailButton({ jwtToken }: { jwtToken: string }) {
  const { execute, isHydrated, isPending } = useServerAction(verifyEmailAction, {
    rateLimitKey: 'verify-email',
    onSuccess: (data, router) => {
      sessionStore.getState().revalidateSession()
      toast.success(data.message)
      router.replace(data.redirectTo ?? '/')
    },
    onError: ({ message }, router) => router.replace(`/signup?error=${message}`),
  })

  return (
    <Button disabled={!isHydrated || isPending} onClick={() => execute({ jwtToken })}>
      Verify Email
    </Button>
  )
}
