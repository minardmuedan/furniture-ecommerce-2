import { Button } from '@/components/ui/button'
import { memaAction } from './action'

export default function MemaPage() {
  return (
    <form action={memaAction}>
      <Button type="submit">Check Speed</Button>
    </form>
  )
}
