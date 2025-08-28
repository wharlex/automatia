#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-${1:-https://automatia.ar}}"
APP="app"; WORKER="worker"; REDIS="redis"; PG="postgres"

cd "$(dirname "$0")"

echo "== Comprobando contenedores Docker =="
docker compose ps
# app healthy
hc=$(docker compose ps --format json | jq -r '.[] | select(.Service=="app") | .Health')
[ "$hc" = "healthy" ] || { echo "❌ app no healthy"; exit 1; }

echo "== Smoke API =="
./smoke.sh "$BASE" >/dev/null

echo "== Headers TLS / HSTS =="
curl -fsSI "$BASE" | grep -qi "strict-transport-security" || { echo "❌ Falta HSTS"; exit 1; }

echo "== Redis PING =="
docker compose exec -T "$REDIS" redis-cli ping | grep -q PONG || { echo "❌ Redis sin PONG"; exit 1; }

echo "== Postgres tablas =="
docker compose exec -T "$PG" psql -U ${PGUSER} -d ${PGDATABASE} -c "\dt" | grep -E "bot|channel|flow|message" >/dev/null || { echo "❌ Faltan tablas"; exit 1; }

echo "== Verificaciones runtime (webhooks, LLM, idempotencia) =="
# requiere tsx instalado en el contenedor/app; ejecutamos desde host usando node local si existe node_modules
npx -y tsx ../scripts/verify-runtime.ts "$BASE"

echo "== Link checker básico =="
BASE_URL="$BASE" npx -y tsx ../scripts/check-links.ts

echo "== OK: verificación integral pasada ✅ =="
