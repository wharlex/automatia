# 🤖 Módulo de Configuración de ChatBot - Automatía

## 📋 Descripción General

Este módulo implementa un sistema completo de configuración de ChatBot productivo y funcional, sin demos ni datos de muestra. Permite configurar proveedores LLM, conectar canales de comunicación, crear flujos de conversación y activar bots inteligentes.

## 🏗️ Arquitectura del Sistema

### **Stack Tecnológico**
- **Frontend**: Next.js 14 + TypeScript + App Router
- **UI Components**: Shadcn UI + Tailwind CSS
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Autenticación**: Firebase Auth
- **Cifrado**: AES-256-GCM para API keys
- **Webhooks**: Endpoints REST para canales externos

### **Componentes Principales**
1. **Proveedores LLM**: OpenAI, Gemini, Anthropic
2. **Canales**: WhatsApp Cloud, Telegram, Webchat
3. **Motor de Flujos**: Sistema de nodos ejecutables
4. **Widget Embebido**: Chat integrable en sitios web

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+
- PostgreSQL 14+
- Redis (opcional, para colas de trabajo)
- Cuentas en proveedores LLM (OpenAI, Gemini, Anthropic)

### **1. Variables de Entorno**
Copia `.env.example` a `.env.local` y configura:

```bash
# Base Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3003
DATABASE_URL="postgresql://username:password@localhost:5432/automatia_chatbot"
REDIS_URL="redis://localhost:6379"

# Master Key para cifrado AES-256-GCM (32 bytes hex)
MASTER_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# LLM Providers (configura solo los que uses)
OPENAI_API_KEY="sk-..."
OPENAI_BASE_URL="https://api.openai.com/v1"
OPENAI_DEFAULT_MODEL="gpt-4o-mini"

GEMINI_API_KEY="AIza..."
GEMINI_DEFAULT_MODEL="gemini-1.5-flash"

ANTHROPIC_API_KEY="sk-ant-..."
ANTHROPIC_DEFAULT_MODEL="claude-3-haiku"

# WhatsApp Cloud API
WA_APP_SECRET="your-app-secret"
WA_VERIFY_TOKEN="your-verify-token"
WA_ACCESS_TOKEN="your-access-token"
WA_PHONE_NUMBER_ID="123456789"

# Telegram Bot
TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
```

### **2. Instalación de Dependencias**
```bash
npm install
```

### **3. Migración de Base de Datos**
```bash
# Ejecutar migraciones
npm run migrate:db

# O manualmente:
npx prisma generate
npx prisma migrate dev --name init
```

### **4. Iniciar el Servidor**
```bash
npm run dev
```

## 📱 Funcionalidades del Módulo

### **A. Proveedores LLM**
- **OpenAI**: Configuración de API key, URL base y modelo
- **Gemini**: Configuración de API key y modelo
- **Anthropic**: Configuración de API key y modelo
- **Pruebas**: Botón de test para verificar conectividad
- **Cifrado**: API keys almacenadas de forma segura

### **B. Canales de Comunicación**
- **WhatsApp Cloud**: 
  - Configuración de webhook
  - Verificación de firma
  - Envío de mensajes
- **Telegram**: 
  - Configuración de bot token
  - Set webhook automático
  - Manejo de comandos y mensajes
- **Webchat**: 
  - Widget embebido
  - Generación de slugs únicos
  - Comunicación en tiempo real

### **C. Flujos de Conversación**
- **Tipos de Nodos**:
  - `input`: Punto de entrada
  - `llm`: Respuesta de IA
  - `regex_router`: Enrutamiento por patrones
  - `menu_options`: Opciones de menú
  - `http_request`: Llamadas HTTP
  - `delay`: Pausas temporales
  - `end`: Finalización del flujo
- **Editor JSON**: Definición de flujos en formato JSON
- **Validación**: Verificación de integridad del flujo
- **Estado**: Draft/Live para control de versiones

### **D. Configuración del Bot**
- **Selección de Flujo**: Flujo por defecto para el bot
- **Proveedor LLM**: Proveedor de IA por defecto
- **Canales Activos**: Selección de canales habilitados
- **Estado**: Draft/Live para activación

## 🔌 Webhooks Implementados

### **WhatsApp Cloud**
```
GET  /api/webhooks/whatsapp/[channelId]?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
POST /api/webhooks/whatsapp/[channelId]
```

### **Telegram**
```
GET  /api/webhooks/telegram/[channelId]?action=setWebhook
POST /api/webhooks/telegram/[channelId]
```

### **Webchat**
```
POST /api/webhooks/webchat/[channelId]
GET  /api/webhooks/webchat/[channelId]?action=status
```

## 🌐 Widget Embebido

