'use client'

import { Button } from '@/components/ui/button'
import { socket } from '@/socket/client-socket'
import { Mailbox, Send, Undo } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function EmailVerificationChecker({ verificationId, userEmail }: { verificationId: string; userEmail: string }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isRoomJoined, setIsRoomJoined] = useState(false)

  useEffect(() => {
    if (socket.connected) {
      onConnect()
      socket.emit('join-room', verificationId, setIsRoomJoined)
    }

    function onConnect() {
      setIsConnected(true)
    }

    socket.on('connect', onConnect)
    socket.on('email-verified', (message) => toast.success(message))

    return () => {
      socket.off('connect', onConnect)
      socket.off('email-verified')
    }
  }, [])

  return (
    <div>
      <div className="mb-8 text-center">
        {JSON.stringify({ isRoomJoined, isConnected })}
        <Mailbox className="mx-auto size-20" />
        <h1 className="mb-1 text-xl font-semibold">Please check your email inbox</h1>
        <div className="text-muted-foreground text-sm font-medium">{userEmail}</div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button onClick={() => socket.emit('check-room')}>check rooms</Button>

        <Button>
          Resend <Send />
        </Button>
        <Button variant="outline">
          <Undo /> Back to Sign up
        </Button>
      </div>
    </div>
  )
}
