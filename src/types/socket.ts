import type { Socket } from 'socket.io-client'

type Fn<I extends unknown[] = []> = (...args: I) => void

export type ServerToClientEvents = {
  'invalidate-session': Fn<[{ message: string }]>
  'email-verified': Fn<[{ message: string }]>
}

export type ClientToServerEvents = {
  'join-room': Fn<[roomId: string]>
}

export type SocketData = { sessionId: string }

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>
