import { sql } from 'kysely';

import type { Database } from '../types.db.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE "posts" (
      "id" int4 NOT NULL DEFAULT nextval('posts_id_seq'::regclass),
      "title" text NOT NULL,
      "content" text NOT NULL,
      "summary" text NOT NULL,
      "techs" jsonb NOT NULL,
      "categories" jsonb NOT NULL,
      "metadata" json NOT NULL,
      "created_at" timestamptz NOT NULL,
      "updated_at" timestamptz NOT NULL,
      PRIMARY KEY ("id"))
  `.execute(db);

  await sql`
    CREATE INDEX "idx_updated_at" ON "posts" USING BTREE ("updated_at" DESC NULLS LAST)
  `.execute(db);
}
