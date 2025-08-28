#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-http://localhost:3000}"
curl -fsS "$BASE/api/healthz"  >/dev/null
curl -fsS "$BASE/api/readyz"   | jq -e '.ok==true and .db==true and .redis==true and .worker==true' >/dev/null
curl -fsS "$BASE/api/status"   | jq -e '.checks!=null' >/dev/null
curl -fsS -X POST "$BASE/api/chatbot/test" -H 'content-type: application/json' -d '{"text":"hola"}' | jq -e '.reply|type=="string"' >/dev/null