### **Inclusión en Sitios Web**
```html
<script src="https://tu-dominio.com/embed/webchat.js" defer></script>
<div id="automatia-chat" data-bot="BOT_ID" data-slug="PUBLIC_SLUG"></div>
```

### **Configuración Personalizable**
```javascript
window.initAutomatiaWebchat({
  channelId: 'tu-channel-id',
  theme: 'dark',
  position: 'bottom-right',
  primaryColor: '#FFD700'
});
```

## 🗄️ Estructura de Base de Datos

### **Tablas Principales**
- **users**: Usuarios del sistema
- **providers**: Proveedores LLM configurados
- **channels**: Canales de comunicación
- **flows**: Definiciones de flujos
- **bots**: Configuración de bots
- **messages**: Historial de mensajes
- **bot_channels**: Relación N:M entre bots y canales

### **Relaciones**
- Usuario → Proveedores, Canales, Flujos, Bots
- Bot → Flujo por defecto, Proveedor por defecto
- Bot ↔ Canales (N:M)
- Canal → Mensajes

## 🔒 Seguridad

### **Cifrado de Datos Sensibles**
- **API Keys**: Cifradas con AES-256-GCM
- **Master Key**: Almacenada en variables de entorno
- **Verificación de Firmas**: Para webhooks de WhatsApp

### **Autenticación y Autorización**
- **Firebase Auth**: Sistema de autenticación
- **Control de Acceso**: Verificación de permisos por usuario
- **Rate Limiting**: Protección contra abuso

## 📊 Monitoreo y Logs

### **Logs Estructurados**
- Verificación de webhooks
- Procesamiento de mensajes
- Errores de API
- Actividad de usuarios

### **Métricas Disponibles**
- Conversaciones activas
- Tiempo de respuesta
- Tasa de satisfacción
- Uso por canal

## 🧪 Testing

### **Pruebas de Proveedores LLM**
```bash
# Cada proveedor tiene un botón "Probar" que:
# 1. Envía mensaje de prueba: "Respondé OK"
# 2. Verifica respuesta exitosa
# 3. Muestra estado de conexión
```

### **Pruebas de Webhooks**
```bash
# WhatsApp: Verificación de hub.challenge
# Telegram: Set webhook y mensaje /hola
# Webchat: Input → respuesta en widget
```

## 🚀 Despliegue en Producción

### **Requisitos de Infraestructura**
- **Base de Datos**: PostgreSQL con SSL
- **Redis**: Para colas de trabajo (opcional)
- **HTTPS**: Obligatorio para webhooks
- **Firewall**: Acceso a APIs externas

### **Variables de Entorno de Producción**
```bash
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
MASTER_KEY="tu-clave-maestra-de-32-bytes"
```

### **Monitoreo de Producción**
- Logs de aplicación
- Métricas de base de datos
- Estado de webhooks
- Alertas de errores

## 🔧 Mantenimiento

### **Tareas Regulares**
- **Backup de Base de Datos**: Diario
- **Rotación de Logs**: Semanal
- **Verificación de Webhooks**: Mensual
- **Actualización de Dependencias**: Mensual

### **Troubleshooting Común**
- **Webhook no responde**: Verificar URL y tokens
- **Error de LLM**: Verificar API keys y límites
- **Base de datos lenta**: Optimizar índices
- **Widget no carga**: Verificar CORS y SSL

## 📚 Recursos Adicionales

### **Documentación de APIs**
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [OpenAI API](https://platform.openai.com/docs)
- [Gemini API](https://ai.google.dev/docs)
- [Anthropic API](https://docs.anthropic.com/)

### **Herramientas de Desarrollo**
- **Prisma Studio**: `npx prisma studio`
- **Logs en Tiempo Real**: `npm run dev`
- **Migraciones**: `npx prisma migrate dev`

## 🤝 Contribución

### **Estándares de Código**
- **TypeScript**: Tipado estricto
- **ESLint**: Linting automático
- **Prettier**: Formateo de código
- **Tests**: Cobertura mínima del 80%

### **Flujo de Desarrollo**
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit con mensaje descriptivo
4. Pull Request con descripción detallada

## 📄 Licencia

Este módulo es parte de Automatía y está bajo la licencia del proyecto principal.

## 🆘 Soporte

### **Canales de Ayuda**
- **Issues**: GitHub Issues del proyecto
- **Documentación**: README y comentarios en código
- **Comunidad**: Discord/Slack del proyecto

### **Contacto del Equipo**
- **Email**: soporte@automatia.store
- **Documentación**: docs.automatia.store

---

**🎯 Objetivo**: Proporcionar un sistema de ChatBot empresarial, productivo y escalable, sin demos ni contenido de muestra, listo para uso en producción.

**✅ Estado**: Implementación completa y funcional, lista para despliegue.

