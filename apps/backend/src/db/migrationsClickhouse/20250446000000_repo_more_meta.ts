import { sql } from 'kysely';

import type { Database } from '../types.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
        ALTER TABLE "default"."repositories"
    ADD COLUMN "avatar_url" String,
    ADD COLUMN "homepage_url" String,
    ADD COLUMN "description" String;
  `.execute(db);
}
