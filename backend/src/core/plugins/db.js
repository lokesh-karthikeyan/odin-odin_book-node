import fp from 'fastify-plugin';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as allSchemas from '../db/schema/index.js';

async function dbPlugin(fastify) {
  const pool = new pg.Pool({ connectionString: fastify.config.DATABASE_URL });
  const db   = drizzle(pool, { schema: allSchemas });

  fastify.decorate('db', db);
}

export default fp(dbPlugin);
