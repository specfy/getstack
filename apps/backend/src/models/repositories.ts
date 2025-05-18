import { clickHouse, kyselyClickhouse } from '../db/client.js';
import { formatToClickhouseDatetime } from '../utils/date.js';
import { envs } from '../utils/env.js';

import type { RepositoryInsert, RepositoryRow, RepositoryUpdate } from '../db/types.js';

export const ANALYZE_MIN_STARS = envs.ANALYZE_MIN_STARS;

export async function createRepository(input: RepositoryInsert): Promise<RepositoryRow> {
  return await kyselyClickhouse
    .insertInto('repositories')
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getRepository(repo: {
  org: string;
  name: string;
}): Promise<RepositoryRow | undefined> {
  const row = await kyselyClickhouse
    .selectFrom('repositories')
    .selectAll()
    .where('org', '=', repo.org)
    .where('name', '=', repo.name)
    .executeTakeFirst();

  return row;
}

export async function updateRepository(id: string, input: RepositoryUpdate): Promise<void> {
  await kyselyClickhouse
    .updateTable('repositories')
    .set({
      ...input,
      updated_at: formatToClickhouseDatetime(new Date()),
    })
    .where('id', '=', id)
    .execute();
}

export async function findRepositoryById(id: string): Promise<RepositoryRow | undefined> {
  return await kyselyClickhouse
    .selectFrom('repositories')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
}

export async function findRepositoryByOrgAndName(
  org: string,
  name: string
): Promise<RepositoryRow | undefined> {
  return await kyselyClickhouse
    .selectFrom('repositories')
    .selectAll()
    .where('org', '=', org)
    .where('name', '=', name)
    .executeTakeFirst();
}

export async function searchRepository(search: string): Promise<RepositoryRow[]> {
  const res = await clickHouse.query({
    query: `SELECT * FROM repositories
    WHERE (org ILIKE {search: String} OR name ILIKE {search: String})
      AND ignored = 0
      AND stars >= ${ANALYZE_MIN_STARS}
      ORDER BY stars DESC
      LIMIT 10`,
    format: 'JSON',
    query_params: { search: `%${search}%` },
  });
  const json = await res.json<RepositoryRow>();
  return json.data;
}

export async function getRepositoryToAnalyze({
  beforeDate,
}: {
  beforeDate: Date;
}): Promise<RepositoryRow | undefined> {
  const res = await clickHouse.query({
    query: `SELECT * FROM repositories
    WHERE last_fetched_at < '${beforeDate.toISOString().split('T')[0]}'
      AND errored = 0
      AND ignored = 0
      AND stars >= ${ANALYZE_MIN_STARS}
      LIMIT 1`,
    format: 'JSON',
  });
  const json = await res.json();
  return json.data[0] as unknown as RepositoryRow | undefined;
}

export async function upsertRepository(repo: RepositoryInsert): Promise<void> {
  const row = await getRepository(repo);

  if (row) {
    await kyselyClickhouse
      .updateTable('repositories')
      .set({
        avatar_url: repo.avatar_url,
        branch: repo.branch,
        stars: repo.stars,
        size: repo.size,
        // Keep manual otherwise update (in case conditions has changed)
        ignored: row.ignored === 1 && row.ignored_reason === 'manual' ? 1 : repo.ignored,
        description: repo.description,
        homepage_url: repo.homepage_url,
        updated_at: formatToClickhouseDatetime(new Date()),
      })
      .where('org', '=', repo.org)
      .where('name', '=', repo.name)
      .execute();

    return;
  }

  await kyselyClickhouse.insertInto('repositories').values(repo).execute();
}
