'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { usePreventUnload } from '@/components/unload-preventer'
import { useCountdown } from '@/hooks/countdown'
import { useServerAction } from '@/hooks/server-action'
import { sessionStore } from '@/lib/zustand-store/session'
import { socketStore } from '@/lib/zustand-store/socket'
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { Check, Clock, Mailbox, Send, Undo2, Unplug, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useStore } from 'zustand'
import { backToSignupAction, resendEmailVerificationAction } from './actions'
import FormError from '@/components/ui/error'

type Props = { sessionId: string; expiresAt: number; email: string; formError?: string }

export default function SignupEmailVerificationCheckerCard({ sessionId, expiresAt, email, formError }: Props) {
  const router = useRouter()
  const { secondsLeft, setTargetDate } = useCountdown(expiresAt)
  const setCanUnload = usePreventUnload.getState().setCanUnload
  const isConnected = useStore(socketStore, (s) => s.isConnected)

  useEffect(() => {
    setTargetDate(expiresAt)

    const timeoutId = setTimeout(() => {
      socketStore.getState().disconnectSocket()
      setCanUnload(true)
      router.refresh()
    }, expiresAt - Date.now())

    socketStore.getState().connectSocket(sessionId, {
      router,
      onConnect: () => setCanUnload(false),
      onEmailVerified: ({ message }) => {
        toast.success(message)
        sessionStore.getState().revalidateSession()
        setCanUnload(true)
        router.push('/')
      },
    })

    return () => {
      toast.dismiss('socket')
      clearTimeout(timeoutId)
    }
  }, [expiresAt])

  return (
    <Card className="w-10/12 text-center sm:max-w-lg sm:border sm:text-start">
      <CardHeader>
        {!isConnected ? (
          <CardTitle className="flex items-center justify-center gap-2 text-xl text-yellow-500 sm:justify-start">
            <Unplug />
            <span>Not Connected</span>
          </CardTitle>
        ) : (
          <CardTitle className="text-center text-xl sm:text-start">Waiting for verification...</CardTitle>
        )}

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
        <ResendEmailVerificationButton />
        <CancelEmailVerificationButton />
      </CardFooter>
    </Card>
  )
}

function CancelEmailVerificationButton() {
  const [isPending, setIsPending] = useState(false)

  const handleCancel = async () => {
    setIsPending(true)
    await backToSignupAction()
    setIsPending(false)
    socketStore.getState().disconnectSocket()
    usePreventUnload.getState().setCanUnload(true)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({ variant: 'secondary' })}>
        <Undo2 /> Back to Signup
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Email verification in progress</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to leave?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Stay on page <X />
          </AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleCancel}>
            Leave Page {isPending ? <Spinner /> : <Check />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function ResendEmailVerificationButton() {
  const router = useRouter()
  const action = useServerAction(resendEmailVerificationAction, {
    rateLimitKey: 'resend-email-verification',
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
