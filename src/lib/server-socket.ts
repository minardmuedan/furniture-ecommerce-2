import { io } from 'socket.io-client'

export const serverSocket = io('http://localhost:4000', { transports: ['websocket'] })
