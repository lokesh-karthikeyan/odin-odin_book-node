import Fastify from 'fastify';

import envPlugin from './config/env.js';
import jwtPlugin from './core/plugins/jwt.js';
import authPlugin from './core/plugins/auth.js';
import dbPlugin from './core/plugins/db.js';
import responsePlugin from './core/plugins/response.js';
import corsPlugin from './core/plugins/cors.js';
import multipartPlugin from './core/plugins/multipart.js';
import staticPlugin from './core/plugins/static.js';
import websocketPlugin from './core/plugins/websocket.js';

import registerModules from './modules/index.js';

async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(envPlugin);
  await app.register(jwtPlugin);
  await app.register(authPlugin);
  await app.register(dbPlugin);
  await app.register(responsePlugin);
  await app.register(corsPlugin);
  await app.register(multipartPlugin);
  await app.register(staticPlugin);
  await app.register(websocketPlugin);

  await app.register(registerModules);

  return app;
}

export default buildApp;
