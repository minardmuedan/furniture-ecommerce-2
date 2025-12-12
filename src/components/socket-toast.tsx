import { cn } from '@/lib/utils'
import { AlertTriangle, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'

function CustomToastContainer(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-2 justify-self-end rounded-md border px-4 py-3 text-sm font-normal shadow-sm [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}

const toastId = 'socket'
const defaultToastData = { id: toastId, position: 'bottom-right', dismissible: false, duration: Infinity } as const

export const reconnectFailedToast = () =>
  toast.custom(
    () => (
      <CustomToastContainer className="text-yellow-500">
        <AlertTriangle /> Connection lost. Please
        <Button size="sm" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </CustomToastContainer>
    ),
    defaultToastData,
  )

export const reconnectAttemptToast = (attempt: number, maxAttempts?: number) =>
  toast.custom(
    () => (
      <CustomToastContainer>
        <Spinner /> Reconnecting... ({attempt}/{maxAttempts})
      </CustomToastContainer>
    ),
    defaultToastData,
  )

export const reconnectedToast = () =>
  toast.custom(
    () => (
      <CustomToastContainer className="border-emerald-500 bg-emerald-100">
        <Check /> Reconnected
      </CustomToastContainer>
    ),
    { ...defaultToastData, duration: 1500 },
  )

export const dismissToast = () => toast.dismiss(toastId)
