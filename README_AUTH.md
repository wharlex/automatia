# Configuración de Firebase Auth para Automatía

## Credenciales de Firebase

El proyecto ya tiene configuradas las credenciales de Firebase para el proyecto `automatia-b2138`. Estas están hardcodeadas en `lib/firebaseClient.ts` como fallback, pero se recomienda usar variables de entorno.

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCzxEdM4ve2RqC0esUN4nasyGXuHc1Cnsc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=automatia-b2138.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=automatia-b2138
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=automatia-b2138.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=902831495475
NEXT_PUBLIC_FIREBASE_APP_ID=1:902831495475:web:680ef62d6c507f36520646
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-40HTEYL9XZ

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development
```

## Configuración en Firebase Console

1. **Habilitar Authentication**: Ve a Firebase Console > Authentication > Sign-in method
2. **Habilitar Email/Password**: Activa "Email/Password" como método de autenticación
3. **Habilitar Google**: Activa "Google" como proveedor de autenticación
4. **Configurar OAuth**: Agrega tu dominio (localhost:3001 para desarrollo) en "Authorized domains"

## Funcionalidades Implementadas

### ✅ Login con Email/Password
- Validación de campos
- Manejo de errores de Firebase
- Redirección automática tras login exitoso

### ✅ Login con Google
- Botón "Continuar con Google"
- Popup de autenticación
- Manejo de errores

### ✅ Registro con Email/Password
- Validación de formulario
- Creación de usuario en Firebase
- Envío de verificación de email
- Redirección a página de verificación

### ✅ Verificación de Email
- Página dedicada para verificar email
- Redirección automática tras verificación

### ✅ Recuperación de Contraseña
- Formulario para reset de password
- Envío de email de recuperación

## Estructura de Archivos

- `app/login/page.tsx` - Página de login
- `app/register/page.tsx` - Página de registro
- `app/verify/page.tsx` - Página de verificación de email
- `app/recuperar-password/page.tsx` - Página de recuperación de contraseña
- `lib/firebaseClient.ts` - Configuración del cliente Firebase
- `lib/firebaseAdmin.ts` - Configuración del servidor Firebase (para SSR)

## Flujo de Autenticación

1. **Usuario no autenticado** → Redirigido a `/login`
2. **Login exitoso** → Redirigido a `/dashboard` (si email verificado) o `/verify` (si no verificado)
3. **Registro exitoso** → Redirigido a `/verify` para verificar email
4. **Email verificado** → Redirigido a `/dashboard`
5. **Dashboard** → Protegido por `AuthGuard` component

## Notas Importantes

- Las credenciales de Firebase están hardcodeadas como fallback
- El proyecto usa Next.js 14 con App Router
- La autenticación está implementada tanto en cliente como servidor
- Se incluye manejo de errores y estados de carga
- Las páginas están optimizadas para móvil y desktop
