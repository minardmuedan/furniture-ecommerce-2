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
  userId: varchar('user_id')
    .references(() => usersTable.id)
    .notNull(),
  purpose: varchar().notNull().$type<VerificationTokenPurpose>(),
  token: varchar().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
})

export const verificationTokenRelations = relations(verificationTokensTable, ({ one }) => ({
  user: one(usersTable, { fields: [verificationTokensTable.userId], references: [usersTable.id] }),
}))

export const sessionsTable = pgTable('sessions', {
  id: varchar().primaryKey(),
  userId: varchar('user_id')
    .references(() => usersTable.id)
    .notNull(),
  ipAddress: varchar('ip_address').notNull(),
  userAgent: varchar('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
})

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, { fields: [sessionsTable.userId], references: [usersTable.id] }),
}))
