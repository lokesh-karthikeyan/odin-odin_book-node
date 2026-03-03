import authRoutes from "./auth/auth.route.js";
import followsRoutes from "./follows/follows.route.js";
import postsRoutes from "./posts/posts.route.js";
import usersRoutes from "./users/users.route.js";
import conversationsRoutes from "./conversations/conversations.route.js";

async function registerModules(fastify) {
  await fastify.register(authRoutes, { prefix: '/api/v1/auth' });
  await fastify.register(followsRoutes, { prefix: '/api/v1/follows' });
  await fastify.register(usersRoutes, { prefix: '/api/v1/users' });
  await fastify.register(postsRoutes, { prefix: "/api/v1/posts" });
  await fastify.register(conversationsRoutes, { prefix: "/api/v1/conversations" });
}

export default registerModules;
