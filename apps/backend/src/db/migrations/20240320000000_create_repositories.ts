import { sql } from 'kysely';

import type { Database } from '../types';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE repositories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      stars int8 NOT NULL DEFAULT 0,
      url VARCHAR NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_fetched_at TIMESTAMP,
      CONSTRAINT repositories_org_name_unique UNIQUE (org, name)
    );
  `.execute(db);
}
