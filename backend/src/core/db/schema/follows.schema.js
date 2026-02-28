import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

const follows = pgTable(
  'follows',
  {
    followerId: uuid('follower_id').notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    followeeId: uuid('followee_id').notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followeeId] }),
  })
);

export {
  follows,
}
