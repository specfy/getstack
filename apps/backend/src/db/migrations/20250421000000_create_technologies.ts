import { sql } from 'kysely';

import type { Database } from '../types';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE technologies (
      id UUID DEFAULT generateUUIDv7(),
      org LowCardinality(String) NOT NULL,
      name LowCardinality(String) NOT NULL,
      tech LowCardinality(String) NOT NULL,
      date_week Date32 NOT NULL,
      PRIMARY KEY (date_week, org, name)
    ) ENGINE = MergeTree()
    ORDER BY (date_week, org, name);
  `.execute(db);
}
