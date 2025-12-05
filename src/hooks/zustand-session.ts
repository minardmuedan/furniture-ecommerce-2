'use client'

import type { ClientSessionUser } from '@/types/session'
import { create } from 'zustand'

type ZustandSession = {
  isPending: boolean
  user: ClientSessionUser | undefined
  setUser: (values: ClientSessionUser) => void
}
export const useSession = create<ZustandSession>((set) => ({
  user: undefined,
  isPending: true,
  setUser: (values) => set({ user: values, isPending: false }),
}))
