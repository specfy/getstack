import { sql } from 'kysely';

import type { Database } from '../types.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE "licenses_info" (
        "id" serial,
        "key" varchar(50),
        "description" text,
        PRIMARY KEY ("id")
      );
  `.execute(db);

  await sql`
    CREATE UNIQUE INDEX "idx_licenses_key"
      ON "licenses_info"
      USING BTREE ("key");
  `.execute(db);
}
