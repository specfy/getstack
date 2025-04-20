import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

export interface Database {
  repositories: RepositoriesTable
}

export interface RepositoriesTable {
  id: string
  org: string
  name: string
  created_at: Date
  updated_at: Date
  last_fetched_at: Date | null
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
})

export const db = new Kysely<Database>({
  dialect,
}) 