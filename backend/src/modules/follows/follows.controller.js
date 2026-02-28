import * as service from "./follows.service.js";

async function followUserHandler(req, reply) {
  const followerId = req.user.id;
  const { followeeId } = req.body;

  await service.follow(req.server, { followerId, followeeId });

  return reply.success('User followed');
}

async function unfollowUserHandler(req, reply) {
  const followerId = req.user.id;
  const { followeeId } = req.body;

  await service.unfollow(req.server, { followerId, followeeId });

  return reply.success('User unfollowed');
}

async function getFollowersHandler(req, reply) {
  const { userId } = req.params;
  const followers = await service.followers(req.server, userId);
  const data = { followers }

  return reply.success(data);
}

async function getFollowingHandler(req, reply) {
  const { userId } = req.params;
  const following = await service.following(req.server, userId);
  const data = { following }

  return reply.success(data);
}

export {
  followUserHandler,
  unfollowUserHandler,
  getFollowersHandler,
  getFollowingHandler,
}
