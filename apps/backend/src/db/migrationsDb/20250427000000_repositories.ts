import { sql } from 'kysely';

import type { Database } from '../types.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    CREATE TABLE repositories (
        id UUID DEFAULT gen_random_uuid(),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        github_id TEXT,
        org TEXT,
        name TEXT,
        branch TEXT DEFAULT 'main',
        stars BIGINT DEFAULT 0,
        url TEXT,
        ignored SMALLINT DEFAULT 0,
        last_fetched_at TIMESTAMP,
        errored SMALLINT DEFAULT 0,
        ignored_reason TEXT,
        size BIGINT DEFAULT 0,
        last_analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        avatar_url TEXT,
        homepage_url TEXT,
        description TEXT,
        forks INTEGER DEFAULT 0,
        repo_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );
  `.execute(db);

  await sql`
    CREATE UNIQUE INDEX "idx_repositories_unique" ON "repositories" USING BTREE ("org","name");
  `.execute(db);

  await sql`
    CREATE INDEX "idx_repositories_analyze" ON "repositories" USING BTREE ("last_fetched_at" ASC NULLS FIRST,"stars") WHERE ignored = 0 AND errored = 0;
  `.execute(db);
}
