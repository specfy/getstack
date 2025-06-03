import { sql } from 'kysely';

import type { Database } from '../types.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE repositories2 (
      id UUID DEFAULT generateUUIDv7(),
      org LowCardinality(String),
      name LowCardinality(String),
      stars UInt32 DEFAULT 0,
      updated_at DateTime DEFAULT now(),
      PRIMARY KEY (org, name)
    ) ENGINE = ReplacingMergeTree()
    ORDER BY (org, name);
  `.execute(db);
}
