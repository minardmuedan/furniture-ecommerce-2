type Fn<I extends unknown[] = []> = (...args: I) => void

export type ServerToClientEvents = {
  'invoke-session': Fn<[{ message: string }]>
  'email-verified': Fn<[{ message: string }]>
}

export type ClientToServerEvents = {
  'join-room': Fn<[roomId: string]>
}

export type SocketData = { sessionId: string }
