import { clickHouse, kyselyClickhouse } from '../db/client.js';
import { formatToYearWeek } from '../utils/date.js';

import type {
  RepositoryRow,
  TechnologyInsert,
  TechnologyRow,
  TechnologyWeeklyRow,
} from '../db/types.js';
import type {
  RelatedTechnology,
  RelatedTechnologyByCategory,
  TechnologyByCategoryByWeekWithTrend,
  TechnologyTopN,
  TechnologyWeeklyVolume,
} from '../types/endpoint.js';

export async function createTechnologies(input: TechnologyInsert[]): Promise<void> {
  const q = kyselyClickhouse.insertInto('technologies').values(input);
  await q.execute();
}

export async function getTechnologiesByRepo(repo: RepositoryRow): Promise<TechnologyRow[]> {
  const res = await clickHouse.query({
    query: `WITH latest_week AS (
      SELECT MAX(date_week) AS max_week
      FROM technologies
      WHERE org = {org: String} AND name = {name: String}
    )
    SELECT *
    FROM technologies
    WHERE org = {org: String} AND name = {name: String} AND date_week = (SELECT max_week FROM latest_week)`,
    query_params: {
      org: repo.org,
      name: repo.name,
    },
  });

  const json = await res.json<TechnologyRow>();

  return json.data;
}

export async function getTopTechnologies(): Promise<TechnologyWeeklyRow[]> {
  const dateWeek = formatToYearWeek(new Date());

  const res = await clickHouse.query({
    query: `WITH ranked AS (
    SELECT
        date_week,
        category,
        tech,
        hits,
        row_number() OVER (PARTITION BY category ORDER BY hits DESC) AS rn
    FROM technologies_weekly_mv
    FINAL
    WHERE date_week = '${dateWeek}'
)
SELECT
    date_week,
    category,
    tech,
    hits
FROM ranked
WHERE rn <= 5`,
  });

  const json = await res.json<TechnologyWeeklyRow>();

  return json.data;
}

export async function getTopTechnologiesWithTrend(): Promise<
  TechnologyByCategoryByWeekWithTrend[]
> {
  const res = await clickHouse.query({
    query: `WITH
    formatDateTime(today(), '%G-%V') AS current_week,
    formatDateTime(today() - INTERVAL 7 DAY, '%G-%V') AS previous_week,

    base_data AS (
        SELECT
            category,
            tech,
            toUInt32(sumIf(hits, date_week = current_week)) AS raw_current_hits,
            toUInt32(sumIf(hits, date_week = previous_week)) AS raw_previous_hits
        FROM default.technologies_weekly
        WHERE date_week IN (current_week, previous_week)
        GROUP BY category, tech
    ),

    ranked AS (
        SELECT
            category,
            tech,
            coalesce(raw_current_hits, 0) AS current_hits,
            coalesce(raw_previous_hits, 0) AS previous_hits,
            toUInt32((coalesce(raw_current_hits, 0) - coalesce(raw_previous_hits, 0))) AS trend,
            round(((coalesce(raw_current_hits, 0) - coalesce(raw_previous_hits, 0)) / (coalesce(raw_previous_hits, 0) + 1)) * 100, 1) AS percent_change,
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
  });

  const json = await res.json<TechnologyByCategoryByWeekWithTrend>();

  return json.data;
}

export async function getTopTechnologiesWithTrendByCategory(
  category: string
): Promise<TechnologyByCategoryByWeekWithTrend[]> {
  const res = await clickHouse.query({
    query: `WITH
    formatDateTime(today(), '%G-%V') AS current_week,
    formatDateTime(today() - INTERVAL 7 DAY, '%G-%V') AS previous_week,

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
    query_params: { category },
  });

  const json = await res.json<TechnologyByCategoryByWeekWithTrend>();

  return json.data;
}

