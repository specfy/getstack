import { startOfISOWeek, subWeeks } from 'date-fns';

import { clickHouse, kyselyClickhouse } from '../db/client.js';
import { formatToYearWeek } from '../utils/date.js';

import type { ClickhouseRepositoryRow, LicenseInsert, LicenseRow } from '../db/types.clickhouse.js';
import type { RepositoryRow } from '../db/types.db.js';
import type { LicenseLeaderboard, LicenseTopN, LicenseWeeklyVolume } from '../types/endpoint.js';

export async function createLicenses(input: LicenseInsert[]): Promise<void> {
  const q = kyselyClickhouse.insertInto('licenses').values(input);
  await q.execute();
}

export async function getTopLicensesOverTime({
  weeks,
  currentWeek,
}: {
  weeks: number;
  currentWeek: string;
}): Promise<LicenseTopN[]> {
  const [year] = currentWeek.split('-').map(Number);
  const afterWeek = startOfISOWeek(subWeeks(new Date(year!, 0, 1), weeks));

  const res = await clickHouse.query({
    query: `WITH
    ranked AS (
        SELECT
            date_week,
            license,
            sum(hits) AS total_hits,
            row_number() OVER (PARTITION BY date_week ORDER BY sum(hits) DESC) AS position
        FROM licenses_weekly_mv
        WHERE date_week <= {currentWeek: String}
              AND date_week >= {afterWeek: String}
        GROUP BY date_week, license
    )

SELECT
    date_week,
    license,
    total_hits AS hits,
    position
FROM ranked
WHERE position <= 10
ORDER BY date_week, position`,
    query_params: { currentWeek, afterWeek: formatToYearWeek(afterWeek) },
  });

  const json = await res.json<LicenseTopN>();

  return json.data;
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
    toUInt32(sumIf(hits, date_week =  {currentWeek: String})) AS current_hits,
    toUInt32(sumIf(hits, date_week = {previousWeek: String})) AS previous_hits,
    toInt32(
      (
        coalesce(current_hits, 0) - coalesce(previous_hits, 0)
      )
    ) AS trend,
    round(
      (coalesce(current_hits, 0) * 100) / coalesce(previous_hits, 0) - 100,
      1
    ) AS percent_change
  FROM
    default.licenses_weekly_mv
  WHERE
    date_week IN ( {currentWeek: String}, {previousWeek: String})
  GROUP BY
    license
  ORDER BY current_hits DESC`,
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
}): Promise<ClickhouseRepositoryRow[]> {
  const res = await clickHouse.query({
    query: `SELECT
    r.id
FROM
    repositories2 AS r FINAL
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

  const json = await res.json<ClickhouseRepositoryRow>();

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
    repositories2 AS r FINAL
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
