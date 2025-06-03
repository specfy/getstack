#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <CLICKHOUSE_HOST> <CLICKHOUSE_PASSWORD>"
    echo "Example: $0 ldp3g2mxso.us-east1.gcp.clickhouse.cloud mypassword"
    exit 1
fi

CLICKHOUSE_HOST="$1"
CLICKHOUSE_PASSWORD="$2"
CLICKHOUSE_USER="default"
CLICKHOUSE_DB="default"

# List of tables to backup (from types.ts Clickhouse interface)
TABLES=(
    "repositories"
    "technologies"
    "licenses"
)

BACKUP_DIR="./clickhouse_backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

for TABLE in "${TABLES[@]}"; do
    echo "Backing up $TABLE as CSV..."
    clickhouse client \
        --host="$CLICKHOUSE_HOST" \
        --user="$CLICKHOUSE_USER" \
        --password="$CLICKHOUSE_PASSWORD" \
        --secure \
        --database="$CLICKHOUSE_DB" \
        --query="SELECT * FROM $TABLE FORMAT CSVWithNames" \
        > "$BACKUP_DIR/${TABLE}.csv"
done

echo "Backup completed. CSV files are in $BACKUP_DIR"
