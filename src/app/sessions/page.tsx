import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { Trash2Icon } from 'lucide-react'
import { invokeSessionAction } from './action'

export default async function SessionPage() {
  const sessions = await db.query.sessionsTable.findMany({
    with: { user: true },
  })

  return (
    <ul className="space-y-3">
      {sessions.map((session) => (
        <li key={session.id} className="flex items-center justify-between rounded-md border p-3">
          <div>
            <p className="mb-2 text-sm font-semibold">{session.id}</p>

            <p>{session.user.id}</p>
            <p>{session.user.username}</p>
            <p>{session.user.email}</p>
          </div>

          <form
            action={async () => {
              'use server'
              await invokeSessionAction(session.id)
            }}
          >
            <Button disabled={!session.user.emailVerified} size="icon" variant="destructive">
              <span className="sr-only">Invoke Action</span>
              <Trash2Icon />
            </Button>
          </form>
        </li>
      ))}
    </ul>
  )
}
