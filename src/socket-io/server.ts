import { redisSubscriberConnect } from '@/lib/redis'
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@/types/socket'
import 'dotenv/config'
import { Server } from 'socket.io'

const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(4000, {
  cors: { origin: process.env.NEXT_PUBLIC_BASE_URL!, credentials: true },
})

io.use(async (socket, next) => {
  const cookies = socket.handshake.headers.cookie
  if (!cookies) return next()

  const cookieObj: Record<string, string> = {}
  cookies.split(';').forEach((cookie) => {
    const [key, value] = cookie.trim().split('=')
    cookieObj[key] = value
  })

  socket.data.sessionId = cookieObj.session
  next()
})

io.on('connection', async (socket) => {
  console.log('✔️ 🔌 : ', socket.id)

  const sessionId = socket.data.sessionId
  if (sessionId) socket.join(`session:${sessionId}`)

  socket.on('join-room', (roomId) => {
    if (roomId) socket.join(`room:${roomId}`)
  })

  socket.on('disconnect', () => {
    console.log('❌ 🔌 : ', socket.id)
  })
})

console.log('🚀 Socket server running on http://localhost:4000')

const redis = await redisSubscriberConnect()
await redis.subscribe({
  EMAIL_VERIFICATION_CHANNEL: ({ sessionId, message }) => {
    io.to(`session:${sessionId}`).emit('email-verified', { message })
  },

  INVOKE_SESSION_CHANNEL: ({ sessionId, message }) => {
    io.to(`session:${sessionId}`).emit('invoke-session', { message })
  },
})
