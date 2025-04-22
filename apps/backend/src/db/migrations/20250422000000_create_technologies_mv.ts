import { sql } from 'kysely';

import type { Database } from '../types';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
        CREATE TABLE technologies_weekly
    (
      date_week Date,
      category LowCardinality(String),
      tech LowCardinality(String),
      hits UInt32
    )
    ENGINE = SummingMergeTree
    ORDER BY (date_week, category, tech);
  `.execute(db);

  await sql`
    CREATE MATERIALIZED VIEW technologies_weekly_mv TO technologies_weekly AS
    SELECT toStartOfDay(date_week)::Date as date_week,
          tech,
          category,
          COUNT(tech) as hits
    FROM technologies
    GROUP BY (date_week, category,  tech);
  `.execute(db);
}
