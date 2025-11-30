import 'dotenv/config'
import { Server } from 'socket.io'
import type { ClientToServerEvents, ServerToClientEvents } from './types'

const io = new Server<ClientToServerEvents, ServerToClientEvents>(4000, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log('✔️ 🔌 : ', socket.id)

  socket.on('join-room', (roomId, callback) => {
    if (roomId) {
      socket.join(`room-${roomId}`)
      console.log(socket.id, ' has joined to room: ', roomId)
      callback(true)
    } else callback(false)
  })

  socket.on('server-email-verification', (secret, { verificationId, message }) => {
    if (secret && secret === process.env.SOCKET_SECRET) {
      socket.to(`room-${verificationId}`).emit('email-verified', message)
    }
  })

  socket.on('check-room', () => {
    console.log({ rooms: io.sockets.adapter.rooms })
  })

  socket.on('disconnect', () => {
    console.log('❌ 🔌 : ', socket.id)
  })
})

console.log('🚀 Socket server running on :4000')
