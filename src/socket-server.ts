// socket-server.js
import { Server } from 'socket.io'

const io = new Server(4000, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log('✔️ 🔌 : ', socket.id)

  socket.on('new-message', (msg) => {
    socket.broadcast.emit('new-message', msg)
  })

  socket.on('disconnect', () => {
    console.log('❌ 🔌 : ', socket.id)
  })
})

console.log('🚀 Socket server running on :4000')
