import { and, eq } from "drizzle-orm";
import { follows } from "../../core/db/schema/index.js";

async function followUser(db, { followerId, followeeId }) {
  return db.insert(follows).values({ followerId, followeeId });
}

async function unfollowUser(db, { followerId, followeeId }) {
  return db.delete(follows).where(
    and(
      eq(follows.followerId, followerId),
      eq(follows.followeeId, followeeId),
    ));
}

async function getFollowers(db, userId) {
  return db.select()
    .from(follows)
    .where(eq(follows.followeeId, userId));
}

async function getFollowing(db, userId) {
  return db.select()
    .from(follows)
    .where(eq(follows.followerId, userId));
}

export {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
}
