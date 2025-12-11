'use client'

import { sessionStore } from '@/lib/zustand-store/session'
import { useEffect } from 'react'

export default function InitializeSession() {
  useEffect(() => {
    sessionStore.getState().fetchSession()
  }, [])

  return null
}
