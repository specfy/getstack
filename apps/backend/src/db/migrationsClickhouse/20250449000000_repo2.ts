import { sql } from 'kysely';

import type { Clickhouse } from '../types.clickhouse.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Clickhouse>): Promise<void> {
  await sql`
    CREATE TABLE repositories2 (
      id String,
      org LowCardinality(String),
      name LowCardinality(String),
      stars UInt32 DEFAULT 0,
      updated_at DateTime DEFAULT now(),
      PRIMARY KEY (id)
    ) ENGINE = ReplacingMergeTree()
    ORDER BY (id);
  `.execute(db);
}
