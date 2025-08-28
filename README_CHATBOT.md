# 🤖 Chatbot de WhatsApp con IA - Automatía

Sistema completo de chatbot inteligente para WhatsApp Business que reemplaza workflows de n8n con una solución integrada en Next.js.

## ✨ Características Principales

### 🔄 Procesamiento de Múltiples Tipos de Media
- **Texto**: Respuestas inteligentes con contexto
- **Audio**: Transcripción automática con Whisper
- **Imágenes**: Análisis visual con GPT-4 Vision
- **PDFs**: Extracción y análisis de documentos

### 🧠 Inteligencia Artificial
- Integración con OpenAI (GPT-4o, Whisper, TTS)
- Memoria de conversación por usuario (ventana de 10 mensajes)
- Prompts personalizables por negocio
- Respuestas en texto o audio según preferencia del usuario

### 📱 WhatsApp Business API
- Webhooks seguros con verificación de firma
- Envío de mensajes de texto y audio
- Manejo de media (subida/descarga)
- Modo sandbox y producción

### 🏗️ Arquitectura Robusta
- Cola de mensajes con BullMQ + Redis
- Procesamiento asíncrono y escalable
- Logs en tiempo real con WebSockets
- Encriptación AES-256-GCM para secretos

## 🚀 Instalación

### 1. Dependencias
```bash
npm install bullmq ioredis zod jsonwebtoken crypto-js pdf-parse openai socket.io socket.io-client
```

### 2. Configuración de Base de Datos
```bash
# Instalar Prisma
npm install prisma @prisma/client

# Generar cliente
npx prisma generate

# Ejecutar migraciones
npx prisma db push
```

### 3. Variables de Entorno
Crear `.env.local`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/automatia_chatbot"

# Redis
REDIS_URL="redis://localhost:6379"

# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"

# WhatsApp Business API
WHATSAPP_VERIFY_TOKEN="automatia_verify_token_2024"
WHATSAPP_APP_SECRET="your-whatsapp-app-secret-here"

# Encryption
ENCRYPTION_KEY="your-32-byte-encryption-key-base64-here"

# App URLs
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

### 4. Generar Clave de Encriptación
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🏗️ Estructura del Proyecto

```
lib/
├── crypto.ts                 # Encriptación AES-256-GCM
├── services/
│   ├── WhatsAppService.ts   # API de WhatsApp Business
│   ├── AIService.ts         # OpenAI, Whisper, Vision, TTS
│   ├── MemoryService.ts     # Gestión de memoria de conversación
│   ├── PDFService.ts        # Extracción de texto de PDFs
│   └── LogService.ts        # Sistema de logs en tiempo real
├── queues/
│   └── bot.ts              # Worker de BullMQ para procesamiento
└── prisma/
    └── schema.prisma       # Modelos de base de datos

app/
├── api/
│   ├── webhooks/whatsapp/  # Webhook de WhatsApp
│   ├── config/             # Configuración del chatbot
│   ├── bot/test/           # Pruebas del chatbot
│   └── logs/               # API de logs
└── dashboard/chatbot/      # Dashboard de configuración

components/dashboard/
├── ChatbotConfig.tsx       # Wizard de configuración
└── BotLogs.tsx            # Monitoreo de logs
```

## 🔧 Configuración

### 1. Configurar WhatsApp Business API

