import { db } from '../db/kysely';

import type { RepositoryInsert } from '../db';
import type { RepositoriesTable } from '../db/kysely';

export interface UpdateRepositoryInput {
  last_fetched_at?: Date;
}

export class RepositoryService {
  async create(input: RepositoryInsert): Promise<RepositoriesTable> {
    return db
      .insertInto('repositories')
      .values({
        org: input.org,
        name: input.name,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async update(id: string, input: UpdateRepositoryInput): Promise<RepositoriesTable> {
    return await db
      .updateTable('repositories')
      .set({
        ...input,
        updated_at: new Date(),
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findById(id: string): Promise<RepositoriesTable | undefined> {
    return await db.selectFrom('repositories').selectAll().where('id', '=', id).executeTakeFirst();
  }

  async findByOrgAndName(org: string, name: string): Promise<RepositoriesTable | undefined> {
    return await db
      .selectFrom('repositories')
      .selectAll()
      .where('org', '=', org)
      .where('name', '=', name)
      .executeTakeFirst();
  }

  async list(): Promise<RepositoriesTable[]> {
    return await db.selectFrom('repositories').selectAll().orderBy('created_at', 'desc').execute();
  }
}
