import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { conversations } from "./conversations.schema.js";
import { users } from "./users.schema.js";

const conversationParticipants = pgTable(
  'conversation_participants',
  {
    conversationId: uuid("conversation_id").references(() => conversations.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.conversationId, table.userId],
    })
  })
)

export {
  conversationParticipants,
}
