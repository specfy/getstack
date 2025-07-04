import { sql } from 'kysely';

import type { Clickhouse } from '../types.clickhouse.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Clickhouse>): Promise<void> {
  await sql`
    ALTER TABLE "repositories"
    ADD COLUMN "forks" UInt32 DEFAULT 0,
    ADD COLUMN "repo_created_at" DateTime DEFAULT NOW();
  `.execute(db);
}
