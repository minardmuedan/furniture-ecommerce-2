'use client'

import { useSession } from '@/hooks/zustand-session'
import { socket } from '@/socket-io/socket-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const { setUser, isPending } = useSession()

  useEffect(() => {
    if (socket.connected) onConnect()

    function onConnect() {
      setIsConnected(true)
    }

    socket.on('invoke-session', ({ message }) => {
      toast.error(message)
    })

    socket.on('authenticated', ({ user, successMessage }) => {
      if (successMessage) toast.success(successMessage)
      setUser(user)
    })
    socket.on('connect', onConnect)

    socket.connect()
    return () => {
      socket.off('connect', onConnect)
      socket.off('authenticated')
      socket.disconnect()
    }
  }, [])

  return (
    <>
      {(!isConnected || isPending) && (
        <div className="bg-background/20 fixed -inset-1 z-101 cursor-wait backdrop-blur-xs">
          <span className="sr-only">backdrop disabler</span>
        </div>
      )}

      {children}
    </>
  )
}
