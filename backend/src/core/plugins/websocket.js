import fp from 'fastify-plugin';
import fastifyWebsocket from '@fastify/websocket';

async function websocketPlugin(fastify) {
  await fastify.register(fastifyWebsocket);

  const clients = new Map();
  fastify.decorate("wsClients", clients);

  fastify.get("/ws", { websocket: true }, (connection, req) => {
    const user = req.user;
    if (!user) {
      connection.socket.close();
      return;
    }

    const userId = user.id;

    if (!clients.has(userId)) clients.set(userId, new Set());
    clients.get(userId).add(connection.socket);

    connection.socket.on("close", () => {
      clients.get(userId)?.delete(connection.socket);
      if (clients.get(userId)?.size === 0) clients.delete(userId);
    })
  })
}

export default fp(websocketPlugin);
