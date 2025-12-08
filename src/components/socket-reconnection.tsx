import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import type { JSX } from 'react'

export default function SocketReconnectionToast(props: { icon: JSX.Element; message: string; className?: string }) {
  return (
    <div className={cn(props.className, 'flex w-52 items-center gap-2 rounded-md border px-4 py-3 shadow-sm')}>
      {props.icon}
      <span className="text-sm">{props.message}</span>
    </div>
  )
}
