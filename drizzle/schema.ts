import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core"

export const todos = pgTable("todos", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	isComplete: boolean().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
