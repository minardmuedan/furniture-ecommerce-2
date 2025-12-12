'use client'

import { sessionStore } from '@/lib/zustand-store/session'
import { socketStore } from '@/lib/zustand-store/socket'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function InitializeSessionSocket() {
  const router = useRouter()
  useEffect(() => {
    const getSession = async () => {
      const session = await sessionStore.getState().fetchSession()
      if (session) socketStore.getState().connectSocket(session.sessionId, { router })
    }

    getSession()
  }, [])

  return null
}
