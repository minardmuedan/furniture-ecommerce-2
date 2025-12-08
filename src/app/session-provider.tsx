'use client'

import type { ClientSession } from '@/types/session'
import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react'

type SessionContextType = {
  session: ClientSession
  isPending: boolean
  isInitializing: boolean
  setSession: Dispatch<SetStateAction<ClientSession>>
  setIsInitializing: Dispatch<SetStateAction<boolean>>
}

type SessionProviderProps = { sessionUserPromise: Promise<ClientSession>; children: React.ReactNode }

const sessionContext = createContext<SessionContextType>({
  session: null,
  isPending: false,
  isInitializing: true,
  setSession: () => {},
  setIsInitializing: () => {},
})

export const useSession = () => useContext(sessionContext)

export function SessionProvider({ sessionUserPromise, children }: SessionProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const [session, setSession] = useState<ClientSession>(null)

  useEffect(() => {
    if (!isInitializing) setIsPending(true)

    sessionUserPromise.then((sessionUser) => {
      setSession(sessionUser)
      setIsInitializing(false)
      setIsPending(false)
    })
  }, [sessionUserPromise])

  return (
    <sessionContext.Provider value={{ session, isPending, isInitializing, setSession, setIsInitializing }}>
      {children}
    </sessionContext.Provider>
  )
}
