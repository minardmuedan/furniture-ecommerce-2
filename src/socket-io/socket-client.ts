'use client'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types/socket'
import { io, type Socket } from 'socket.io-client'
import { toast } from 'sonner'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
})

socket.on('connect_error', (err) => {
  console.log(err)
  toast.error(err.message)
})
