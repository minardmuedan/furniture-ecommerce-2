'use client'

import SignupLoading from '@/app/(auth)/signup/loading'
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
  const isConnecting = useStore(socketStore, (s) => s.isConnecting)
  const isReconnectFailed = useStore(socketStore, (s) => s.isReconnectFailed)
  const { secondsLeft, setTargetDate } = useCountdown(expiresAt)

  useEffect(() => {
    setTargetDate(expiresAt)
    const timeoutId = setTimeout(() => {
      socketStore.getState().disconnectSocket()
      router.refresh()
    }, expiresAt - Date.now())

    const socket = socketStore.getState().connectSocket(sessionId)

    socket.on('email-verified', ({ message }) => {
      toast.success(message)
      sessionStore.getState().revalidateSession()
      router.push('/')
    })

    return () => {
      socket.off('email-verified')
      toast.dismiss('socket')
      clearTimeout(timeoutId)
    }
  }, [expiresAt])

  if (isConnecting && !isReconnectFailed) return <SignupLoading />

  return (
    <Card className="w-10/12 border text-center sm:max-w-lg sm:text-start">
      <CardHeader>
        {isReconnectFailed ? (
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
