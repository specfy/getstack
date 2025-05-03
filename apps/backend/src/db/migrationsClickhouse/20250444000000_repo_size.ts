import { sql } from 'kysely';

import type { Database } from '../types.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    ALTER TABLE "repositories"
    ADD COLUMN "size" UInt64 DEFAULT 0;
  `.execute(db);
}
