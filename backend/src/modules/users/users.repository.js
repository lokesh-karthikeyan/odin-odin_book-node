import { users, follows, profiles } from "../../core/db/schema/index.js";
import { and, eq, inArray, not, sql } from "drizzle-orm";

async function getAllUsersNotConnectedWithProfile(db, currentUserId) {
  const followingSubquery = db
    .select({ id: follows.followeeId })
    .from(follows)
    .where(eq(follows.followerId, currentUserId));

  const followersSubquery = db
    .select({ id: follows.followerId })
    .from(follows)
    .where(eq(follows.followeeId, currentUserId));

  return db
    .select({
      id: users.id,
      fullName: users.fullName,
      picture: profiles.picture,
      profileId: profiles.id,
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(
      and(
        not(inArray(users.id, followingSubquery)),
        not(inArray(users.id, followersSubquery)),
        not(eq(users.id, currentUserId))
      )
    );
}

async function getUserProfile(db, userId, currentUserId) {
  const result = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      profileId: profiles.id,
      picture: profiles.picture,
      bio: profiles.bio,
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, userId));

  if (result.length === 0) return null;

  const followersCountRes = await db
    .select({ count: sql`count(*)` })
    .from(follows)
    .where(eq(follows.followeeId, userId));

  const followingCountRes = await db
    .select({ count: sql`count(*)` })
    .from(follows)
    .where(eq(follows.followerId, userId));

  let isFollowing = false;

  if (currentUserId && currentUserId !== userId) {
    const followCheck = await db
      .select({ id: follows.followerId })
      .from(follows)
      .where(
        and(
          eq(follows.followerId, currentUserId),
          eq(follows.followeeId, userId)
        )
      )
      .limit(1);

    isFollowing = followCheck.length > 0;
  }

  return {
    id: result[0].id,
    fullName: result[0].fullName,
    profileId: result[0].profileId,
    picture: result[0].picture,
    bio: result[0].bio,
    isFollowing,
    counts: {
      followers: followersCountRes[0].count,
      following: followingCountRes[0].count,
    }
  };
}

async function getFollowers(db, userId) {
  return db
    .select({
      id: users.id,
      fullName: users.fullName,
      picture: profiles.picture,
      profileId: profiles.id,
    })
    .from(follows)
    .innerJoin(users, eq(follows.followerId, users.id))
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(follows.followeeId, userId));
}

async function getFollowing(db, userId) {
  return db
    .select({
      id: users.id,
      fullName: users.fullName,
      picture: profiles.picture,
      profileId: profiles.id,
    })
    .from(follows)
    .innerJoin(users, eq(follows.followeeId, users.id))
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(follows.followerId, userId));
}

async function updateProfile(db, userId, { fullName, bio, picture }) {
  await db
    .update(users)
    .set({ fullName })
    .where(eq(users.id, userId));

  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId));

  if (existing.length === 0) {
    await db.insert(profiles).values({
      userId,
      bio: bio ?? null,
      picture: picture ?? null
    });
  } else {
    await db
      .update(profiles)
      .set({
        bio: bio ?? null,
        picture: picture ?? null
      })
      .where(eq(profiles.userId, userId));
  }

  const updated = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      bio: profiles.bio,
      picture: profiles.picture
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, userId));

  return updated[0];
}

export {
  getAllUsersNotConnectedWithProfile,
  getUserProfile,
  getFollowers,
  getFollowing,
  updateProfile,
};

