import { db } from '../db/client.js';

import type { RepositoryInsert, RepositoryRow, RepositoryUpdate } from '../db/types.js';

export async function createRepository(input: RepositoryInsert): Promise<RepositoryRow> {
  return await db.insertInto('repositories').values(input).returningAll().executeTakeFirstOrThrow();
}

export async function updateRepository(
  id: string,
  input: RepositoryUpdate
): Promise<RepositoryRow> {
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

export async function findRepositoryById(id: string): Promise<RepositoryRow | undefined> {
  return await db.selectFrom('repositories').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function findRepositoryByOrgAndName(
  org: string,
  name: string
): Promise<RepositoryRow | undefined> {
  return await db
    .selectFrom('repositories')
    .selectAll()
    .where('org', '=', org)
    .where('name', '=', name)
    .executeTakeFirst();
}

export async function getRepositoryToAnalyze({
  beforeDate,
}: {
  beforeDate: Date;
}): Promise<RepositoryRow | undefined> {
  const q = db
    .selectFrom('repositories')
    .selectAll()
    .where((eb) =>
      eb.or([eb('last_fetched_at', 'is', null), eb('last_fetched_at', '<', beforeDate)])
    )
    .limit(1);

  return await q.executeTakeFirst();
}

export async function upsertRepository(repositories: RepositoryInsert): Promise<void> {
  await batchUpsert([repositories]);
}

export async function batchUpsert(repositories: RepositoryInsert[]): Promise<void> {
  const query = db
    .insertInto('repositories')
    .values(repositories)
    .onConflict((oc) =>
      oc.columns(['org', 'name']).doUpdateSet((eb) => {
        return {
          stars: eb.ref('excluded.stars'),
          url: eb.ref('excluded.url'),
          updated_at: new Date(),
        };
      })
    );

  await query.execute();
}
