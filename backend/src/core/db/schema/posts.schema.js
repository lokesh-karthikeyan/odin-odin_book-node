import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";
import { relations } from "drizzle-orm";
import { postLikes } from "./likes.schema.js";
import { postComments } from "./comments.schema.js";

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),

  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  imageUrl: text("image_url"),

  likesCount: integer("likes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),

  likes: many(postLikes),
  comments: many(postComments),
}));
