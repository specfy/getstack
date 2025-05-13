import { sql } from 'kysely';

import type { Database } from '../types.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE technologies (
      org LowCardinality(String),
      name LowCardinality(String),
      tech LowCardinality(String),
      category LowCardinality(String),
      date_week LowCardinality(String),
      PRIMARY KEY (date_week, org, name, tech)
    ) ENGINE = ReplacingMergeTree()
    ORDER BY (date_week, org, name, tech);
  `.execute(db);
}
