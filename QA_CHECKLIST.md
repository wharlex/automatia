# QA Checklist - Automatía Admin Panel & ConfigBlocks

## 🎯 Objetivo
Verificar que todas las funcionalidades implementadas funcionen correctamente según los requisitos del usuario.

## ✅ Checklist de Funcionalidades

### 1. Panel Admin Protegido por Roles
- [ ] **Middleware Admin**: `/app/admin/**` bloquea acceso a no-admin
- [ ] **Solo OWNER/ADMIN** pueden acceder a rutas admin
- [ ] **MEMBER** es redirigido al dashboard principal

### 2. Páginas Admin Implementadas
- [ ] **Overview** (`/app/admin/page.tsx`): Estadísticas del sistema
- [ ] **Clientes** (`/app/admin/clientes/page.tsx`): Gestión de miembros
- [ ] **Revisión** (`/app/admin/revision/[workspaceId]/page.tsx`): Diffs + publicar bloques
- [ ] **Access** (`/app/admin/access/page.tsx`): Allowlist por bot
- [ ] **Impersonate** (`/app/admin/impersonate/page.tsx`): Entrar como cliente

### 3. APIs Admin Funcionando
- [ ] **POST** `/api/admin/approve-member`: Aprobar/revocar miembros
- [ ] **POST** `/api/admin/activate-bot`: Activar/desactivar bot
- [ ] **POST** `/api/admin/allowlist/upsert`: Agregar/remover emails
- [ ] **POST** `/api/admin/impersonate`: Iniciar/detener impersonación

### 4. APIs de Bloques Funcionando
- [ ] **POST** `/api/blocks/save`: Guardar como DRAFT
- [ ] **POST** `/api/blocks/submit`: Enviar a revisión
- [ ] **POST** `/api/blocks/publish`: Publicar (solo admin)
- [ ] **POST** `/api/blocks/lock`: Bloquear/desbloquear (solo admin)

### 5. Componente ConfigBlockCard
- [ ] **Estados**: DRAFT/IN_REVIEW/PUBLISHED
- [ ] **Permisos**: editableByClient + lockedByAdmin
- [ ] **Botones**: Guardar, Enviar a revisión, Publicar, Lock/Unlock
- [ ] **UI**: Estados visuales claros, badges, iconos

### 6. Vista Checklist Cliente
- [ ] **Ruta**: `/app/checklist/page.tsx`
- [ ] **Bloques editables**: Cliente puede editar y enviar a revisión
- [ ] **Bloques read-only**: Cliente solo puede ver
- [ ] **Estados**: Contadores de DRAFT/IN_REVIEW/PUBLISHED

### 7. Seeds de Base de Datos
- [ ] **Usuario OWNER**: `vr212563@gmail.com`
- [ ] **Workspace demo**: Con bot y bloques iniciales
- [ ] **Bloques iniciales**: prompts.system, prompts.faq, datos.menu, flujo.conversacion
- [ ] **Permisos**: Configurados correctamente (editableByClient, lockedByAdmin)

### 8. Flujo de Trabajo de Bloques
- [ ] **Cliente edita** → DRAFT
- [ ] **Cliente envía** → IN_REVIEW
- [ ] **Admin revisa** → Ve diffs
- [ ] **Admin publica** → PUBLISHED v+1

### 9. Sistema de Guards
- [ ] **membership-not-approved**: Usuario no aprobado
- [ ] **bot-not-activated**: Bot inactivo
- [ ] **not-in-allowlist**: Email no en allowlist
- [ ] **403 con reason específico** en `/api/chat`

### 10. Chat SSE Funcionando
- [ ] **Streaming**: Chunks de texto en tiempo real
- [ ] **Cancelación**: AbortController funciona
- [ ] **Metadata**: Provider, model, tokens, stepId
- [ ] **Rate limiting**: 429 para límites excedidos

### 11. Rate Limiting + Idempotencia
- [ ] **Límite**: userId + workspaceId + botId
- [ ] **Deduplicación**: clientMessageId
- [ ] **Redis**: Rate limit helper funcionando

