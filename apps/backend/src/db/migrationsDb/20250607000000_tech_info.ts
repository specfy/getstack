import { sql } from 'kysely';

import type { Database } from '../types.db.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE "tech_info" (
        "key" varchar(100) NOT NULL,
        "long_description" text,
        "website" varchar(500),
        "github" varchar(200),
        PRIMARY KEY ("key")
      );
  `.execute(db);
}
