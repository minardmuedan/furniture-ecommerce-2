import { eq, and } from 'drizzle-orm'
import { db } from '..'
import { verificationTokensTable, type VerificationTokenPurpose } from '../schema'

export const getVerificationTokenDb = async (id: string, purpose: VerificationTokenPurpose) =>
  await db.query.verificationTokensTable.findFirst({
    with: { user: true },
    where: (token) => and(eq(token.id, id), eq(token.purpose, purpose)),
  })

export const getUserVerificationTokenDb = async (userId: string, purpose: VerificationTokenPurpose) =>
  await db.query.verificationTokensTable.findFirst({
    where: (token) => and(eq(token.userId, userId), eq(token.purpose, purpose)),
  })

export const createVerificationTokenDb = async (values: typeof verificationTokensTable.$inferInsert) =>
  await db.insert(verificationTokensTable).values(values)

export const deleteUserVerificationTokensDb = async (userId: string) =>
  await db.delete(verificationTokensTable).where(eq(verificationTokensTable.userId, userId))

export const deleteVerificationTokenDb = async (id: string) =>
  await db.delete(verificationTokensTable).where(eq(verificationTokensTable.id, id))
