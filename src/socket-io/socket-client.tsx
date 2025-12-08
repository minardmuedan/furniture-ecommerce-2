import SocketReconnectionToast from '@/components/socket-reconnection'
import { Spinner } from '@/components/ui/spinner'
import type { ClientToServerEvents, ServerToClientEvents } from '@/types/socket'
import { Check } from 'lucide-react'
import { io, type Socket } from 'socket.io-client'
import { toast } from 'sonner'

export function createSocket(sessionId: string, onReconnectFailed: () => void) {
  if (!sessionId) throw new Error('No valid session id')

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    auth: { sessionId },
  })

  socket.io.on('reconnect_failed', () => {
    toast.dismiss('socket')
    onReconnectFailed()
  })

  socket.io.on('reconnect_attempt', (attempt) => {
    toast.custom(() => <SocketReconnectionToast icon={<Spinner />} message={`Reconnecting... (${attempt}/3)`} />, {
      id: `socket`,
      position: 'bottom-right',
      dismissible: false,
      duration: Infinity,
    })
  })

  socket.io.on('reconnect', () => {
    toast.custom(
      () => (
        <SocketReconnectionToast
          icon={<Check className="size-4" />}
          message="Reconnected"
          className="border-emerald-500 bg-emerald-100"
        />
      ),
      { id: 'socket', position: 'bottom-right', duration: 1500 },
    )
  })

  return socket
}
