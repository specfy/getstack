import { sql } from 'kysely';

import type { Database } from '../types.db.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE progress (
      date_week varchar(20) NOT NULL,
      progress timestamptz NOT NULL
    );
  `.execute(db);
}
