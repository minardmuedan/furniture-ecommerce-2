import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: varchar().primaryKey(),
  username: varchar().notNull(),
  email: varchar().unique().notNull(),
  emailVerified: timestamp('email_verified'),
  password: varchar().notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export type VerificationTokenPurpose = 'email-verification' | 'password-verification'
export const verificationTokensTable = pgTable('verification_tokens', {
  id: varchar().primaryKey(),
  purpose: varchar().notNull().$type<VerificationTokenPurpose>(),
  token: varchar().notNull(),
  userId: varchar()
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp('created_at').notNull(),
  expiredAt: timestamp('created_at').notNull(),
})
