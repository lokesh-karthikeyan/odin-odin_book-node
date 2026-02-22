import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  bio: text('bio'),
  picture: text('picture'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export {
  profiles,
}
