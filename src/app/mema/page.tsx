'use client'

import { socket } from '@/socket-io/socket-client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { memaAction } from './action'

export default function Memapage() {
  const [isConnected, setIsConnected] = useState(false)
  const [message, setMessage] = useState('no message yet')
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      setIsConnected(true)
    }

    socket.on('message', setMessage)
    socket.on('connect', onConnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('connect', onConnect)
    }
  }, [])

  return (
    <div>
      <p>{String(isConnected)}</p>

      {message}

      <Button
        onClick={() =>
          socket.emit('join-room', 'minard-room', (isSuccess) => {
            if (isSuccess) toast.success('success fully joined minard room')
          })
        }
      >
        Join Room
      </Button>
      <Button onClick={memaAction}>Fire Action!</Button>
    </div>
  )
}
