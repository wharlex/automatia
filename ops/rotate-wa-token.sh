#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-https://automatia.ar}"
CHANNEL_ID="${1:?Uso: rotate-wa-token.sh <channelId> <nuevo_token>}"
NEW_TOKEN="${2:?Falta <nuevo_token>}"

echo "⏸️  Pausando cola..."
curl -fsS -X POST "$BASE/api/ops/queue/pause" -H 'x-admin-token: '${ADMIN_TOKEN:?Falta ADMIN_TOKEN} >/dev/null

echo "🔑 Actualizando token..."
curl -fsS -X POST "$BASE/api/channels/whatsapp/rotate-token" \
  -H 'content-type: application/json' \
  -H 'x-admin-token: '${ADMIN_TOKEN} \
  -d '{"channelId":"'"$CHANNEL_ID"'","accessToken":"'"$NEW_TOKEN"'"}' | jq .

echo "✅ Ping a Graph..."
curl -fsS -X POST "https://graph.facebook.com/v19.0/$(curl -fsS $BASE/api/channels/$CHANNEL_ID | jq -r .phoneNumberId)/messages" \
  -H "Authorization: Bearer ${NEW_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"messaging_product":"whatsapp","to":"00000000000","type":"text","text":{"body":"token ok (ping)"}}' | jq .

echo "▶️  Reanudando cola..."
curl -fsS -X POST "$BASE/api/ops/queue/resume" -H 'x-admin-token: '${ADMIN_TOKEN} >/dev/null
echo "Done."
