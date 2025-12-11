import { Button } from '@/components/ui/button'
import { Undo2 } from 'lucide-react'
import { useActionState } from 'react'
import { backToSignupAction } from '../actions'
import { Spinner } from '@/components/ui/spinner'

export default function CancelEmailVerificationButton() {
  const actionState = useActionState(backToSignupAction, undefined)
  const action = actionState[1]
  const isPending = actionState[2]

  return (
    <form action={action}>
      <Button disabled={isPending} type="submit" variant="outline" className="w-full">
        {isPending ? <Spinner /> : <Undo2 />} Back to Signup
      </Button>
    </form>
  )
}
