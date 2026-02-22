import Fastify from 'fastify';

import envPlugin from './config/env.js';
import cookiePlugin from './core/plugins/cookie.js';
import jwtPlugin from './core/plugins/jwt.js';
import authPlugin from './core/plugins/auth.js';
import dbPlugin from './core/plugins/db.js';

import registerModules from './modules/index.js';

async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(envPlugin);
  await app.register(cookiePlugin);
  await app.register(jwtPlugin);
  await app.register(authPlugin);
  await app.register(dbPlugin);

  await app.register(registerModules);

  return app;
}

export default buildApp;
