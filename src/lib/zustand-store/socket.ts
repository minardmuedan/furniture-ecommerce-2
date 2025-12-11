import { dismissToast, reconnectAttemptToast, reconnectedToast, reconnectFailedToast } from '@/components/socket-toast'
import type { ClientSocket } from '@/types/socket'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { createStore } from 'zustand'
import { sessionStore } from './session'

type Socket = ClientSocket & { auth: { sessionId: string } }

type SocketStore = {
  isConnecting: boolean
  isConnected: boolean
  isReconnectFailed: boolean
  socket: Socket | null
  connectSocket: (sessionId: string) => Socket
  disconnectSocket: () => void
}

export const socketStore = createStore<SocketStore>((set, get) => ({
  isConnecting: false,
  isConnected: false,
  isReconnectFailed: false,
  socket: null,
  connectSocket: (sessionId) => {
    const existingSocket = get().socket

    if (get().isConnected && existingSocket) {
      if (existingSocket.auth.sessionId === sessionId) return existingSocket
    }

    get().disconnectSocket()
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, { auth: { sessionId }, reconnectionAttempts: 5 }) as Socket

    newSocket.io.on('reconnect', () => reconnectedToast())
    newSocket.io.on('reconnect_attempt', (attempt) => {
      set({ isConnecting: true })
      reconnectAttemptToast(attempt, newSocket.io.opts.reconnectionAttempts)
    })
    newSocket.io.on('reconnect_failed', () => {
      set({ isReconnectFailed: true, isConnecting: false })
      reconnectFailedToast()
    })

    newSocket.on('connect', () => set({ isConnected: true, isConnecting: false, isReconnectFailed: false }))
    newSocket.on('disconnect', () => set({ isConnected: false }))

    newSocket.on('invalidate-session', ({ message }) => {
      toast.error(message)

      sessionStore.getState().revalidateSession()
      get().disconnectSocket()
    })

    set({ socket: newSocket, isConnecting: true })
    return newSocket
  },
  disconnectSocket: () => {
    dismissToast()
    const socket = get().socket
    if (socket) {
      socket.removeAllListeners()
      socket.disconnect()
    }
    set({ socket: null, isConnected: false, isConnecting: false, isReconnectFailed: false })
  },
}))
