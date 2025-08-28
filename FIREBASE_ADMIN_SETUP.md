# Configuración de Firebase Admin SDK

## 🔑 Obtener Credenciales de Firebase Admin

### 1. Ir a Firebase Console
- Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
- Selecciona tu proyecto: **automatia-b2138**

### 2. Generar Clave Privada
- Ve a **Project Settings** (⚙️ icono de engranaje)
- Haz clic en la pestaña **Service Accounts**
- Haz clic en **Generate new private key**
- Descarga el archivo JSON

### 3. Extraer Valores del JSON
El archivo descargado contiene algo como esto:
```json
{
  "type": "service_account",
  "project_id": "automatia-b2138",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@automatia-b2138.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40automatia-b2138.iam.gserviceaccount.com"
}
```

### 4. Configurar Variables de Entorno
Crea o edita el archivo `.env.local` en la raíz del proyecto:

```bash
# Firebase Admin SDK (Server-side only)
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@automatia-b2138.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_PROJECT_ID="automatia-b2138"
```

## ⚠️ Importante
- **NUNCA** subas `.env.local` a Git
- La `private_key` debe incluir los `\n` literales (no saltos de línea reales)
- Copia exactamente los valores del JSON descargado

## 🧪 Verificar Configuración
Después de configurar las variables:
1. Reinicia el servidor: `npm run dev`
2. Ve a `/dashboard/chatbot/configurar`
3. Deberías poder guardar y publicar sin errores de Firebase

## 🔒 Seguridad
- Las credenciales de Admin SDK tienen acceso completo a tu proyecto
- Mantén el archivo `.env.local` seguro y local
- No compartas estas credenciales

