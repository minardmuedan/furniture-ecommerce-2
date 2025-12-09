'use client'

import { clientFetch } from '@/lib/cient-fetcher'
import { createSocket, type Socket } from '@/socket-io/socket-client'
import type { ClientSession } from '@/types/session'
import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'sonner'

type SessionContextType = {
  session: ClientSession
  isPending: boolean
  isInitializing: boolean
  setSession: Dispatch<SetStateAction<ClientSession>>
  revalidateSession: () => void
  optimisticallyUpdateSession: (newSession: ClientSession) => void
}

const sessionContext = createContext<SessionContextType>({
  session: null,
  isPending: false,
  isInitializing: true,
  setSession: () => {},
  revalidateSession: () => {},
  optimisticallyUpdateSession: () => {},
})

export const useSession = () => useContext(sessionContext)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const [session, setSession] = useState<ClientSession>(null)

  const revalidateSession = () => !isPending && _getSession()

  const optimisticallyUpdateSession = (newSession: ClientSession) => {
    setSession(newSession)
    revalidateSession()
  }

  async function _getSession() {
    setIsPending(true)
    await clientFetch<ClientSession>('api/auth', {
      onError: (message: string) => {
        toast.error(message)
        setSession(null)
      },
      onSuccess: (sessionData) => {
        if (sessionData) {
          setSession(sessionData)
          const socket = createSocket(sessionData.sessionId)

          socket.on('invoke-session', ({ message }) => {
            toast.error(message)
            setSession(null)

            if (socketRef.current) {
              socketRef.current.disconnect()
              socketRef.current = null
            }

            _getSession()
          })

          socketRef.current = socket
        }
      },
    })

    setIsInitializing(false)
    setIsPending(false)
  }

  useEffect(() => {
    _getSession()

    return () => {
      if (socketRef.current) {
        socketRef.current.off('invoke-session')
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  return (
    <sessionContext.Provider
      value={{ session, isPending, isInitializing, setSession, revalidateSession, optimisticallyUpdateSession }}
    >
      {children}
    </sessionContext.Provider>
  )
}
