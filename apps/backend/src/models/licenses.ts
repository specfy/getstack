import { clickHouse, kyselyClickhouse } from '../db/client.js';

import type { LicenseInsert, LicenseRow, RepositoryRow } from '../db/types.js';
import type { LicenseLeaderboard, LicenseWeeklyVolume } from '../types/endpoint.js';

export async function createLicenses(input: LicenseInsert[]): Promise<void> {
  const q = kyselyClickhouse.insertInto('licenses').values(input);
  await q.execute();
}

export async function getLicensesLeaderboard({
  currentWeek,
  previousWeek,
}: {
  currentWeek: string;
  previousWeek: string;
}): Promise<LicenseLeaderboard[]> {
  const res = await clickHouse.query({
    query: `SELECT
    license,
    toUInt32(sumIf(hits, date_week =  {currentWeek: String})) AS raw_current_hits,
    toUInt32(sumIf(hits, date_week = {previousWeek: String})) AS raw_previous_hits,
    toInt32(
      (
        coalesce(raw_current_hits, 0) - coalesce(raw_previous_hits, 0)
      )
    ) AS trend,
    round(
      (coalesce(raw_current_hits, 0) * 100) / coalesce(raw_previous_hits, 0) - 100,
      1
    ) AS percent_change
  FROM
    default.licenses_weekly_mv
  WHERE
    date_week IN ( {currentWeek: String}, {previousWeek: String})
  GROUP BY
    license
  ORDER BY raw_current_hits DESC`,
    query_params: { currentWeek, previousWeek },
  });

  const json = await res.json<LicenseLeaderboard>();

  return json.data;
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
