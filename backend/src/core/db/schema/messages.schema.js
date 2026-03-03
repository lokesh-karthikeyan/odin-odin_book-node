import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { conversations } from "./conversations.schema.js";
import { users } from "./users.schema.js";

const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  conversationId: uuid("conversation_id")
    .references(() => conversations.id)
    .notNull(),

  senderId: uuid("sender_id")
    .references(() => users.id)
    .notNull(),

  content: text("content"),
  imageUrl: text("image_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export {
  messages,
}
