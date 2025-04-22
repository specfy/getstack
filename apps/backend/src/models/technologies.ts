import { clickHouse, db } from '../db/client.js';
import { formatToYearWeek } from '../utils/date.js';

import type { TechnologyInsert, TechnologyWeeklyRow } from '../db/types.js';

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
