import * as service from './users.service.js';

async function getAllUsersNotConnectedWithProfileHandler(request, reply) {
  const currentUserId = request.user.id;

  const users = await service.getAllUsersNotConnectedWithProfileService(request.server, currentUserId);
  const data  = { users };

  return reply.success(data);
}

export {
  getAllUsersNotConnectedWithProfileHandler,
}
