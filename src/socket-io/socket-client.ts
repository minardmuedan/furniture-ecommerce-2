'use client'

import type { ClientToServerEvents, ServerToClientEvents } from '@/types/socket'
import { io, type Socket } from 'socket.io-client'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:4000', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
})
