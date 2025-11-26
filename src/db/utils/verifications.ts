import { eq, and } from 'drizzle-orm'
import { db } from '..'
import { verificationTokensTable, type VerificationTokenPurpose } from '../schema'

export const getUserVerificationTokenDb = async (userId: string, purpose: VerificationTokenPurpose) =>
  await db.query.verificationTokensTable.findFirst({
    where: (token) => and(eq(token.userId, userId), eq(token.purpose, purpose)),
  })

export const createVerificationTokenDb = async (values: typeof verificationTokensTable.$inferInsert) =>
  await db.insert(verificationTokensTable).values(values)

export const deleteVerificationTokenDb = async (id: string) =>
  await db.delete(verificationTokensTable).where(eq(verificationTokensTable.id, id))
