import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

async function jwtPlugin(fastify) {
  await fastify.register(fastifyJwt, {
    secret: fastify.config.JWT_SECRET,
  })
}

export default fp(jwtPlugin);
