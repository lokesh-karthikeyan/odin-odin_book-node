import fp from 'fastify-plugin';
import { AppError } from '../utils/AppError.js';

async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw AppError.unauthorized("Invalid or expired token");
  }
}

async function authPlugin(fastify) {
  fastify.decorate('authenticate', authenticate);
}

export default fp(authPlugin);
