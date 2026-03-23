import { sql } from 'kysely';

import type { Database } from '../types.db.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE "category_trends" (
      "id" text NOT NULL,
      "slug" text NOT NULL,
      "category" text NOT NULL,
      "introduction" text NOT NULL,
      PRIMARY KEY ("id"),
      UNIQUE ("slug")
    )
  `.execute(db);

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS category_trends_category_unique ON category_trends (category)
  `.execute(db);
}
