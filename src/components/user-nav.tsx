'use client'

import { useSession } from '@/hooks/session'
import type { ClientSessionUser } from '@/types/session'
import { use, useEffect } from 'react'
import { ButtonLink } from './ui/button'

export default function UserNav({ sessionPromise }: { sessionPromise: Promise<ClientSessionUser> }) {
  const { isPending, setUser, setIsPending } = useSession()
  const sessionUser = use(sessionPromise)

  useEffect(() => {
    setUser(sessionUser)
    setIsPending(false)
  }, [sessionPromise, sessionUser, setUser])

  return (
    <div className={`${isPending ? 'animate-pulse opacity-75' : 'opacity-100'} flex items-center gap-1 transition-opacity`}>
      {sessionUser ? `hello , ${sessionUser.username}` : <ButtonLink href="/signup">Sign up</ButtonLink>}
    </div>
  )
}
