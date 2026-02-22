import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';

async function envPlugin(fastify) {
  const schema = {
    type: 'object',
    required: ['PORT', 'DATABASE_URL', 'JWT_SECRET'],
    properties: {
      PORT: { type: 'number', default: 3000 },
      DATABASE_URL: { type: 'string' },
      JWT_SECRET: { type: 'string' },
    }
  }

  await fastify.register(fastifyEnv, {
    schema,
    dotenv: true,
  })
}

export default fp(envPlugin);
