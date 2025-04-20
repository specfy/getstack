import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

import type { Database } from './types.js';

const { Pool } = pg;

const url = new URL(process.env['DATABASE_URL']!);

const dialect = new PostgresDialect({
  pool: new Pool({
    database: url.pathname.slice(1),
    host: url.hostname,
    user: url.username,
    password: url.password,
    port: Number.parseInt(url.port, 10),
    max: 20,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
