import * as repo from './users.repository.js';

async function getAllUsersNotConnectedWithProfileService(fastify, currentUserId) {
  return repo.getAllUsersNotConnectedWithProfile(fastify.db, currentUserId);
}

async function getUserProfileService(fastify, userId, currentUserId) {
  return repo.getUserProfile(fastify.db, userId, currentUserId);
}

async function getFollowersService(fastify, userId) {
  return repo.getFollowers(fastify.db, userId);
}

async function getFollowingService(fastify, userId) {
  return repo.getFollowing(fastify.db, userId);
}

async function updateProfileService(fastify, userId, payload) {
  return repo.updateProfile(fastify.db, userId, payload);
}

export {
  getAllUsersNotConnectedWithProfileService,
  getUserProfileService,
  getFollowersService,
  getFollowingService,
  updateProfileService,
}
