import { db } from '..'
import { usersTable } from '../schema'

export const getUserByEmailDb = async (email: string) =>
  await db.query.usersTable.findFirst({ where: (user, { eq }) => eq(user.email, email) })

export const createUserDb = async (values: typeof usersTable.$inferInsert) => await db.insert(usersTable).values(values)
