import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";

const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export {
  conversations,
}
