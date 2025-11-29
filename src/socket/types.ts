type Fn<I extends unknown[] = []> = (...args: I) => void

export type ServerToClientEvents = {
  'email-verified': Fn<[message: string]>
}

export type ClientToServerEvents = {
  'check-room': Fn
  'join-room': Fn<[roomId: string, callback: Fn<[isSuccess: boolean]>]>
  'server-email-verification': Fn<[secret: string, { verificationId: string }]>
}
