import { pgTable, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const promptsTable = pgTable('prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', {length: 100}).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})