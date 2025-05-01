import { createClient } from '@clickhouse/client';
import { ClickhouseDialect } from '@founderpath/kysely-clickhouse';
import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

import { envs } from '../utils/env.js';

import type { Clickhouse, Database } from './types.js';
import type { Dialect } from 'kysely';

const Pool = pg.Pool;

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: envs.DATABASE_URL,
    }),
  }),
});

export const kyselyClickhouse = new Kysely<Clickhouse>({
  dialect: new ClickhouseDialect({
    options: {
      url: envs.CLICKHOUSE_DATABASE_URL,
    },
  }) as unknown as Dialect,
});

export const clickHouse = createClient({
  url: envs.CLICKHOUSE_DATABASE_URL,
});
