import { eq } from 'drizzle-orm'
import { db } from '..'
import { sessionsTable } from '../schema'

export const createSessionDb = async (values: typeof sessionsTable.$inferInsert) => await db.insert(sessionsTable).values(values)

export const getSessionDb = async (id: string) =>
  await db.query.sessionsTable.findFirst({
    with: { user: true },
    where: (session) => eq(session.id, id),
  })

export const updateSessionDb = async (sessionId: string, values: Partial<Pick<typeof sessionsTable.$inferInsert, 'expiresAt'>>) =>
  await db.update(sessionsTable).set(values).where(eq(sessionsTable.id, sessionId))

export const deleteSessionDb = async (id: string) => await db.delete(sessionsTable).where(eq(sessionsTable.id, id))
