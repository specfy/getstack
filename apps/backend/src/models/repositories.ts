/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { clickHouse, db } from '../db/client.js';
import { formatToClickhouseDatetime } from '../utils/date.js';

import type { RepositoryInsert, RepositoryRow, RepositoryUpdate } from '../db/types.js';

export async function createRepository(input: RepositoryInsert): Promise<RepositoryRow> {
  return await db.insertInto('repositories').values(input).returningAll().executeTakeFirstOrThrow();
}

export async function updateRepository(id: string, input: RepositoryUpdate): Promise<void> {
  await db
    .updateTable('repositories')
    .set({
      ...input,
      updated_at: formatToClickhouseDatetime(new Date()),
    })
    .where('id', '=', id)
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
  const res = await clickHouse.query({
    query: `SELECT * FROM repositories WHERE last_fetched_at < '${beforeDate.toISOString().split('T')[0]}' AND errored = 0 LIMIT 1`,
  });
  const json = await res.json();
  return json.data[0] as unknown as RepositoryRow | undefined;
  // const q = sql`SELECT * FROM repositories`;
  // const q = db
  //   .selectFrom('repositories')
  //   .selectAll()
  //   .where('last_fetched_at', '<', beforeDate)
  //   .limit(1);

  // const res = await q.execute(db);
  // return res.rows[0] === undefined ? undefined : (res.rows[0] as unknown as RepositoryRow);
}

export async function upsertRepository(repo: RepositoryInsert): Promise<void> {
  const row = await db
    .selectFrom('repositories')
    .selectAll()
    .where('org', '=', repo.org)
    .where('name', '=', repo.name)
    .executeTakeFirst();

  if (row) {
    await clickHouse.exec({
      query: `ALTER TABLE "repositories"
      UPDATE
        "stars" = ${repo.stars},
        updated_at = '${formatToClickhouseDatetime(new Date())}'
        WHERE "org" = '${repo.org}' AND "name" = '${repo.name}'`,
    });
    // const q = db.updateTable('repositories').set({
    //   stars: repo.stars,
    //   updated_at: formatToClickhouseDatetime(new Date()),
    // });
    // console.log(q.compile());

    // await q.execute();
    return;
  }

  await db.insertInto('repositories').values(repo).execute();
}
