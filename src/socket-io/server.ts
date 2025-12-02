import 'dotenv/config'
import { Server } from 'socket.io'
import type { ClientToServerEvents, ServerToClientEvents } from './types'
import { createClient } from 'redis'

const subscriber = createClient()
subscriber.connect()

const io = new Server<ClientToServerEvents, ServerToClientEvents>(4000, { cors: { origin: '*' } })

io.on('connection', async (socket) => {
  console.log('✔️ 🔌 : ', socket.id)

  socket.on('join-room', (roomId, callbackIsJoined) => {
    if (!roomId) return callbackIsJoined(false)

    socket.join(`room-${roomId}`)
    console.log(socket.id, ' has joined to room: ', roomId)
    callbackIsJoined(true)
  })

  socket.on('disconnect', () => {
    console.log('❌ 🔌 : ', socket.id)
  })
})

console.log('🚀 Socket server running on :4000')
