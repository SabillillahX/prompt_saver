import { pgTable, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const promptsTable = pgTable('prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').references(() => userTable.id),
  title: varchar('title', { length: 100 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  email: varchar('email', { length: 50 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});