1. **Crear App en Meta for Developers**
   - Ir a [developers.facebook.com](https://developers.facebook.com)
   - Crear nueva app
   - Agregar producto "WhatsApp Business API"

2. **Configurar Webhook**
   - URL: `https://tu-dominio.com/api/webhooks/whatsapp`
   - Verify Token: `automatia_verify_token_2024`
   - Suscribir a eventos: `messages`, `message_deliveries`

3. **Obtener Credenciales**
   - Phone Number ID
   - WhatsApp Business Account ID
   - Access Token
   - App Secret (opcional, para verificación de firma)

### 2. Configurar OpenAI
- Obtener API Key de [platform.openai.com](https://platform.openai.com)
- Configurar en variables de entorno

### 3. Configurar Base de Datos
```bash
# Crear base de datos PostgreSQL
createdb automatia_chatbot

# Ejecutar migraciones
npx prisma db push

# Opcional: Seed con datos de prueba
npx prisma db seed
```

## 📱 Uso

### 1. Configuración del Chatbot
1. Ir a `/dashboard/chatbot`
2. Completar wizard de 3 pasos:
   - Información del negocio
   - Configuración de WhatsApp
   - Configuración de IA

### 2. Probar el Chatbot
1. En la pestaña de configuración
2. Hacer clic en "Enviar Mensaje de Prueba"
3. Verificar logs en tiempo real

### 3. Monitoreo
1. Pestaña "Logs y Monitoreo"
2. Ver estadísticas en tiempo real
3. Exportar logs en CSV
4. Filtrar por nivel (INFO, WARN, ERROR)

## 🔒 Seguridad

### Encriptación
- **AES-256-GCM** para secretos sensibles
- **IV único** por cada encriptación
- **Auth Tag** para verificación de integridad
- **AAD** para contexto adicional

### Verificación de Webhooks
- **HMAC-SHA256** para verificar firma
- **Timing-safe comparison** para prevenir timing attacks
- **Validación de payload** con Zod

### Rate Limiting
- **Cola de mensajes** con BullMQ
- **Reintentos automáticos** con backoff exponencial
- **Límite de concurrencia** configurable

## 🧪 Pruebas

### Ejecutar Tests
```bash
npm test
```

### Tests Incluidos
- **Crypto**: Encriptación/desencriptación
- **WhatsApp**: Envío de mensajes, manejo de errores
- **AI**: Generación de respuestas, prompts
- **Memory**: Gestión de contexto
- **PDF**: Validación y extracción
- **Logs**: Sistema de logging

## 📊 Monitoreo y Logs

### Niveles de Log
- **INFO**: Operaciones normales
- **WARN**: Advertencias (no críticas)
- **ERROR**: Errores que impiden funcionamiento

### Métricas Disponibles
- Total de mensajes procesados
- Tiempo de respuesta promedio
- Tasa de éxito/error
- Uso de memoria por conversación

### Exportación
- **CSV**: Para análisis externos
- **JSON**: Para integraciones
- **Tiempo real**: WebSocket para dashboard

## 🚀 Despliegue

### 1. Producción
```bash
# Build
npm run build

# Start
npm start
```

### 2. Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### 3. Variables de Producción
- `DATABASE_URL`: Base de datos PostgreSQL
- `REDIS_URL`: Redis para colas
- `ENCRYPTION_KEY`: Clave de encriptación
- `WHATSAPP_APP_SECRET`: Secreto de WhatsApp
- `OPENAI_API_KEY`: Clave de OpenAI

## 🔧 Troubleshooting

### Problemas Comunes

1. **Webhook no verificado**
   - Verificar `WHATSAPP_VERIFY_TOKEN`
   - Comprobar URL del webhook

2. **Errores de OpenAI**
   - Verificar `OPENAI_API_KEY`
   - Comprobar límites de API

3. **Cola de mensajes no funciona**
   - Verificar conexión a Redis
   - Comprobar `REDIS_URL`

4. **Errores de encriptación**
   - Verificar `ENCRYPTION_KEY` (32 bytes)
   - Regenerar clave si es necesario

### Logs de Debug
```bash
# Ver logs del worker
tail -f logs/bot-worker.log

# Ver logs de la aplicación
tail -f logs/app.log

# Ver logs de Redis
redis-cli monitor
```

## 📈 Escalabilidad

### Optimizaciones Recomendadas
- **Redis Cluster** para alta disponibilidad
- **PostgreSQL Read Replicas** para consultas
- **CDN** para archivos de media
- **Load Balancer** para múltiples instancias
- **Monitoring** con Prometheus + Grafana

### Métricas de Performance
- **Throughput**: Mensajes por segundo
- **Latencia**: Tiempo de respuesta promedio
- **Uso de memoria**: Por conversación activa
- **CPU**: Uso del worker de procesamiento

## 🤝 Contribución

### Desarrollo Local
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código
- **TypeScript** estricto
- **ESLint** + **Prettier**
- **Tests** para nuevas funcionalidades
- **Documentación** actualizada

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Documentación**: [docs.automatia.store](https://docs.automatia.store)
- **Email**: contacto@automatia.store
- **WhatsApp**: +54 9 341 611-5981
- **Issues**: [GitHub Issues](https://github.com/automatia/chatbot/issues)

---

**Desarrollado con ❤️ por el equipo de Automatía**





