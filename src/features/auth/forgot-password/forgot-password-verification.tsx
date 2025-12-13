'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useCountdown } from '@/hooks/countdown'
import { useServerAction } from '@/hooks/server-action'
import { ArrowLeft, Clock, Mailbox, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { cancelPasswordVerificationAction, resendPasswordVerificationAction } from './actions'
import FormError from '@/components/ui/error'

type Props = { email: string; expiresAt: number; formError?: string }

export default function ForgotPasswordVerificationCheckerCard({ email, expiresAt, formError }: Props) {
  const router = useRouter()
  const { secondsLeft, setTargetDate } = useCountdown(expiresAt)

  useEffect(() => {
    setTargetDate(expiresAt)

    const timeoutId = setTimeout(() => {
      router.refresh()
    }, expiresAt - Date.now())

    const handleFocus = () => router.refresh()
    window.addEventListener('focus', handleFocus)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [expiresAt])

  return (
    <Card className="w-10/12 text-center sm:max-w-lg sm:border sm:text-start">
      <CardHeader>
        <CardTitle className="text-center text-xl sm:text-start">Email Verification Sent</CardTitle>

        <CardDescription>
          Please check your email inbox. <Clock className="inline size-4" />{' '}
          {secondsLeft > 60 ? `${Math.ceil(secondsLeft / 60)} minutes` : `${secondsLeft} seconds`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <FormError error={formError} />

        <div className="flex items-center justify-center gap-1 sm:justify-start">
          <Mailbox className="text-muted-foreground" />
          <span> : {email}</span>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 *:w-full *:flex-1 sm:flex-row-reverse">
        <ResendPasswordVerificationButton />
        <CancelPasswordVerificationButton />
      </CardFooter>
    </Card>
  )
}

function ResendPasswordVerificationButton() {
  const router = useRouter()
  const action = useServerAction(resendPasswordVerificationAction, {
    rateLimitKey: 'resend-password-verification',
    onError: ({ message }) => {
      toast.error(message)
      router.refresh()
    },
  })

  return (
    <Button disabled={!action.isHydrated || action.isPending || action.rateLimiter.isLimit} onClick={action.execute}>
      Resend{' '}
      {action.rateLimiter.isLimit ? (
        `after ${action.rateLimiter.secondsLeft} second/s`
      ) : (
        <>Verification {action.isPending ? <Spinner /> : <Send />}</>
      )}
    </Button>
  )
}

function CancelPasswordVerificationButton() {
  const [isPending, setIsPending] = useState(false)

  const handleCancel = async () => {
    setIsPending(true)
    await cancelPasswordVerificationAction()
    setIsPending(false)
  }

  return (
    <Button variant="outline" disabled={isPending} onClick={handleCancel}>
      {isPending ? <Spinner /> : <ArrowLeft />} Cancel
    </Button>
  )
}
