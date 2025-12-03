type Fn<I extends unknown[] = []> = (...args: I) => void

export type ServerToClientEvents = {
  'email-verified': Fn<[message: string]>
  message: Fn<[message: string]>
}

export type ClientToServerEvents = {
  'check-room': Fn
  'join-room': Fn<[roomId: string]>
}
