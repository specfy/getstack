import { clickHouse, db } from '../db/client.js';
import { formatToYearWeek } from '../utils/date.js';

import type { TechnologyInsert, TechnologyWeeklyRow } from '../db/types.js';
import type { TechnologyByCategoryByWeekWithTrend } from '../types/endpoint.js';

export async function createTechnologies(input: TechnologyInsert[]): Promise<void> {
  const q = db.insertInto('technologies').values(input);
  await q.execute();
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
  // console.log(res);

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
            round(((coalesce(raw_current_hits, 0) - coalesce(raw_previous_hits, 0)) / (coalesce(raw_previous_hits, 0) + 1)) * 100) AS percent_change,
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