### 12. Estados de Conexión
- [ ] **Health endpoint**: `/api/health`
- [ ] **LLM OK**: Estado del servicio de IA
- [ ] **WhatsApp OK**: Estado de la conexión
- [ ] **Webhook OK**: Estado del webhook

### 13. Manejo de Adjuntos
- [ ] **Input de archivos**: txt/pdf/img/csv
- [ ] **Datasource**: Se crea automáticamente
- [ ] **ContextRef**: Se pasa al Flow

### 14. Logs + AuditLog
- [ ] **CHAT_IN/OUT**: Registro de mensajes
- [ ] **FLOW_STEP**: Registro de pasos ejecutados
- [ ] **GUARD_FAIL**: Registro de fallos de guard
- [ ] **SAVE_DRAFT/SUBMIT_REVIEW/PUBLISH**: Registro de cambios de estado

### 15. Tests Implementados
- [ ] **Unit tests**: FlowRunner, GuardService
- [ ] **E2E tests**: Flujos completos
- [ ] **Vitest**: Configuración funcionando

## 🧪 Casos de Prueba Específicos

### Caso 1: Usuario MEMBER no aprobado
1. Entrar como MEMBER con `isApproved: false`
2. Intentar chatear con bot
3. **Resultado esperado**: 403 con reason="membership-not-approved"

### Caso 2: Bot inactivo
1. Desactivar bot (`isBotActivated: false`)
2. Usuario aprobado intenta chatear
3. **Resultado esperado**: 403 con reason="bot-not-activated"

### Caso 3: Allowlist activa
1. Configurar allowlist en bot
2. Usuario no en allowlist intenta chatear
3. **Resultado esperado**: 403 con reason="not-in-allowlist"

### Caso 4: Flujo de trabajo de bloques
1. Cliente edita `datos.menu` → DRAFT
2. Cliente envía a revisión → IN_REVIEW
3. Admin abre revisión → Ve diffs
4. Admin publica → PUBLISHED v+1
5. **Resultado esperado**: Flujo completo funcionando

### Caso 5: Impersonación
1. Admin inicia impersonación de cliente
2. Banner visible "Modo Impersonación Activo"
3. Todas las acciones se registran en AuditLog
4. **Resultado esperado**: Impersonación segura y auditada

### Caso 6: Chat SSE
1. Enviar mensaje al bot
2. Ver streaming de respuesta en tiempo real
3. Cancelar durante streaming
4. **Resultado esperado**: Streaming funciona, cancelación corta respuesta

### Caso 7: Rate limiting
1. Enviar 25 requests en <60s
2. **Resultado esperado**: 429 rate limit

## 🚨 Problemas Conocidos
- [ ] Listar problemas encontrados durante testing
- [ ] Priorizar por severidad (Critical, High, Medium, Low)

## 📝 Notas de Testing
- [ ] Ambiente de testing configurado
- [ ] Base de datos de prueba con datos reales
- [ ] Logs habilitados para debugging
- [ ] Errores capturados y documentados

## ✅ Criterios de Aceptación
- [ ] **100% funcional**: Todas las features implementadas funcionan
- [ ] **Sin errores críticos**: No hay crashes o errores 500
- [ ] **UX fluida**: Navegación intuitiva y responsive
- [ ] **Seguridad**: Roles y permisos funcionando correctamente
- [ ] **Performance**: Respuestas en <2s para operaciones críticas
- [ ] **Auditabilidad**: Todas las acciones quedan registradas

## 🔄 Estado del Testing
- [ ] **Pendiente**: Funcionalidades no probadas
- [ ] **En Progreso**: Funcionalidades siendo probadas
- [ ] **Completado**: Funcionalidades validadas
- [ ] **Falló**: Funcionalidades con problemas

---

**Fecha de Testing**: _______________
**Tester**: _______________
**Versión**: _______________
**Comentarios**: _______________
