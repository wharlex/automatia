# Configuración de Firebase para Automatía

## 🔥 Configuración Inmediata

### 1. Crear archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCzxEdM4ve2RqCOesUN4nasyGXuHc1Cnsc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=automatia-b2138.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=automatia-b2138
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=automatia-b2138.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=902831495475
NEXT_PUBLIC_FIREBASE_APP_ID=1:902831495475:web:680ef62d6c507f36520646
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-40HTEYL9XZ

# Firebase Admin SDK (para backend)
FIREBASE_PROJECT_ID=automatia-b2138
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@automatia-b2138.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu_Clave_Privada_Aquí\n-----END PRIVATE KEY-----"
```

### 2. Obtener credenciales de Firebase Admin

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `automatia-b2138`
3. Ve a **Configuración del proyecto** (⚙️) > **Cuentas de servicio**
4. Haz clic en **Generar nueva clave privada**
5. Descarga el archivo JSON
6. Copia los valores a tu archivo `.env.local`

### 3. Habilitar autenticación con Google

1. En Firebase Console, ve a **Authentication** > **Sign-in method**
2. Habilita **Google** como proveedor
3. Configura el nombre del proyecto y el dominio de correo electrónico de soporte
4. Guarda los cambios

## 🚀 Funcionalidades Implementadas

### ✅ Autenticación con Email/Password
- Login y registro tradicional
- Validación de formularios
- Manejo de errores
- Verificación de email automática

### ✅ Autenticación con Google
- Login con Google (OAuth)
- Registro automático con Google
- Manejo de sesiones persistentes

### ✅ Seguridad
- Redirección automática para usuarios autenticados
- Protección de rutas
- Manejo de tokens JWT
- Logout seguro

### ✅ UX/UI
- Botones de Google con iconos oficiales
- Estados de carga
- Mensajes de error claros
- Diseño responsive

## 🔧 Archivos Modificados

- `lib/firebaseConfig.ts` - Configuración del cliente Firebase
- `lib/firebaseAdmin.ts` - Configuración del servidor Firebase
- `hooks/useAuth.ts` - Hook de autenticación con Google
- `app/login/page.tsx` - Página de login con Google
- `app/registro/page.tsx` - Página de registro con Google
- `components/AuthRedirect.tsx` - Redirección automática
- `components/AuthProvider.tsx` - Contexto de autenticación
- `components/LogoutButton.tsx` - Botón de logout

## 🧪 Testing

1. **Login con Google**: Haz clic en "Continuar con Google"
2. **Registro con Google**: Ve a registro y haz clic en "Registrarse con Google"
3. **Login tradicional**: Usa email y contraseña
4. **Registro tradicional**: Crea cuenta con email y contraseña

## 🚨 Solución de Problemas

### Error: "Firebase: Error (auth/api-key-not-valid)"
- ✅ **SOLUCIONADO**: Se corrigió la API key en `firebaseConfig.ts`
- La API key correcta es: `AIzaSyCzxEdM4ve2RqCOesUN4nasyGXuHc1Cnsc`

### Error: "Firebase: Error (auth/operation-not-allowed)"
- Verifica que Google esté habilitado en Firebase Console > Authentication > Sign-in method

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Agrega tu dominio a la lista de dominios autorizados en Firebase Console

## 📱 Próximos Pasos

1. **Configurar Firebase Admin** con las credenciales del archivo JSON
2. **Habilitar Firestore** para almacenar datos de usuario
3. **Configurar reglas de seguridad** en Firestore
4. **Implementar verificación de email** personalizada
5. **Agregar más proveedores** (Facebook, Twitter, etc.)

## 🔐 Variables de Entorno Requeridas

```bash
# Cliente (públicas)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=xxx

# Servidor (privadas)
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY=xxx
```

## 🎯 Estado Actual

- ✅ **Firebase Client**: Configurado y funcionando
- ✅ **Autenticación Google**: Implementada
- ✅ **UI/UX**: Completada
- ⚠️ **Firebase Admin**: Necesita credenciales
- ⚠️ **Backend**: Pendiente de configuración completa

## 📞 Soporte

Si tienes problemas:
1. Verifica que las variables de entorno estén correctas
2. Asegúrate de que Google esté habilitado en Firebase
3. Revisa la consola del navegador para errores
4. Verifica que el proyecto Firebase esté activo


