import * as controller from './follows.controller.js';
import { followSchema, userIdParamSchema } from './follows.schema.js';

async function followsRoutes(fastify) {
  fastify.post('/', { preHandler: [fastify.authenticate], schema: followSchema, }, controller.followUserHandler);
  fastify.delete('/', { preHandler: [fastify.authenticate], schema: followSchema, }, controller.unfollowUserHandler);
  fastify.get('/:userId/followers', { preHandler: [fastify.authenticate], schema: userIdParamSchema, }, controller.getFollowersHandler);
  fastify.get('/:userId/following', { preHandler: [fastify.authenticate], schema: userIdParamSchema, }, controller.getFollowingHandler);
}

export default followsRoutes;
