import { sql } from 'kysely';

import type { Clickhouse } from '../types.clickhouse.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Clickhouse>): Promise<void> {
  await sql`
    ALTER TABLE "repositories"
    ADD COLUMN "last_analyzed_at" DateTime DEFAULT now();
  `.execute(db);
}
