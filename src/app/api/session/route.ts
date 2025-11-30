import { getSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export type APISesssion = { username: string; email: string; createdAt: Date } | null

export async function GET(): Promise<NextResponse<APISesssion>> {
  const sessionData = await getSession()
  if (!sessionData) return NextResponse.json(null)

  const { username, email, createdAt } = sessionData.user

  return NextResponse.json({ username, email, createdAt })
}
