import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export interface Database {
  repositories: RepositoriesTable;
}

export interface RepositoriesTable {
  id: string;
  org: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  last_fetched_at: Date | null;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env['DATABASE_URL'],
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
