'use client'

import { Button } from '@/components/ui/button'
import { useServerAction } from '@/hooks/server-action'
import { sessionStore } from '@/lib/zustand-store/session'
import { toast } from 'sonner'
import { verifyEmailAction } from './actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCountdown } from '@/hooks/countdown'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'

type Props = { jwtToken: string; expiresAt: number; email: string; autoSigned: boolean }

export default function VerifyEmailFormCard({ jwtToken, expiresAt, email, autoSigned }: Props) {
  const router = useRouter()
  const { secondsLeft } = useCountdown(expiresAt)

  const { execute, isHydrated, isPending, rateLimiter } = useServerAction(verifyEmailAction, {
    rateLimitKey: 'verify-email',
    onSuccess: (data, router) => {
      sessionStore.getState().revalidateSession()
      toast.success(data.message)
      router.replace(data.redirectTo)
    },
    onError: ({ message }, router) => {
      if (message) toast.error(message)
      router.refresh()
    },
  })

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.refresh()
    }, expiresAt - Date.now())

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          Click the button below to verify your email address <br /> <span className="text-foreground font-normal">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button disabled={!isHydrated || isPending || rateLimiter.isLimit} onClick={() => execute({ jwtToken })} className="w-full">
          {rateLimiter.isLimit ? `Verify after ${rateLimiter.secondsLeft} second/s` : 'Verify Email 🎉'}
        </Button>
      </CardContent>

      <CardFooter className="text-muted-foreground flex-col justify-center text-sm">
        {autoSigned && <div className="mb-2">You&apos;ll be automatically signed in after verification.</div>}
        <div className="text-xs">
          <Clock className="inline size-4" /> {secondsLeft > 60 ? `${Math.ceil(secondsLeft / 60)} minutes` : `${secondsLeft} seconds`}
        </div>
      </CardFooter>
    </Card>
  )
}
