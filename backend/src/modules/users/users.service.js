import * as repo from './users.repository.js';

async function getAllUsersNotConnectedWithProfileService(fastify, currentUserId) {
  return repo.getAllUsersNotConnectedWithProfile(fastify.db, currentUserId);
}

export {
  getAllUsersNotConnectedWithProfileService,
}
