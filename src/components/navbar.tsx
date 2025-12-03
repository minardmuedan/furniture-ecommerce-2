import Link from 'next/link'
import { ButtonLink } from './ui/button'
import { FlaskConical } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-5">
      <Link href="/">Home</Link>

      <nav>
        <ul className="flex items-center gap-1">
          <li>
            <ButtonLink href="/signup">Sign up</ButtonLink>
          </li>

          <li>
            <ButtonLink variant="link" href="/test">
              Test <FlaskConical />
            </ButtonLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
