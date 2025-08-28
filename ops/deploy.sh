#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# 0) chequeos
command -v docker >/dev/null || { echo "Docker no instalado"; exit 1; }
command -v docker compose >/dev/null || { echo "Docker Compose plugin no instalado"; exit 1; }
[ -f .env.production ] || { echo "Falta ops/.env.production"; exit 1; }

# 1) build & up
docker compose pull || true
docker compose build --no-cache app worker
docker compose up -d postgres redis
sleep 3

# 2) migraciones
docker compose run --rm app npx prisma migrate deploy

# 3) nginx+certbot+app+worker
docker compose up -d nginx certbot app worker

# 4) smoke
./smoke.sh https://automatia.ar
echo "✅ Deploy OK"
