import { dismissToast, reconnectAttemptToast, reconnectedToast, reconnectFailedToast } from '@/components/socket-toast'
import type { AppRouter } from '@/types/app-router'
import type { ClientSocket } from '@/types/socket'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { createStore } from 'zustand'
import { sessionStore } from './session'

type Socket = ClientSocket & { auth: { sessionId: string } }

type SocketStore = {
  isConnected: boolean
  isReconnectFailed: boolean
  socket: Socket | null
  connectSocket: (
    sessionId: string,
    init: {
      router: AppRouter
      onEmailVerified?: (data: { message: string }) => void
    },
  ) => void
  disconnectSocket: () => void
}

export const socketStore = createStore<SocketStore>((set, get) => ({
  isConnected: false,
  isReconnectFailed: false,
  socket: null,
  connectSocket: (sessionId, { router, onEmailVerified }) => {
    const existingSocket = get().socket

    if (get().isConnected && existingSocket) {
      if (existingSocket.auth.sessionId === sessionId) return existingSocket
    }

    get().disconnectSocket()
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, { auth: { sessionId }, reconnectionAttempts: 5 }) as Socket

    newSocket.io.on('reconnect', () => reconnectedToast())
    newSocket.io.on('reconnect_attempt', (attempt) => reconnectAttemptToast(attempt, newSocket.io.opts.reconnectionAttempts))
    newSocket.io.on('reconnect_failed', () => {
      set({ isReconnectFailed: true })
      reconnectFailedToast()
    })

    newSocket.on('connect', () => set({ isConnected: true, isReconnectFailed: false }))
    newSocket.on('disconnect', () => set({ isConnected: false }))

    newSocket.on('invalidate-session', ({ message }) => {
      toast.error(message)
      sessionStore.getState().optimisticallyUpdateSession(null)
      get().disconnectSocket()
      router.push('/login')
    })

    if (onEmailVerified) newSocket.on('email-verified', onEmailVerified)

    set({ socket: newSocket })
  },
  disconnectSocket: () => {
    dismissToast()
    const socket = get().socket
    if (socket) {
      socket.removeAllListeners()
      socket.disconnect()
    }
    set({ socket: null, isConnected: false, isReconnectFailed: false })
  },
}))
