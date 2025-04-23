import { createClient } from '@clickhouse/client';
import { ClickhouseDialect } from '@founderpath/kysely-clickhouse';
import { Kysely } from 'kysely';
// import pg from 'pg';

import { envs } from '../utils/env.js';

import type { Database } from './types';

// const { Pool } = pg;

// const url = new URL(envs.DATABASE_URL);

// const _dialect = new PostgresDialect({
//   pool: new Pool({
//     connectionString: url.href,
//   }),
// });

export const db = new Kysely<Database>({
  dialect: new ClickhouseDialect({
    options: {
      url: envs.DATABASE_URL,
    },
  }),
});

export const clickHouse = createClient({
  url: envs.DATABASE_URL,
});
