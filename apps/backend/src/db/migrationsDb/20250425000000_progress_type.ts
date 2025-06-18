import { sql } from 'kysely';

import type { Database } from '../types.db.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    ALTER TABLE "progress"
    ADD COLUMN "type" varchar(25),
    ADD COLUMN "done" bool NOT NULL DEFAULT 'false';
  `.execute(db);
}
