import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import type { ClientToServerEvents, ServerToClientEvents } from '@/types/socket'
import { AlertTriangle, Check } from 'lucide-react'
import type { JSX } from 'react'
import { io, type Socket as SocketIO } from 'socket.io-client'
import { toast } from 'sonner'

export type Socket = SocketIO<ServerToClientEvents, ClientToServerEvents>

export function createSocket(sessionId: string, init?: { onReconnectFailed?: () => void }) {
  if (!sessionId) throw new Error('No valid session id')

  const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    auth: { sessionId },
  })

  socket.io.on('reconnect_failed', () => {
    toast.custom(
      () => (
        <CustomToastContainer className="text-yellow-500">
          <AlertTriangle /> Connection lost. Please
          <Button size="sm" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </CustomToastContainer>
      ),
      {
        id: 'socket',
        position: 'bottom-right',
        dismissible: false,
        duration: Infinity,
      },
    )

    init?.onReconnectFailed?.()
  })

  socket.io.on('reconnect_attempt', (attempt) => {
    toast.custom(
      () => (
        <CustomToastContainer>
          <Spinner /> Reconnecting... ({attempt}/3)
        </CustomToastContainer>
      ),
      {
        id: 'socket',
        position: 'bottom-right',
        dismissible: false,
        duration: Infinity,
      },
    )
  })

  socket.io.on('reconnect', () => {
    toast.custom(
      () => (
        <CustomToastContainer className="border-emerald-500 bg-emerald-100">
          <Check /> Reconnected
        </CustomToastContainer>
      ),
      { id: 'socket', position: 'bottom-right', duration: 1500 },
    )
  })

  return socket
}

export default function CustomToastContainer(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        props.className,
        "flex w-fit items-center gap-2 justify-self-end rounded-md border px-4 py-3 text-sm font-medium shadow-sm [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      )}
    >
      {props.children}
    </div>
  )
}
