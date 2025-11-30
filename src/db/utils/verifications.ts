import { eq, and } from 'drizzle-orm'
import { db } from '..'
import { verificationTokensTable, type VerificationTokenPurpose } from '../schema'

export const createVerificationTokenDb = async (values: typeof verificationTokensTable.$inferInsert) =>
  await db.insert(verificationTokensTable).values(values)

export const getVerificationTokenDb = async (id: string, purpose: VerificationTokenPurpose) =>
  await db.query.verificationTokensTable.findFirst({
    with: { user: { columns: { email: true, emailVerified: true } } },
    where: (verificationToken) => and(eq(verificationToken.id, id), eq(verificationToken.purpose, purpose)),
  })

export const getVerificationTokenByTokenDb = async (token: string, purpose: VerificationTokenPurpose) =>
  await db.query.verificationTokensTable.findFirst({
    with: { user: { columns: { username: true } } },
    where: (verificationToken) => and(eq(verificationToken.token, token), eq(verificationToken.purpose, purpose)),
  })

export const updateVerificationTokenDb = async (
  verificationId: string,
  purpose: VerificationTokenPurpose,
  values: Partial<Pick<typeof verificationTokensTable.$inferInsert, 'token' | 'expiresAt'>>,
) =>
  await db
    .update(verificationTokensTable)
    .set(values)
    .where(and(eq(verificationTokensTable.id, verificationId), eq(verificationTokensTable.purpose, purpose)))

export const deleteUserVerificationTokensDb = async (userId: string) =>
  await db.delete(verificationTokensTable).where(eq(verificationTokensTable.userId, userId))

export const deleteVerificationTokenDb = async (id: string) =>
  await db.delete(verificationTokensTable).where(eq(verificationTokensTable.id, id))
