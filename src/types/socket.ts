import type { ClientSessionUser } from './session'

type Fn<I extends unknown[] = []> = (...args: I) => void

export type ServerToClientEvents = {
  authenticated: Fn<[{ user: ClientSessionUser; successMessage?: string }]>
  'invoke-session': Fn<[{ message: string }]>
}

export type ClientToServerEvents = {
  'join-room': Fn<[roomId: string]>
}

export type SocketData = { session: { id: string; user: ClientSessionUser } }
