import { sql } from 'kysely';

import type { Database } from '../types.db.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE tasks (
      repository_id UUID NOT NULL,
      created_at timestamptz NOT NULL DEFAULT NOW(),
      commit_hash VARCHAR(156) NOT NULL,
      status VARCHAR(30) NOT NULL,
      reason VARCHAR
    );
  `.execute(db);
}
