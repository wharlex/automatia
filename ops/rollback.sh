#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
# rollback simple a la imagen previa (si usás tags), acá solo reinicia último estado
docker compose down
docker compose up -d
./smoke.sh https://automatia.ar || true
echo "⚠️ Rolled back (reiniciado último estado)"
