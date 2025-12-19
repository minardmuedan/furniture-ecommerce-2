import { redisSubscriberConnect } from '@/lib/redis'
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@/types/socket'
import 'dotenv/config'
import { Server, type DefaultEventsMap } from 'socket.io'

const redis = await redisSubscriberConnect()
await redis.subscribe({
  EMAIL_VERIFICATION_CHANNEL: ({ sessionId, message }) => io.to(`session:${sessionId}`).emit('email-verified', { message }),
  INVALIDATE_SESSION_CHANNEL: ({ sessionId, message }) => io.to(`session:${sessionId}`).emit('invalidate-session', { message }),
})

const io = new Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>(4000, {
  cors: { origin: process.env.NEXT_PUBLIC_BASE_URL },
})

io.use(async (socket, next) => {
  const { sessionId } = socket.handshake.auth
  if (!sessionId) return next(new Error('No valid session id'))
  socket.data.sessionId = sessionId
  next()
})

io.on('connection', async (socket) => {
  console.log('✔️ 🔌 : ', socket.id)

  socket.join(`session:${socket.data.sessionId}`)

  socket.on('join-room', (roomId) => {
    if (roomId) socket.join(`room:${roomId}`)
  })

  socket.on('disconnect', () => {
    console.log('❌ 🔌 : ', socket.id)
  })
})

console.log('🚀 Socket server running on http://localhost:4000')
