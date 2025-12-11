import { clientFetch } from '@/lib/cient-fetcher'
import type { ClientSession } from '@/types/session'
import { toast } from 'sonner'
import { createStore } from 'zustand'
import { socketStore } from './socket'

type SessionStore = {
  isInitializing: boolean
  isPending: boolean
  session: ClientSession
  fetchSession: () => Promise<unknown>
  revalidateSession: () => Promise<void>
  optimisticallyUpdateSession: (newSession: ClientSession) => void
}

export const sessionStore = createStore<SessionStore>((set, get) => ({
  isInitializing: true,
  isPending: false,
  session: null,
  fetchSession: async () => {
    const result = await clientFetch<ClientSession>('/api/auth')
    set({ isInitializing: false })

    if (result.isError) return toast.error(result.message)

    const newSession = result.data
    set({ session: newSession })

    if (newSession) socketStore.getState().connectSocket(newSession.sessionId)
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
}))
