'use client'

import SignupLoading from '@/app/(auth)/signup/loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCountDown } from '@/hooks/countdown'
import { createSocket } from '@/socket-io/socket-client'
import { Clock, Mailbox, Send, Undo2, Unplug } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { resendEmailVerificationAction } from './resend-action'

export default function EmailVerificationCheckerCard({
  sessionId,
  expiresAt,
  email,
}: {
  sessionId: string
  expiresAt: number
  email: string
}) {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(true)
  const [isReconnectFailed, setIsReconnectFailed] = useState(false)
  const { timeLeft, setTimeLeft } = useCountDown()

  useEffect(() => {
    setTimeLeft(Math.ceil((expiresAt - Date.now()) / 1000))

    const timeoutId = setTimeout(() => {
      router.refresh()
    }, expiresAt - Date.now())

    const socket = createSocket(sessionId, {
      onReconnectFailed: () => {
        setIsConnecting(false)
        setIsReconnectFailed(true)
      },
    })

    socket.on('connect', () => {
      setIsConnecting(false)
      setIsReconnectFailed(false)
    })
    socket.on('disconnect', () => setIsConnecting(true))

    return () => {
      clearTimeout(timeoutId)
      toast.dismiss('socket')
      socket.off('connect')
      socket.disconnect()
    }
  }, [])

  if (isConnecting) return <SignupLoading />

  return (
    <Card className="w-10/12 border text-center sm:max-w-lg sm:text-start">
      <CardHeader>
        <CardTitle
          className={`flex items-center justify-center gap-2 text-xl sm:justify-start ${isReconnectFailed ? 'text-yellow-500' : ''}`}
        >
          {isReconnectFailed ? (
            <>
              <Unplug />
              Not Connected
            </>
          ) : (
            'Waiting for verification...'
          )}
        </CardTitle>
        <CardDescription className="text-nowrap">
          Please check your email inbox. <Clock className="inline size-4" />{' '}
          {timeLeft > 60 ? `${Math.ceil(timeLeft / 60)} mins` : `${timeLeft} seconds`}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-center gap-1 sm:justify-start">
        <Mailbox className="text-muted-foreground" />
        <span> : {email}</span>
      </CardContent>

      <CardFooter className="flex-col gap-2 *:w-full *:flex-1 sm:flex-row-reverse">
        <Button onClick={() => resendEmailVerificationAction()}>
          <Send /> Resend Verification
        </Button>

        <Button variant="outline">
          <Undo2 /> Back to Signup
        </Button>
      </CardFooter>
    </Card>
  )
}
