'use server'

import { serverSocket } from '@/socket/server-socket'

const secret = process.env.SECRET!

export const verifyEmailAction = async () => {
  serverSocket.emit('server-email-verification', secret, { verificationId: '123123123123123;;;;;;' })
}
