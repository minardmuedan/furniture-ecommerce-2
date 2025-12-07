import Link from 'next/link'
import { Suspense } from 'react'
import ClientUserNav from './user-nav'
import { getSession } from '@/lib/session'

export default function Navbar() {
  const sessionPromise = getSession().then((session) =>
    session ? { username: session.user.username, email: session.user.email } : null,
  )

  return (
    <header className="flex h-14 items-center justify-between border-b px-5">
      <Link href="/">Home</Link>

      <Suspense fallback={<div>usernav is loading...</div>}>
        <ClientUserNav sessionPromise={sessionPromise} />
      </Suspense>
    </header>
  )
}
