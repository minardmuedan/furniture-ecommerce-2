type Fn<I extends unknown[] = []> = (...args: I) => void
type ServerFn<I extends unknown[] = []> = (secret: string, ...args: I) => void

export type ServerToClientEvents = {
  'email-verified': Fn<[message: string]>
  message: Fn<[message: string]>
}

export type ClientToServerEvents = {
  'check-room': Fn
  'join-room': Fn<[roomId: string, callback: Fn<[isSuccess: boolean]>]>
  'server-email-verification': ServerFn<[{ verificationId: string; message: string }]>
}
