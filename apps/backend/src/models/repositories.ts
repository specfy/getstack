import { clickHouse, db } from '../db/client.js';
import { formatToClickhouseDatetime } from '../utils/date.js';
import { envs } from '../utils/env.js';

import type {
  ClickhouseRepositoryInsert,
  RepositoryInsert,
  RepositoryRow,
  RepositoryUpdate,
  TX,
} from '../db/types.js';

export const ANALYZE_MIN_STARS = envs.ANALYZE_MIN_STARS;

export async function createRepository(input: RepositoryInsert): Promise<RepositoryRow> {
  return await db.insertInto('repositories').values(input).returningAll().executeTakeFirstOrThrow();
}

export async function getRepository(repo: {
  org: string;
  name: string;
}): Promise<RepositoryRow | undefined> {
  const row = await db
    .selectFrom('repositories')
    .selectAll()
    .where('org', '=', repo.org)
    .where('name', '=', repo.name)
    .executeTakeFirst();

  return row;
}

export async function getRepositories({ ids }: { ids: string[] }): Promise<RepositoryRow[]> {
  return await db.selectFrom('repositories').selectAll().where('github_id', 'in', ids).execute();
}

export async function updateRepository(id: string, input: RepositoryUpdate): Promise<void> {
  await db
    .updateTable('repositories')
    .set({
      ...input,
      updated_at: formatToClickhouseDatetime(new Date()),
    })
    .where('id', '=', id)
    .execute();
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
  trx,
  beforeDate,
}: {
  trx: TX;
  beforeDate: Date;
}): Promise<RepositoryRow | undefined> {
  return await trx
    .selectFrom('repositories')
    .selectAll()
    .where('last_fetched_at', '<', beforeDate)
    .where('errored', '=', 0)
    .where('ignored', '=', 0)
    .where('stars', '>=', ANALYZE_MIN_STARS)
    .orderBy('stars', 'desc')
    .limit(1)
    .forUpdate()
    .skipLocked()
    .executeTakeFirst();
}

export async function upsertRepository(repo: RepositoryInsert): Promise<void> {
  const row = await getRepository(repo);

  if (row) {
    await db
      .updateTable('repositories')
      .set({
        avatar_url: repo.avatar_url,
        branch: repo.branch,
        stars: repo.stars,
        size: repo.size,
        forks: repo.forks,
        // Keep manual otherwise update (in case conditions has changed)
        ignored: row.ignored === 1 && row.ignored_reason === 'manual' ? 1 : repo.ignored,
        description: repo.description,
        homepage_url: repo.homepage_url,
        repo_created_at: repo.repo_created_at,
        updated_at: formatToClickhouseDatetime(new Date()),
      })
      .where('org', '=', repo.org)
      .where('name', '=', repo.name)
      .execute();

    return;
  }

  await db.insertInto('repositories').values(repo).execute();
}

export async function listAllRepositories(): Promise<RepositoryRow[]> {
  const res = await db.selectFrom('repositories').selectAll().execute();
  return res;
}

export async function updateClickhouseRepository(repo: ClickhouseRepositoryInsert): Promise<void> {
  await clickHouse.insert({
    table: 'repositories2',
    values: [
      {
        org: repo.org,
        name: repo.name,
        stars: repo.stars,
      },
    ],
    format: 'JSONEachRow',
  });
}
