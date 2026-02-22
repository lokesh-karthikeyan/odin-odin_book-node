import fp from 'fastify-plugin';

async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    request.log.error('Error occured while authenticating:', err);
    reply.code(401).send({ message: 'Unauthorized' });
  }
}

async function authPlugin(fastify) {
  fastify.decorate('authenticate', authenticate);
}

export default fp(authPlugin);
