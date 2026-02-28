import * as controller from './users.controller.js';

async function usersRoutes(fastify) {
  fastify.get('/', { preHandler: [fastify.authenticate] }, controller.getAllUsersNotConnectedWithProfileHandler);
}

export default usersRoutes;
