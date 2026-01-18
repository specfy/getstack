import { startOfISOWeek, subWeeks } from 'date-fns';

import { clickHouse, kyselyClickhouse } from '../db/client.js';
import { formatToYearWeek } from '../utils/date.js';

import type {
  ClickhouseRepositoryRow,
  TechnologyInsert,
  TechnologyRow,
} from '../db/types.clickhouse.js';
import type { RepositoryRow } from '../db/types.db.js';
import type {
  RelatedTechnology,
  TechnologyByCategoryByWeekWithTrend,
  TechnologyTopN,
  TechnologyWeeklyVolume,
} from '../types/endpoint.js';

export async function createTechnologies(input: TechnologyInsert[]): Promise<void> {
  const q = kyselyClickhouse.insertInto('technologies').values(input);
  await q.execute();
}

export async function getTechnologiesByRepo(
  repo: RepositoryRow,
  currentWeek: string
): Promise<TechnologyRow[]> {
  const res = await clickHouse.query({
    query: `SELECT *
    FROM technologies
    WHERE org = {org: String} AND name = {name: String} AND date_week = {currentWeek: String}`,
    query_params: {
      org: repo.org,
      name: repo.name,
      currentWeek,
    },
  });

  const json = await res.json<TechnologyRow>();

  return json.data;
}

export async function getTopTechnologiesWithTrend({
  currentWeek,
  previousWeek,
}: {
  currentWeek: string;
  previousWeek: string;
}): Promise<TechnologyByCategoryByWeekWithTrend[]> {
  const res = await clickHouse.query({
    query: `WITH
    {currentWeek: String} AS current_week,
    {previousWeek: String} AS previous_week,

    base_data AS (
        SELECT
            category,
            tech,
            toUInt32(sumIf(hits, date_week = previous_week)) AS raw_previous_hits,
            toUInt32(sumIf(hits, date_week = current_week)) AS raw_current_hits
        FROM technologies_weekly_mv
        WHERE date_week IN (current_week, previous_week)
        GROUP BY category, tech
    ),

    ranked AS (
        SELECT
            category,
            tech,
            coalesce(raw_previous_hits, 0) AS previous_hits,
            coalesce(raw_current_hits, 0) AS current_hits,
            toInt32((coalesce(raw_current_hits, 0) - coalesce(raw_previous_hits, 0))) AS trend,
            round(((coalesce(raw_current_hits, 0) - coalesce(raw_previous_hits, 0)) / (coalesce(raw_previous_hits, 0))) * 100, 1) AS percent_change,
            row_number() OVER (PARTITION BY category ORDER BY coalesce(raw_current_hits, 0) DESC) AS rn
        FROM base_data
    )

SELECT
    category,
    tech,
    current_hits,
    previous_hits,
    trend,
    percent_change
FROM ranked
WHERE rn <= 5
ORDER BY category, current_hits DESC`,
    query_params: { currentWeek, previousWeek },
  });

  const json = await res.json<TechnologyByCategoryByWeekWithTrend>();

  return json.data;
}

export async function getTopTechnologiesWithTrendByCategory({
  category,
  currentWeek,
  previousWeek,
}: {
  category: string;
  currentWeek: string;
  previousWeek: string;
}): Promise<TechnologyByCategoryByWeekWithTrend[]> {
  const res = await clickHouse.query({
    query: `WITH
    {currentWeek: String} AS current_week,
    {previousWeek: String} AS previous_week,

    base_data AS (
        SELECT
            category,
            tech,
            toUInt32(sumIf(hits, date_week = current_week)) AS raw_current_hits,
            toUInt32(sumIf(hits, date_week = previous_week)) AS raw_previous_hits
        FROM default.technologies_weekly
        WHERE date_week IN (current_week, previous_week)
              AND category = {category: String}
        GROUP BY category, tech
    ),

    ranked AS (
        SELECT
            category,
            tech,
            coalesce(raw_current_hits, 0) AS current_hits,
            coalesce(raw_previous_hits, 0) AS previous_hits,
            toInt32((coalesce(raw_current_hits, 0) - coalesce(raw_previous_hits, 0))) AS trend,
            round((coalesce(raw_current_hits, 0) * 100) / coalesce(raw_previous_hits, 0) - 100, 1) AS percent_change,
            row_number() OVER (PARTITION BY category ORDER BY coalesce(raw_current_hits, 0) DESC) AS rn
        FROM base_data
    )

SELECT
    category,
    tech,
    current_hits,
    previous_hits,
    trend,
    percent_change
FROM ranked
ORDER BY category, current_hits DESC`,
    query_params: { category, currentWeek, previousWeek },
  });

  const json = await res.json<TechnologyByCategoryByWeekWithTrend>();

  return json.data;
}

export async function getTop10TechnologiesByCategoryPerWeek({
  category,
  currentWeek,
}: {
  category: string;
  currentWeek: string;
}): Promise<TechnologyByCategoryByWeekWithTrend[]> {
  const res = await clickHouse.query({
    query: `WITH
    ranked AS (
        SELECT
            category,
            tech,
            hits,
            row_number() OVER (PARTITION BY category ORDER BY hits DESC) AS position
        FROM default.technologies_weekly
        WHERE date_week = {currentWeek: String}
              AND category = {category: String}
    )

SELECT
    category,
    tech,
    hits,
    position
FROM ranked
WHERE position <= 10
ORDER BY position`,
    query_params: { category, currentWeek },
  });

  const json = await res.json<TechnologyByCategoryByWeekWithTrend>();

  return json.data;
}

