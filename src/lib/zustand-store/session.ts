import { clientFetch } from '@/lib/cient-fetcher'
import type { ClientSession } from '@/types/session'
import { toast } from 'sonner'
import { createStore } from 'zustand'

type SessionStore = {
  isInitializing: boolean
  isPending: boolean
  session: ClientSession
  fetchSession: () => Promise<ClientSession>
  revalidateSession: () => Promise<void>
  optimisticallyUpdateSession: (newSession: ClientSession) => void
  invalidateSession: () => void
}

export const sessionStore = createStore<SessionStore>((set, get) => ({
  isInitializing: true,
  isPending: false,
  session: null,
  fetchSession: async () => {
    const result = await clientFetch<ClientSession>('/api/auth')
    set({ isInitializing: false })
    if (result.isError) {
      toast.error(result.message)
      return null
    }

    const session = result.data
    set({ session })
    return session
  },
  revalidateSession: async () => {
    set({ isPending: true })
    await get().fetchSession()
    set({ isPending: false })
  },
  optimisticallyUpdateSession: (newSession) => {
    set({ session: newSession })
    get().fetchSession()
  },
  invalidateSession: () => set({ session: null }),
}))
