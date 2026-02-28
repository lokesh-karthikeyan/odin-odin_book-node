import { users, follows, profiles } from "../../core/db/schema/index.js";
import { and, eq, inArray, not } from "drizzle-orm";

async function getAllUsersNotConnectedWithProfile(db, currentUserId) {
  const followingSubquery = db.select({ id: follows.followeeId }).from(follows)
    .where(eq(follows.followerId, currentUserId));

  const followersSubquery = db.select({ id: follows.followerId }).from(follows)
    .where(eq(follows.followeeId, currentUserId));

  return db.select({ id: users.id, fullName: users.fullName, picture: profiles.picture })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(
      and(
        not(inArray(users.id, followingSubquery)),
        not(inArray(users.id, followersSubquery)),
        not(eq(users.id, currentUserId)),
      )
    )
}

export {
  getAllUsersNotConnectedWithProfile,
}
