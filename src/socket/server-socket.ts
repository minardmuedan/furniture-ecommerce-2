import 'server-only'

import { io, type Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from './types'

export const serverSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:4000', {
  transports: ['websocket'],
})
