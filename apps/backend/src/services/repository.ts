import { db } from '../db/kysely'
import type { RepositoriesTable } from '../db/kysely'

export interface CreateRepositoryInput {
  org: string
  name: string
}

export interface UpdateRepositoryInput {
  last_fetched_at?: Date
}

export class RepositoryService {
  async create(input: CreateRepositoryInput): Promise<RepositoriesTable> {
    return db
      .insertInto('repositories')
      .values({
        org: input.org,
        name: input.name,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async update(id: string, input: UpdateRepositoryInput): Promise<RepositoriesTable> {
    return db
      .updateTable('repositories')
      .set({
        ...input,
        updated_at: new Date(),
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async findById(id: string): Promise<RepositoriesTable | null> {
    return db
      .selectFrom('repositories')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
  }

  async findByOrgAndName(org: string, name: string): Promise<RepositoriesTable | null> {
    return db
      .selectFrom('repositories')
      .selectAll()
      .where('org', '=', org)
      .where('name', '=', name)
      .executeTakeFirst()
  }

  async list(): Promise<RepositoriesTable[]> {
    return db
      .selectFrom('repositories')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute()
  }
} 