import { posts, postLikes, postComments, follows, postsRelations } from "../../core/db/schema/index.js";
import { eq, desc, and, inArray, sql } from "drizzle-orm";

export const postsRepository = (db) => ({
  async create(data) {
    const [post] = await db.insert(posts).values(data).returning();
    return post;
  },

  async findById(id) {
    return db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        author: true,
        comments: true,
      }
    });
  },

  async getFeed(userId) {
    const following = await db
      .select({ id: follows.followeeId })
      .from(follows)
      .where(eq(follows.followerId, userId));

    const followingIds = following.map(f => f.id);
    const authorIds = followingIds.length > 0 ? [...followingIds, userId] : [userId];

    const postsList = await db.query.posts.findMany({
      where: inArray(posts.authorId, authorIds),
      orderBy: [desc(posts.createdAt)],
      with: {
        author: true,
        comments: {
          with: {
            author: true,
          },
        }
      },
    });

    const postsWithLikeStatus = await Promise.all(
      postsList.map(async (post) => {
        const liked = await db.query.postLikes.findFirst({
          where: and(eq(postLikes.postId, post.id), eq(postLikes.userId, userId)),
        });

        return {
          ...post,
          isLiked: !!liked,
          comments: (post.comments ?? []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        };
      })
    );

    return postsWithLikeStatus;
  },

  async addLike(userId, postId) {
    const existing = await db.query.postLikes.findFirst({
      where: and(eq(postLikes.userId, userId), eq(postLikes.postId, postId))
    })

    if (existing) return;
    await db.insert(postLikes).values({ userId, postId });

    await db.update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, postId));
  },

  async removeLike(userId, postId) {
    await db.delete(postLikes)
      .where(and(
        eq(postLikes.userId, userId),
        eq(postLikes.postId, postId)
      ));

    await db.update(posts)
      .set({ likesCount: sql`${posts.likesCount} - 1` })
      .where(eq(posts.id, postId));
  },

  async addComment(data) {
    const [comment] = await db.insert(postComments)
      .values(data)
      .returning();

    await db.update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, data.postId));

    return comment;
  },
});
