#!/usr/bin/env bash
set -euo pipefail
TS="$(date +%Y%m%d-%H%M%S)"
mkdir -p ./backups
# DB dump
docker compose exec -T postgres pg_dump -U ${PGUSER} ${PGDATABASE} > "./backups/db-${TS}.sql"
# Redis RDB copy
docker compose exec -T redis sh -c 'cat /data/dump.rdb' > "./backups/redis-${TS}.rdb"
echo "Backups en ./backups"
