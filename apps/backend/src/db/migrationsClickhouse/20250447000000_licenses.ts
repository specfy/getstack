import { sql } from 'kysely';

import type { Clickhouse } from '../types.clickhouse.js';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<Clickhouse>): Promise<void> {
  await sql`
    CREATE TABLE licenses (
      org LowCardinality(String),
      name LowCardinality(String),
      license LowCardinality(String),
      date_week LowCardinality(String),
      PRIMARY KEY (date_week, org, name, license)
    ) ENGINE = ReplacingMergeTree()
    ORDER BY (date_week, org, name, license);
  `.execute(db);

  await sql`
    CREATE TABLE licenses_weekly
        (
          date_week LowCardinality(String),
          license LowCardinality(String),
          hits UInt64
        )
        ENGINE = SummingMergeTree
        ORDER BY (date_week, license);
  `.execute(db);

  await sql`
    CREATE MATERIALIZED VIEW licenses_weekly_mv TO licenses_weekly AS
    SELECT
    	date_week,
    	license,
    	COUNT(license) AS hits
    FROM
    	licenses
    GROUP BY
    	(date_week, license);
  `.execute(db);
}
