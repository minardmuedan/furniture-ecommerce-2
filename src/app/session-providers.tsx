'use client'

import ErrorPage from '@/components/error-page'
import { Spinner } from '@/components/ui/spinner'
import { useSocketConnection } from '@/hooks/socket-connection'
import { useSession } from '@/hooks/session'
import { socket } from '@/socket-io/socket-client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const {
    isConnected,
    reconnectAttempt,
    isReconnectFailed,
    setIsInitialized,
    setIsConnected,
    setReconnectAttempt,
    setIsReconnectFailed,
  } = useSocketConnection()

  const { setUser } = useSession()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
      setIsInitialized(true)
    }

    function onDisconnect(reason: string) {
      setIsConnected(false)
      if (reason === 'io client disconnect') socket.connect()
    }

    function onConnectError(err: Error) {
      console.error('Connection error:', err)
      setIsInitialized(true)
    }

    function onReconnectFailed() {
      const message = 'Unable to connect. Please refresh the page'
      console.error('Reconnection failed after all attempts')
      toast.error(message)
      setIsReconnectFailed(true)
      setErrorMessage(message)
    }

    socket.on('invoke-session', ({ message }) => {
      toast.error(message)
      setUser(null)
    })

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)

    socket.io.on('reconnect', () => setReconnectAttempt(0))
    socket.io.on('reconnect_error', (err) => console.error(err))
    socket.io.on('reconnect_attempt', setReconnectAttempt)
    socket.io.on('reconnect_failed', onReconnectFailed)

    if (!socket.connected) socket.connect()

    return () => {
      socket.io.off('reconnect')
      socket.io.off('reconnect_error')
      socket.io.off('reconnect_attempt')
      socket.io.off('reconnect_failed', onReconnectFailed)

      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
    }
  }, [])

  if (isReconnectFailed) return <ErrorPage message={errorMessage} />

  return (
    <>
      {children}

      {!isConnected && !isReconnectFailed && reconnectAttempt > 0 && reconnectAttempt <= 5 && (
        <div className="bg-background fixed right-4 bottom-4 z-60 flex items-center gap-2 rounded-md border px-4 py-3 shadow-sm">
          <Spinner className="size-4" />
          <span className="text-sm">Reconnecting... ({reconnectAttempt}/5)</span>
        </div>
      )}
    </>
  )
}