export async function getTop10TechnologiesByCategoryPerWeek(
  category: string
): Promise<TechnologyByCategoryByWeekWithTrend[]> {
  const res = await clickHouse.query({
    query: `WITH
    formatDateTime(today(), '%G-%V') AS current_week,

    ranked AS (
        SELECT
            category,
            tech,
            hits,
            row_number() OVER (PARTITION BY category ORDER BY hits DESC) AS position
        FROM default.technologies_weekly
        WHERE date_week = current_week
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
    query_params: { category },
  });

  const json = await res.json<TechnologyByCategoryByWeekWithTrend>();

  return json.data;
}

export async function getTop10TechnologiesByCategoryForNWeeks(
  category: string,
  weeks: number
): Promise<TechnologyTopN[]> {
  const after = new Date();
  after.setDate(after.getDate() - weeks * 7);

  const res = await clickHouse.query({
    query: `WITH
    ranked AS (
        SELECT
            date_week,
            category,
            tech,
            sum(hits) AS total_hits,
            row_number() OVER (PARTITION BY date_week, category ORDER BY sum(hits) DESC) AS position
        FROM default.technologies_weekly
        WHERE date_week >= {week: String}
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
    query_params: { category, week: formatToYearWeek(after) },
  });

  const json = await res.json<TechnologyTopN>();

  return json.data;
}

export async function getTopRepositoriesForTechnology(tech: string): Promise<RepositoryRow[]> {
  const dateWeek = formatToYearWeek(new Date());

  const res = await clickHouse.query({
    query: `SELECT
    r.*
FROM
    repositories AS r
INNER JOIN
    technologies AS t
ON
    r.org = t.org AND r.name = t.name
WHERE
    t.tech = {tech: String} AND date_week = {week: String}
ORDER BY
    r.stars DESC
LIMIT 30;`,
    query_params: { tech, week: dateWeek },
  });

  const json = await res.json<RepositoryRow>();

  return json.data;
}

export async function getTechnologyVolumePerWeek(tech: string): Promise<TechnologyWeeklyVolume[]> {
  const res = await clickHouse.query({
    query: `SELECT
      date_week,
      SUM(hits) AS hits
    FROM technologies_weekly_mv
    WHERE tech = {tech: String}
    GROUP BY date_week
    ORDER BY date_week`,
    query_params: { tech },
  });

  const json = await res.json<TechnologyWeeklyVolume>();

  return json.data;
}

export async function getTechnologyCumulatedStars(tech: string): Promise<number> {
  const dateWeek = formatToYearWeek(new Date());
  const res = await clickHouse.query({
    query: `SELECT
    SUM(stars) as stars
FROM
    repositories AS r
INNER JOIN
    technologies AS t
ON
    r.org = t.org AND r.name = t.name
WHERE
    t.tech = {tech: String} AND date_week = {week: String}`,
    query_params: { tech, week: dateWeek },
  });

  const json = await res.json<{ stars: string }>();

  return json.data.length > 0 ? Number.parseInt(json.data[0]!.stars, 10) : 0;
}

export async function getTopRelatedTechnologyByCategory(
  tech: string
): Promise<RelatedTechnologyByCategory[]> {
  const dateWeek = formatToYearWeek(new Date());
  const res = await clickHouse.query({
    query: `WITH
	base_data AS (
		SELECT
			t2.tech as tech,
			t2.category as category,
			COUNT(*) AS hits
		FROM
			technologies AS t1
			JOIN technologies AS t2 ON t1.org = t2.org
			AND t1.tech != t2.tech
		WHERE
			t1.tech = {tech: String} AND date_week = {week: String}
		GROUP BY
			t2.category, t2.tech
	),
	ranked AS (
		SELECT
			tech,
			category,
			hits,
			row_number() OVER (
				PARTITION BY
					category
				ORDER BY
					hits DESC
			) AS rn
		FROM
			base_data
	)
SELECT
	category,
	tech,
	hits
FROM
	ranked
WHERE
	rn <= 3
ORDER BY
	category,
	hits DESC;`,
    query_params: { tech, week: dateWeek },
  });

  const json = await res.json<RelatedTechnologyByCategory>();

  return json.data;
}

export async function getTopRelatedTechnology(tech: string): Promise<RelatedTechnology[]> {
  const dateWeek = formatToYearWeek(new Date());
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
			t1.tech = {tech: String} AND date_week = {week: String}
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
    query_params: { tech, week: dateWeek },
  });

  const json = await res.json<RelatedTechnology>();

  return json.data;
}
