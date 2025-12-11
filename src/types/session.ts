import type { getSessionDb } from '@/db/utils/sessions'

export type Session = NonNullable<Awaited<ReturnType<typeof getSessionDb>>>
export type ClientSession = { sessionId: string; user: { username: string; email: string } } | null
