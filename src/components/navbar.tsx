import Link from 'next/link'
import { Button, ButtonLink } from './ui/button'
import { verifyEmailAction } from '@/features/auth/signup/verification/actions'

export default function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-5">
      <Link href="/">Home</Link>

      <nav>
        <ul className="flex items-center gap-1">
          <li>
            <form action={verifyEmailAction}>
              <Button type="submit">Verify Email</Button>
            </form>
          </li>

          <li>
            <ButtonLink href="/signup">Sign up</ButtonLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
