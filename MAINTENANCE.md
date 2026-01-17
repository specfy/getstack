# VPS

## Clean up disk

```sh
docker system prune
```

## Clean up ClickHouse

```sh
dokku clickhouse:restart clickhouse
```

table size

```sql
SELECT
    database,
    table,
    formatReadableSize(sum(bytes)) as size,
    sum(rows) as rows
FROM system.parts
WHERE active = 1
GROUP BY database, table
ORDER BY sum(bytes) DESC
LIMIT 10;
```

Clean

```sql
ALTER TABLE system.text_log DELETE WHERE event_time < now() - INTERVAL 7 DAY;
ALTER TABLE system.trace_log DELETE WHERE event_time < now() - INTERVAL 7 DAY;
ALTER TABLE system.metric_log DELETE WHERE event_time < now() - INTERVAL 7 DAY;
ALTER TABLE system.latency_log DELETE WHERE event_time < now() - INTERVAL 7 DAY;
ALTER TABLE system.asynchronous_metric_log DELETE WHERE event_time < now() - INTERVAL 7 DAY;
ALTER TABLE system.part_log DELETE WHERE event_time < now() - INTERVAL 7 DAY;
ALTER TABLE system.processors_profile_log DELETE WHERE event_time < now() - INTERVAL 7 DAY;
ALTER TABLE system.query_log DELETE WHERE event_time < now() - INTERVAL 7 DAY;
ALTER TABLE system.query_views_log DELETE WHERE event_time < now() - INTERVAL 7 DAY;
ALTER TABLE system.session_log DELETE WHERE event_time < now() - INTERVAL 7 DAY;
```

Optimize the tables to merge and free space:

```sql
OPTIMIZE TABLE system.text_log FINAL;
OPTIMIZE TABLE system.trace_log FINAL;
OPTIMIZE TABLE system.metric_log FINAL;
OPTIMIZE TABLE system.latency_log FINAL;
OPTIMIZE TABLE system.asynchronous_metric_log FINAL;
OPTIMIZE TABLE system.part_log FINAL;
OPTIMIZE TABLE system.processors_profile_log FINAL;
OPTIMIZE TABLE system.query_log FINAL;
OPTIMIZE TABLE system.query_views_log FINAL;
OPTIMIZE TABLE system.session_log FINAL;
```
