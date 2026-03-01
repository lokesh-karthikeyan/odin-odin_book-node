import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';

async function multipartPlugin(fastify) {
  await fastify.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024
    },
  });
}

export default fp(multipartPlugin);
