import { getSession } from '@/lib/session'
import type { ClientSession } from '@/types/session'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse<ClientSession>> {
  const sessionData = await getSession()

  if (!sessionData) return NextResponse.json(null)
  const { id, user } = sessionData

  return NextResponse.json({ sessionId: id, user: { username: user.username, email: user.email } })
}
