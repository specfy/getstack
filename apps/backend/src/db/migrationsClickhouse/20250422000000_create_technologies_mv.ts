import { sql } from 'kysely';

import type { Clickhouse } from '../types.clickhouse.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Clickhouse>): Promise<void> {
  await sql`
        CREATE TABLE technologies_weekly
    (
      date_week LowCardinality(String),
      category LowCardinality(String),
      tech LowCardinality(String),
      hits UInt64
    )
    ENGINE = SummingMergeTree
    ORDER BY (date_week, category, tech);
  `.execute(db);

  await sql`
    CREATE MATERIALIZED VIEW technologies_weekly_mv TO technologies_weekly AS
    SELECT date_week,
          tech,
          category,
          COUNT(tech) as hits
    FROM technologies
    GROUP BY (date_week, category,  tech);
  `.execute(db);
}
