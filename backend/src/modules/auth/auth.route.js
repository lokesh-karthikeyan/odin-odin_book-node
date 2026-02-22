import { signupSchema, loginSchema } from "./auth.schema.js";
import { signupHandler, loginHandler, logoutHandler } from "./auth.controller.js";

async function authRoutes(fastify) {
  fastify.post('/signup', { schema: signupSchema }, signupHandler);

  fastify.post('/login', { schema: loginSchema }, loginHandler);

  fastify.post('/logout', { preHandler: [fastify.authenticate] }, logoutHandler);
}

export default authRoutes;
