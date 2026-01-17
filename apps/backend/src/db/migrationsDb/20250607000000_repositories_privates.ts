import { sql } from 'kysely';

import type { Database } from '../types.db.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
     CREATE TABLE "repositories_analysis" (
      id UUID DEFAULT gen_random_uuid(),
      "repository_id" UUID NOT NULL,
      "analysis" json NOT NULL DEFAULT '{}',
      "last_manual_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY ("id")
    )
  `.execute(db);

  await sql`
    CREATE INDEX "idx_repositories_analysis_repository_id" ON "repositories_analysis" USING BTREE ("repository_id");
  `.execute(db);

  await sql`
    ALTER TABLE "repositories"
    ADD COLUMN "private" bool NOT NULL DEFAULT 'false';
  `.execute(db);
}
