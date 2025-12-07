'use client'

import { useSession } from '@/app/session-provider'
import Link from 'next/link'
import { ButtonLink } from './ui/button'

export default function Navbar() {
  const { isInitializing, isPending, user } = useSession()
  return (
    <header className="flex h-14 items-center justify-between border-b px-5">
      <Link href="/">Home</Link>

      {isInitializing ? (
        <p>initializing session...</p>
      ) : (
        <div className={`${isPending ? 'animate-pulse opacity-75' : 'opacity-100'} flex items-center gap-1 transition-opacity`}>
          {user ? `hello , ${user.username}` : <ButtonLink href="/signup">Sign up</ButtonLink>}
        </div>
      )}
    </header>
  )
}
