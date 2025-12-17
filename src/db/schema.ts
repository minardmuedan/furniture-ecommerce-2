import type { Subcategories, Categories } from '@/lib/categories'
import type { ProductImage } from '@/types/products'
import { relations } from 'drizzle-orm'
import { boolean, integer, jsonb, numeric, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable(
  'users',
  {
    id: varchar().primaryKey(),
    username: varchar().notNull(),
    email: varchar().notNull(),
    emailVerified: timestamp('email_verified'),
    password: varchar().notNull(),
    isAdmin: boolean('is_admin'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [uniqueIndex('email_idx').on(table.email)],
)

export const userRelations = relations(usersTable, ({ many }) => ({ sessions: many(sessionsTable) }))

export const sessionsTable = pgTable('sessions', {
  id: varchar().primaryKey(),
  userId: varchar('user_id')
    .references(() => usersTable.id)
    .notNull(),
  ipAddress: varchar('ip_address').notNull(),
  userAgent: varchar('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  logoutedAt: timestamp('logouted_at'),
})

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, { fields: [sessionsTable.userId], references: [usersTable.id] }),
}))

export const productsTable = pgTable('products', {
  id: varchar().primaryKey(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  prevPrice: numeric('prev_price', { precision: 10, scale: 2 }).notNull(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  category: varchar().$type<Categories>().notNull(),
  subcategory: varchar().$type<Subcategories>().notNull(),
  stocks: integer().notNull(),
  image: jsonb().$type<ProductImage>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
