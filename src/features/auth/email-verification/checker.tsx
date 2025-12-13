'use client'

import { usePreventUnload } from '@/components/unload-preventer'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCountdown } from '@/hooks/countdown'
import { socketStore } from '@/lib/zustand-store/socket'
import { Clock, Mailbox, Unplug } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useStore } from 'zustand'
import CancelEmailVerificationButton from './action-buttons/cancel-button'
import ResendEmailVerificationButton from './action-buttons/resend-button'
import { sessionStore } from '@/lib/zustand-store/session'

type Props = { sessionId: string; expiresAt: number; email: string }

export default function EmailVerificationCheckerCard({ sessionId, expiresAt, email }: Props) {
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

      <CardContent className="flex items-center justify-center gap-1 sm:justify-start">
        <Mailbox className="text-muted-foreground" />
        <span> : {email}</span>
      </CardContent>

      <CardFooter className="flex-col gap-2 *:w-full *:flex-1 sm:flex-row-reverse">
        <ResendEmailVerificationButton />
        <CancelEmailVerificationButton />
      </CardFooter>
    </Card>
  )
}
