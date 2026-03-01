import fp from 'fastify-plugin';
import fastifyStatic from '@fastify/static';
import path from 'node:path';

async function staticPlugin(fastify) {
  await fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
  });

  fastify.addHook('onSend', (request, reply, payload, done) => {
    const url = request.raw.url || '';
    if (url.endsWith('.svg')) reply.header('Content-Type', 'image/svg+xml');
    if (url.endsWith('.png')) reply.header('Content-Type', 'image/png');
    if (url.endsWith('.jpg') || url.endsWith('.jpeg')) reply.header('Content-Type', 'image/jpeg');
    done();
  });
}

export default fp(staticPlugin);
