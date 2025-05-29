import { clickHouse, kyselyClickhouse } from '../db/client.js';

import type { LicenseInsert, LicenseRow, RepositoryRow } from '../db/types.js';
import type { LicenseWeeklyVolume } from '../types/endpoint.js';

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

export async function getTopRepositoriesForLicense({
  license,
  currentWeek,
}: {
  license: string;
  currentWeek: string;
}): Promise<RepositoryRow[]> {
  const res = await clickHouse.query({
    query: `SELECT
    r.*
FROM
    repositories AS r
INNER JOIN
    licenses AS l
ON
    r.org = l.org AND r.name = l.name
WHERE
    l.license = {license: String} AND date_week = {currentWeek: String}
ORDER BY
    r.stars DESC
LIMIT 30;`,
    query_params: { license, currentWeek },
  });

  const json = await res.json<RepositoryRow>();

  return json.data;
}

export async function getLicenseVolumePerWeek({
  license,
  currentWeek,
}: {
  license: string;
  currentWeek: string;
}): Promise<LicenseWeeklyVolume[]> {
  const res = await clickHouse.query({
    query: `SELECT
      date_week,
      SUM(hits) AS hits
    FROM licenses_weekly_mv
    WHERE license = {license: String} AND date_week <= {currentWeek: String}
    GROUP BY date_week
    ORDER BY date_week`,
    query_params: { license, currentWeek },
  });

  const json = await res.json<LicenseWeeklyVolume>();

  return json.data;
}

export async function getLicenseCumulatedStars({
  license,
  currentWeek,
}: {
  license: string;
  currentWeek: string;
}): Promise<number> {
  const res = await clickHouse.query({
    query: `SELECT
    SUM(stars) as stars
FROM
    repositories AS r
INNER JOIN
    licenses AS l
ON
    r.org = l.org AND r.name = l.name
WHERE
    l.license = {license: String} AND date_week = {currentWeek: String}`,
    query_params: { license, currentWeek },
  });

  const json = await res.json<{ stars: string }>();

  return json.data.length > 0 ? Number.parseInt(json.data[0]!.stars, 10) : 0;
}
