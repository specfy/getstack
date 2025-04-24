import { sql } from 'kysely';

import type { Database } from '../types.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE progress (
      date_week LowCardinality(String),
      progress LowCardinality(String),
    ) ENGINE = MergeTree()
    ORDER BY (date_week);
  `.execute(db);
}
