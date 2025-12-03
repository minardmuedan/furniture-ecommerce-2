import 'dotenv/config'
import { Server } from 'socket.io'
import type { ClientToServerEvents, ServerToClientEvents } from './types'
import { redisSubscriberConnect } from '@/lib/redis'

const io = new Server<ClientToServerEvents, ServerToClientEvents>(4000, { cors: { origin: process.env.NEXT_PUBLIC_BASE_URL! } })

io.on('connection', async (socket) => {
  console.log('✔️ 🔌 : ', socket.id)

  socket.on('join-room', (roomId) => {
    if (roomId) {
      socket.join(`room-${roomId}`)
      console.log(socket.id, ' has joined to room: ', roomId)
    }
  })

  socket.on('disconnect', () => {
    console.log('❌ 🔌 : ', socket.id)
  })
})

console.log('🚀 Socket server running on http://localhost:4000')

const redis = await redisSubscriberConnect()
const EV_CHANNEL = 'email-verification'

await redis.subscribe(EV_CHANNEL, (message, channel) => {
  if (channel === EV_CHANNEL) {
    const data = JSON.parse(message)
    io.to(`room-${data.verificationId}`).emit('email-verified', data.message)
  }
})
