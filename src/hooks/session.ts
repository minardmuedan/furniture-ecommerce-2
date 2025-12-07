import type { ClientSessionUser } from '@/types/session'
import { create } from 'zustand'

type SessionStore = {
  user: ClientSessionUser
  isPending: boolean
  isInitializing: boolean
  setUser: (user: ClientSessionUser) => void
  setIsPending: (value: boolean) => void
  clearSession: () => void
}

export const useSession = create<SessionStore>((set) => ({
  user: null,
  isPending: true,
  isInitializing: true,
  setUser: (user) => set({ user, isInitializing: false, isPending: true }),
  setIsPending: (value) => set({ isPending: value }),
  clearSession: () => set({ user: null, isPending: false }),
}))
