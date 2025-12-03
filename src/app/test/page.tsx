'use client'

import { socket } from '@/socket-io/socket-client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { testAction } from './action'

export default function TestPage() {
  // const [isConnected, setIsConnected] = useState(false)
  // const [joinedRoom, setJoinedRoom] = useState<string>()
  // const [message, setMessage] = useState('no message yet')
  // const [isPending, setIsPending] = useState(false)

  // useEffect(() => {
  //   if (socket.connected) {
  //     onConnect()
  //   }

  //   function onConnect() {
  //     setIsConnected(true)
  //   }

  //   socket.on('email-verified', setMessage)
  //   socket.on('connect', onConnect)

  //   return () => {
  //     socket.off('connect', onConnect)
  //     socket.off('connect', onConnect)
  //   }
  // }, [])

  return (
    <div className="space-y-5">
      <Button
        onClick={async () => {
          console.log(await testAction())
        }}
      >
        Fire Action!
      </Button>
    </div>
  )
}