export async function getTop10TechnologiesByCategoryForNWeeks({
  category,
  weeks,
  currentWeek,
}: {
  category: string;
  weeks: number;
  currentWeek: string;
}): Promise<TechnologyTopN[]> {
  const [year] = currentWeek.split('-').map(Number);
  const afterWeek = startOfISOWeek(subWeeks(new Date(year!, 0, 1), weeks));

  const res = await clickHouse.query({
    query: `WITH
    ranked AS (
        SELECT
            date_week,
            category,
            tech,
            sum(hits) AS total_hits,
            row_number() OVER (PARTITION BY date_week, category ORDER BY sum(hits) DESC) AS position
        FROM technologies_weekly_mv
        WHERE date_week <= {currentWeek: String}
              AND date_week >= {afterWeek: String}
              AND category = {category: String}
        GROUP BY date_week, category, tech
    )

SELECT
    date_week,
    tech,
    total_hits AS hits,
    position
FROM ranked
WHERE position <= 10
ORDER BY date_week, position`,
    query_params: { category, currentWeek, afterWeek: formatToYearWeek(afterWeek) },
  });

  const json = await res.json<TechnologyTopN>();

  return json.data;
}

export async function getTopRepositoriesForTechnology({
  tech,
  currentWeek,
}: {
  tech: string;
  currentWeek: string;
}): Promise<ClickhouseRepositoryRow[]> {
  const res = await clickHouse.query({
    query: `SELECT
    r.id
FROM
    repositories2 AS r FINAL
INNER JOIN
    technologies AS t
ON
    r.org = t.org AND r.name = t.name
WHERE
    t.tech = {tech: String} AND date_week = {currentWeek: String}
ORDER BY
    r.stars DESC
LIMIT 30;`,
    query_params: { tech, currentWeek },
  });

  const json = await res.json<ClickhouseRepositoryRow>();

  return json.data;
}

export async function getTechnologyVolumePerWeek({
  tech,
  currentWeek,
}: {
  tech: string;
  currentWeek: string;
}): Promise<TechnologyWeeklyVolume[]> {
  const res = await clickHouse.query({
    query: `WITH
      -- Get the date range for this technology
      date_bounds AS (
        SELECT
          min(date_week) AS min_week,
          {currentWeek: String} AS current_week
        FROM technologies_weekly_mv
        WHERE tech = {tech: String} AND date_week <= {currentWeek: String}
      ),

      -- Generate all weeks from min to current week
      all_weeks AS (
        SELECT DISTINCT date_week
        FROM technologies_weekly_mv
        WHERE date_week >= (SELECT min_week FROM date_bounds)
          AND date_week <= {currentWeek: String}
      ),

      -- Get actual data for this specific technology
      tech_data AS (
        SELECT
          date_week,
          SUM(hits) AS hits
        FROM technologies_weekly_mv
        WHERE tech = {tech: String} AND date_week <= {currentWeek: String}
        GROUP BY date_week
      )

    SELECT
      aw.date_week,
      coalesce(td.hits, 0) AS hits
    FROM all_weeks aw
    LEFT JOIN tech_data td ON aw.date_week = td.date_week
    ORDER BY aw.date_week`,
    query_params: { tech, currentWeek },
  });

  const json = await res.json<TechnologyWeeklyVolume>();

  return json.data;
}

export async function getTechnologyCumulatedStars({
  tech,
  currentWeek,
}: {
  tech: string;
  currentWeek: string;
}): Promise<number> {
  const res = await clickHouse.query({
    query: `SELECT
    SUM(stars) as stars
FROM
    repositories2 AS r FINAL
INNER JOIN
    technologies AS t
ON
    r.org = t.org AND r.name = t.name
WHERE
    t.tech = {tech: String} AND date_week = {currentWeek: String}`,
    query_params: { tech, currentWeek },
  });

  const json = await res.json<{ stars: string }>();

  return json.data.length > 0 ? Number.parseInt(json.data[0]!.stars, 10) : 0;
}

export async function getTopRelatedTechnology({
  tech,
  currentWeek,
}: {
  tech: string;
  currentWeek: string;
}): Promise<RelatedTechnology[]> {
  const res = await clickHouse.query({
    query: `WITH
	base_data AS (
		SELECT
			t2.tech as tech,
			COUNT(*) AS hits
		FROM
			technologies AS t1
			JOIN technologies AS t2 ON t1.org = t2.org
			AND t1.tech != t2.tech
		WHERE
			t1.tech = {tech: String} AND date_week = {currentWeek: String}
		GROUP BY
			t2.tech
	)
SELECT
	tech, hits
FROM
	base_data
ORDER BY
	hits DESC
LIMIT 20;`,
    query_params: { tech, currentWeek },
  });

  const json = await res.json<RelatedTechnology>();

  return json.data;
}
