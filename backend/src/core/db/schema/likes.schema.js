import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import { posts } from "./posts.schema.js";

export const postLikes = pgTable("post_likes", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  pk: {
    name: "post_likes_pk",
    columns: [table.userId, table.postId],
  },
}));
