import { relations } from 'drizzle-orm'
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: varchar().primaryKey(),
  username: varchar().notNull(),
  email: varchar().unique().notNull(),
  emailVerified: timestamp('email_verified'),
  password: varchar().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type VerificationTokenPurpose = 'email-verification' | 'password-verification'
export const verificationTokensTable = pgTable('verification_tokens', {
  id: varchar().primaryKey(),
  userId: varchar()
    .references(() => usersTable.id)
    .notNull(),
  purpose: varchar().notNull().$type<VerificationTokenPurpose>(),
  code: varchar().notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
})

export const verificationRelations = relations(verificationTokensTable, ({ one }) => ({
  user: one(usersTable, { fields: [verificationTokensTable.userId], references: [usersTable.id] }),
}))
