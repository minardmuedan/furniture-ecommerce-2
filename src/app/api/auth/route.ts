import { validateSession } from '@/lib/session'
import type { ClientSession } from '@/types/session'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse<ClientSession>> {
  const sessionData = await validateSession()

  if (!sessionData) return NextResponse.json(null)
  const { sessionId, user } = sessionData

  return NextResponse.json({ sessionId, user: { username: user.username, email: user.email } })
}
