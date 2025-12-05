'use client'

import Link from 'next/link'
import { ButtonLink } from './ui/button'
import { FlaskConical } from 'lucide-react'
import { useSession } from '@/hooks/zustand-session'

export default function Navbar() {
  const { user, isPending } = useSession()
  return (
    <header className="flex h-14 items-center justify-between border-b px-5">
      <Link href="/">Home</Link>

      <nav>
        <ul className="flex items-center gap-1">
          <li>
            <ButtonLink variant="link" href="/test">
              Test <FlaskConical />
            </ButtonLink>
          </li>

          {isPending ? (
            <li className="text-muted-foreground">getting user...</li>
          ) : user ? (
            <li>{user.username}</li>
          ) : (
            <li>
              <ButtonLink href="/signup">Sign up</ButtonLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
