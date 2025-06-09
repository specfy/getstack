# DB

## Postgres

```sql
-- Ignore one
ALTER TABLE repositories UPDATE ignored = 1, ignored_reason = 'manual_remove' WHERE url = 'https://github.com/OneLoneCoder/Javidx9';


-- Check progress
SELECT count(1) from repositories where stars > 1000 and ignored = 0 and last_analyzed_at > '2025-06-01 00:00:00';

-- Check progress
SELECT * from repositories where last_fetched_at < '2025-05-05 00:00:00';

-- Get one
SELECT * FROM repositories WHERE org = 'ApiGen' and name='ApiGen';

SELECT * FROM repositories WHERE url = 'https://github.com/wususu/effective-resourses';
```

## Clickhouse

```sql
-- Repo that gained a tech
SELECT org, name
FROM default.technologies
WHERE date_week = '2025-22' AND tech = 'aws.glue'
  AND (org, name) NOT IN (
    SELECT DISTINCT org, name
    FROM default.technologies
    WHERE date_week = '2025-21' AND tech = 'aws.glue'
);
```

```sql
-- Repo that lost a tech
SELECT DISTINCT org,name
FROM default.technologies
WHERE date_week = '2025-21'
  AND (org, name) NOT IN (
    SELECT DISTINCT org, name
    FROM default.technologies
    WHERE date_week = '2025-22'
);
```

```sql
-- Repo without tech
WITH tech_info AS (
    SELECT
        org,
        name,
        COUNT(*) AS tech_count,
        arrayStringConcat(groupArray(tech), ', ') AS tech_list
    FROM default.technologies
    GROUP BY org, name
)

SELECT
    ti.tech_count,
    r.url,
    r.ignored,
    r.ignored_reason
FROM default.repositories AS r
LEFT JOIN tech_info AS ti
    ON r.org = ti.org AND r.name = ti.name
WHERE (ti.tech_count <= 0 OR ti.tech_count IS NULL) AND repositories.last_fetched_at <> '1970-01-01 00:00:00' and repositories.ignored = 0;
```

```sql
-- Change category
ALTER TABLE technologies UPDATE category = 'linter' WHERE tech = 'vale';

-- Drop a tech
ALTER TABLE technologies DELETE WHERE tech = 'github';
```

```sql
-- Rebuild technology from source

TRUNCATE technologies_weekly;
TRUNCATE technologies_weekly_mv;

OPTIMIZE TABLE technologies FINAL;

INSERT INTO technologies_weekly_mv
SELECT
    date_week,
    tech,
    category,
    CAST(COUNT(tech) AS UInt64) AS hits
FROM technologies
GROUP BY (date_week, category, tech);
```

```sql
-- Rebuild licenses from source

TRUNCATE licenses_weekly;
TRUNCATE licenses_weekly_mv;

OPTIMIZE TABLE licenses FINAL;

INSERT INTO licenses_weekly_mv
SELECT
    date_week,
    license,
    CAST(COUNT(license) AS UInt64) AS hits
FROM licenses
GROUP BY (date_week, license);
```
