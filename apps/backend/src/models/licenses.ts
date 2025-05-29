import { clickHouse, kyselyClickhouse } from '../db/client.js';

import type { LicenseInsert, LicenseRow, RepositoryRow } from '../db/types.js';

export async function createLicenses(input: LicenseInsert[]): Promise<void> {
  const q = kyselyClickhouse.insertInto('licenses').values(input);
  await q.execute();
}

export async function getLicensesByRepo(
  repo: RepositoryRow,
  currentWeek: string
): Promise<LicenseRow[]> {
  const res = await clickHouse.query({
    query: `SELECT *
    FROM licenses
    WHERE org = {org: String} AND name = {name: String} AND date_week = {currentWeek: String}`,
    query_params: {
      org: repo.org,
      name: repo.name,
      currentWeek,
    },
  });

  const json = await res.json<LicenseRow>();

  return json.data;
}
