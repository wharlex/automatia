# 🚀 Guía de Despliegue - Automatía

## Prerrequisitos

- VPS Linux (Ubuntu 22+)
- Docker y Docker Compose instalados
- Dominio apuntando al VPS (ej: automatia.ar)

## Configuración Inicial

### 1. DNS
Apuntá tu dominio al VPS:
```
automatia.ar    A    <IP_DEL_VPS>
www.automatia.ar CNAME automatia.ar
```

### 2. Variables de Entorno
```bash
cd ops/
cp env.production.example .env.production
# Editar .env.production con tus valores reales
```

### 3. Despliegue
```bash
# Primera vez
bash deploy.sh

# Emitir certificado SSL (una vez)
docker run -it --rm -v certs:/etc/letsencrypt -v webroot:/var/www/certbot \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d automatia.ar -d www.automatia.ar --agree-tos -m tu@mail.com

# Reiniciar nginx para cargar certificados
docker compose restart nginx
```

### 4. Verificación
```bash
./smoke.sh https://automatia.ar
# Debe mostrar todos los checks en verde
```

## Operación Diaria

### Comandos Útiles
```bash
# Ver logs
docker compose logs -f app
docker compose logs -f worker
docker compose logs -f nginx

# Backup
bash backup.sh

# Rotar token WhatsApp (sin downtime)
ADMIN_TOKEN=tu_token bash rotate-wa-token.sh <channelId> <nuevo_token>

# Rollback
bash rollback.sh
```

### Monitoreo
- Health: `https://automatia.ar/api/healthz`
- Status: `https://automatia.ar/api/status`
- Métricas: `https://automatia.ar/api/metrics`

## Troubleshooting

### Si algo falla:
1. Ver logs: `docker compose logs -f`
2. Verificar status: `./smoke.sh https://automatia.ar`
3. Revisar .env.production
4. Reiniciar: `docker compose restart`

### Recuperación de Desastres
```bash
# Restaurar desde backup
docker compose exec -T postgres psql -U $PGUSER -d $PGDATABASE < backups/db-YYYYMMDD-HHMMSS.sql
```

## Seguridad

- ✅ TLS/HTTPS automático con Let's Encrypt
- ✅ Secrets cifrados con AES-256-GCM
- ✅ Rate limiting en webhooks
- ✅ Validación de firmas (WhatsApp/Telegram)
- ✅ CORS estricto
- ✅ Headers de seguridad (HSTS, CSP)

## Escalabilidad

- Worker separado para procesamiento de mensajes
- Redis para colas y caché
- PostgreSQL para persistencia
- Nginx como reverse proxy con gzip
- Health checks automáticos
- Restart automático en fallos
