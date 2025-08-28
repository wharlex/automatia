# 🔍 Scripts de Verificación Integral

Este conjunto de scripts valida que TODO el sistema esté funcionando correctamente después de implementar las Partes 1-3.

## 📋 Comandos de Verificación

### Verificación Completa
```bash
# Desde la carpeta ops/
bash verify-all.sh https://automatia.ar

# O con variable de entorno
BASE=https://automatia.ar bash verify-all.sh
```

### Solo Smoke Test
```bash
bash smoke.sh https://automatia.ar
```

### Verificaciones Individuales
```bash
# Runtime (webhooks, LLM, idempotencia)
npx tsx ../scripts/verify-runtime.ts https://automatia.ar

# Links internos
BASE_URL=https://automatia.ar npx tsx ../scripts/check-links.ts
```

## ✅ Criterios de Aprobación

Los scripts **fallan con exit 1** si no se cumple alguno de estos criterios:

### 🐳 Docker & Infraestructura
- App healthy, Redis PONG, tablas DB presentes
- Contenedores corriendo y saludables

### 🌐 API Endpoints
- `/api/healthz` responde 200
- `/api/readyz` → `{ok: true, db: true, redis: true, worker: true}`
- `/api/status` → `{checks: {...}, ok: boolean}`
- `/api/chatbot/test` → `{reply: "string"}`

### 🔒 Seguridad & TLS
- HSTS activo en HTTPS
- Headers de seguridad presentes

### 🤖 LLM & Chatbot
- LLM ping responde OK
- Flow engine funciona y responde coherentemente

### 📱 Webhooks Funcionales
- **WhatsApp**: GET devuelve `hub.challenge` y POST idempotente
- **Telegram**: webhook responde 200 (si activo)
- **Webchat**: webhook responde 200 (si activo)

### 📊 Métricas & Observabilidad
- `/api/metrics` expone contadores
- Sin enlaces rotos internos (404/5xx)

## 🚨 Troubleshooting

### Error: "app no healthy"
```bash
docker compose ps
docker compose logs app
```

### Error: "Redis sin PONG"
```bash
docker compose exec redis redis-cli ping
docker compose logs redis
```

### Error: "Faltan tablas"
```bash
docker compose exec postgres psql -U $PGUSER -d $PGDATABASE -c "\dt"
```

### Error: "LLM ping no OK"
- Verificar que el endpoint `/api/llm/ping` esté implementado
- Revisar logs de la app

### Error: "WhatsApp GET verify FAIL"
- Verificar que el webhook esté configurado correctamente
- Revisar `verifyToken` en la base de datos

### Error: "Idempotencia WA FAIL"
- Verificar que el worker esté procesando mensajes
- Revisar logs del worker

## 🔧 Dependencias

Los scripts requieren:
- `jq` instalado en el sistema
- `tsx` disponible (se instala automáticamente con `npx`)
- `node-fetch` y `cheerio` (se instalan automáticamente)
- Variables de entorno: `PGUSER`, `PGDATABASE`

## 📝 Logs de Verificación

Los scripts muestran progreso detallado:
```
== Comprobando contenedores Docker ==
== Smoke API ==
== Headers TLS / HSTS ==
== Redis PING ==
== Postgres tablas ==
== Verificaciones runtime ==
✓ LLM ping
✓ WhatsApp GET verify
✓ WhatsApp POST idempotente
✓ Telegram POST
✓ Webchat POST
✓ /api/metrics
✓ /api/status payload
✅ runtime OK
== Link checker básico ==
✓ Sin enlaces rotos
== OK: verificación integral pasada ✅ ==
```

## 🎯 Uso en CI/CD

```yaml
# .github/workflows/verify.yml
- name: Verificación Integral
  run: |
    cd ops
    bash verify-all.sh ${{ secrets.BASE_URL }}
```
