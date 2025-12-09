import { Spinner } from '@/components/ui/spinner'

export default function SignupLoading() {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <Spinner />
      Connecting to server
    </div>
  )
}
