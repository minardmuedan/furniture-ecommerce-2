'use client'

import Link from 'next/link'
import { Button, ButtonLink } from './ui/button'
import { sessionStore } from '@/lib/zustand-store/session'
import { useStore } from 'zustand'
import type { ClientSession } from '@/types/session'
import { LogOut } from 'lucide-react'
import LogoutButton from '@/features/auth/logout/logout-button'

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
          {session ? (
            <Usernav session={session} />
          ) : (
            <>
              <ButtonLink href="/signup" variant="link">
                Signup
              </ButtonLink>
              <ButtonLink href="/login">Login</ButtonLink>
            </>
          )}
        </div>
      )}
    </header>
  )
}

function Usernav({ session }: { session: NonNullable<ClientSession> }) {
  return (
    <div className="flex items-center gap-2">
      <span>hello, {session.user.username}</span>

      <LogoutButton />
    </div>
  )
}
