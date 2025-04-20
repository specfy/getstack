import { db } from '../db/kysely';

import type { RepositoryInsert, RepositoryRow, RepositoryUpdate } from '../db';
import type { RepositoriesTable } from '../db/kysely';

export async function createRepository(input: RepositoryInsert): Promise<RepositoriesTable> {
  return db
    .insertInto('repositories')
    .values({
      id: input.id,
      org: input.org,
      name: input.name,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateRepository(
  id: string,
  input: RepositoryUpdate
): Promise<RepositoriesTable> {
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

export async function findRepositoryById(id: string): Promise<RepositoriesTable | undefined> {
  return await db.selectFrom('repositories').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function findRepositoryByOrgAndName(
  org: string,
  name: string
): Promise<RepositoriesTable | undefined> {
  return await db
    .selectFrom('repositories')
    .selectAll()
    .where('org', '=', org)
    .where('name', '=', name)
    .executeTakeFirst();
}

export async function listRepositories(): Promise<RepositoriesTable[]> {
  return await db.selectFrom('repositories').selectAll().orderBy('created_at', 'desc').execute();
}

export async function batchUpsert(repositories: RepositoryRow[]): Promise<void> {
  const query = db
    .insertInto('repositories')
    .values(repositories)
    .onConflict((oc) =>
      oc.columns(['org', 'name']).doUpdateSet({
        stars: (eb) => eb.ref('excluded.stars'),
        url: (eb) => eb.ref('excluded.url'),
        updated_at: new Date(),
      })
    );

  await query.execute();
}
