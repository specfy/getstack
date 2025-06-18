import { sql } from 'kysely';

import type { Database } from '../types.db.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE UNLOGGED TABLE cache (
      key VARCHAR(255) PRIMARY KEY,
      value JSON NOT NULL,
      expires_at TIMESTAMP NOT NULL
    );
  `.execute(db);
}
