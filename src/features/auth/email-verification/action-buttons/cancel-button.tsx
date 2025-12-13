import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { Check, Undo2, X } from 'lucide-react'
import { useState } from 'react'
import { backToSignupAction } from '../actions'
import { socketStore } from '@/lib/zustand-store/socket'
import { usePreventUnload } from '@/components/unload-preventer'

export default function CancelEmailVerificationButton() {
  const [isPending, setIsPending] = useState(false)

  const handleCancel = async () => {
    setIsPending(true)
    await backToSignupAction()
    setIsPending(false)
    socketStore.getState().disconnectSocket()
    usePreventUnload.getState().setCanUnload(true)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({ variant: 'secondary' })}>
        <Undo2 /> Back to Signup
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Email verification in progress</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to leave?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Stay on page <X />
          </AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleCancel}>
            Leave Page {isPending ? <Spinner /> : <Check />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
