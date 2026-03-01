import * as controller from './users.controller.js';
import { updateProfileSchema } from './users.schema.js';

async function usersRoutes(fastify) {
  fastify.get('/', { preHandler: [fastify.authenticate] }, controller.getAllUsersNotConnectedWithProfileHandler);
  fastify.get('/:id/profile', { preHandler: [fastify.authenticate] }, controller.getUserProfileHandler);
  fastify.get('/:id/followers', { preHandler: [fastify.authenticate] }, controller.getFollowersHandler);
  fastify.get('/:id/following', { preHandler: [fastify.authenticate] }, controller.getFollowingHandler);
  fastify.put('/me/profile', { preHandler: [fastify.authenticate], schema: updateProfileSchema }, controller.updateProfileHandler );
}

export default usersRoutes;
