'use client'

import Link from 'next/link'
import { ButtonLink } from './ui/button'
import { sessionStore } from '@/lib/zustand-store/session'
import { useStore } from 'zustand'

export default function Navbar() {
  const isInitializing = useStore(sessionStore, (s) => s.isInitializing)
  const isPending = useStore(sessionStore, (s) => s.isPending)
  const session = useStore(sessionStore, (s) => s.session)

  return (
    <header className="flex h-14 items-center justify-between border-b px-5">
      <Link href="/">Home</Link>

      {isInitializing ? (
        <p>initializing session...</p>
      ) : (
        <div className={`${isPending ? 'animate-pulse opacity-75' : 'opacity-100'} flex items-center gap-1 transition-opacity`}>
          {session ? `hello , ${session.user.username}` : <ButtonLink href="/signup">Sign up</ButtonLink>}
        </div>
      )}
    </header>
  )
}
