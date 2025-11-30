import { eq } from 'drizzle-orm'
import { db } from '..'
import { usersTable } from '../schema'

export const createUserDb = async (values: typeof usersTable.$inferInsert) => await db.insert(usersTable).values(values)

export const getUserByEmailDb = async (email: string) =>
  await db.query.usersTable.findFirst({ where: (user) => eq(user.email, email) })

export const updateUserDb = async (
  userId: string,
  values: Partial<Omit<typeof usersTable.$inferInsert, 'id' | 'email' | 'createdAt' | 'updatedAt'>>,
) =>
  await db
    .update(usersTable)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(usersTable.id, userId))
