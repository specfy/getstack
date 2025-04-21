import { sql } from 'kysely';

import type { Database } from '../types';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE repositories (
      id UUID DEFAULT generateUUIDv7(),
      github_id String,
      org LowCardinality(String),
      name LowCardinality(String),
      branch String DEFAULT 'main',
      stars UInt32 DEFAULT 0,
      url String,
      ignored UInt8 DEFAULT 0,
      errored UInt8 DEFAULT 0,
      created_at DateTime DEFAULT now(),
      updated_at DateTime DEFAULT now(),
      last_fetched_at DateTime,
    ) ENGINE = MergeTree()
    ORDER BY (org, name);
  `.execute(db);
}
