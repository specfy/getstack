import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

import { envs } from '../utils/env';

import type { Database } from './types';

const { Pool } = pg;

const url = new URL(envs.DATABASE_URL);

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: url.href,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
