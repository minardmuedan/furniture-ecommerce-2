import { redisSubscriberConnect } from '@/lib/redis'
import { getSession } from '@/lib/session/get-session'
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@/types/socket'
import 'dotenv/config'
import { Server } from 'socket.io'

const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(4000, {
  cors: { origin: process.env.NEXT_PUBLIC_BASE_URL!, credentials: true },
})

io.use(async (socket, next) => {
  const cookies = socket.handshake.headers.cookie
  if (!cookies) return next(new Error('no cookies'))

  const cookieObj: Record<string, string> = {}
  cookies.split(';').forEach((cookie) => {
    const [key, value] = cookie.trim().split('=')
    cookieObj[key] = value
  })

  const sessionId = cookieObj.session
  if (!sessionId) return next(new Error('no session'))

  socket.data.session = { id: sessionId, user: null }

  const session = await getSession(sessionId)
  if (!session) return next()

  const {
    user: { email, username },
  } = session
  socket.data.session.user = { email, username }
  next()
})

io.on('connection', async (socket) => {
  console.log('✔️ 🔌 : ', socket.id)
  const sessionId = socket.data.session.id
  socket.join(`session:${sessionId}`)

  socket.emit('authenticated', { user: socket.data.session.user })

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
  EMAIL_VERIFICATION_CHANNEL: ({ sessionId, user, message }) => {
    io.to(`session:${sessionId}`).emit('authenticated', { user, successMessage: message })
  },
  INVOKE_SESSION_CHANNEL: ({ sessionId, message }) => {
    io.to(`session:${sessionId}`).emit('invoke-session', { message })
  },
})
