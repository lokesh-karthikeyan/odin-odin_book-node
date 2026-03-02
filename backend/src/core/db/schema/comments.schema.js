import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import { posts } from "./posts.schema.js";
import { relations } from "drizzle-orm";

export const postComments = pgTable("post_comments", {
  id: uuid("id").defaultRandom().primaryKey(),

  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),

  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(posts, {
    fields: [postComments.postId],
    references: [posts.id],
  }),

  author: one(users, {
    fields: [postComments.authorId],
    references: [users.id],
  }),
}));
