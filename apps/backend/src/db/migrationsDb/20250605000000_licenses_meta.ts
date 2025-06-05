import { sql } from 'kysely';

import type { Database } from '../types.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    ALTER TABLE "licenses_info" ALTER COLUMN "key" SET NOT NULL;
  `.execute(db);

  await sql`
    ALTER TABLE "licenses_info" ALTER COLUMN "description" SET NOT NULL;
  `.execute(db);

  await sql`
    ALTER TABLE "licenses_info"
    ADD COLUMN "full_name" text NOT NULL,
    ADD COLUMN "permissions" json NOT NULL,
    ADD COLUMN "limitations" json NOT NULL,
    ADD COLUMN "conditions" json NOT NULL;
  `.execute(db);
}
