# 🔐 **CREDENCIALES FIREBASE REQUERIDAS**

## **⚠️ IMPORTANTE: La autenticación NO funcionará sin estas credenciales**

### **1. CONFIGURACIÓN FIREBASE**

#### **Paso 1: Crear proyecto en Firebase Console**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Authentication** y **Firestore Database**

#### **Paso 2: Configurar Authentication**
1. En **Authentication > Sign-in method**
2. Habilita **Google** y **Email/Password**
3. Para Google: configura OAuth consent screen

#### **Paso 3: Configurar Firestore**
1. En **Firestore Database**
2. Crea una base de datos en modo de prueba
3. Configura las reglas de seguridad

### **2. VARIABLES DE ENTORNO REQUERIDAS**

#### **Archivo: `.env.local` (crear en la raíz del proyecto)**

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### **3. DÓNDE OBTENER CADA VALOR**

#### **NEXT_PUBLIC_FIREBASE_API_KEY**
- **Ubicación**: Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
- **Valor**: `apiKey: "AIzaSyC..."`

#### **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**
- **Ubicación**: Mismo lugar que arriba
- **Valor**: `authDomain: "tu-proyecto.firebaseapp.com"`

#### **NEXT_PUBLIC_FIREBASE_PROJECT_ID**
- **Ubicación**: Mismo lugar que arriba
- **Valor**: `projectId: "tu-proyecto-id"`

#### **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**
- **Ubicación**: Mismo lugar que arriba
- **Valor**: `storageBucket: "tu-proyecto.appspot.com"`

#### **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**
- **Ubicación**: Mismo lugar que arriba
- **Valor**: `messagingSenderId: "123456789"`

#### **NEXT_PUBLIC_FIREBASE_APP_ID**
- **Ubicación**: Mismo lugar que arriba
- **Valor**: `appId: "1:123456789:web:abcdef123456"`

### **4. CONFIGURACIÓN GOOGLE OAUTH**

#### **Paso 1: OAuth Consent Screen**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **APIs & Services > OAuth consent screen**
4. Configura la información básica

#### **Paso 2: Credenciales OAuth**
1. Ve a **APIs & Services > Credentials**
2. Crea **OAuth 2.0 Client IDs**
3. Tipo: **Web application**
4. Orígenes autorizados: 
   - `http://localhost:3000` (desarrollo)
   - `https://automatia.ar` (producción)
   - `https://www.automatia.ar` (producción)

#### **Paso 3: URLs de Redirección**
- `http://localhost:3000/auth/callback/google` (desarrollo)
- `https://automatia.ar/auth/callback/google` (producción)

### **5. VERIFICACIÓN DE CONFIGURACIÓN**

#### **Después de configurar las variables:**
1. Reinicia el servidor de desarrollo
2. Ve a `/login`
3. Prueba el botón "Continuar con Google"
4. Debería abrirse el popup de Google

### **6. SOLUCIÓN DE PROBLEMAS COMUNES**

#### **Error: "Firebase configuration incomplete"**
- Verifica que todas las variables estén en `.env.local`
- Reinicia el servidor después de cambiar variables

#### **Error: "Google sign-in popup blocked"**
- Verifica que el dominio esté en orígenes autorizados
- Asegúrate de que no haya bloqueadores de popups

#### **Error: "Firebase not initialized"**
- Verifica que las credenciales sean correctas
- Asegúrate de que el proyecto esté activo

### **7. SEGURIDAD**

#### **⚠️ IMPORTANTE:**
- **NUNCA** subas `.env.local` a Git
- Las variables `NEXT_PUBLIC_*` son visibles en el cliente
- Para producción, usa variables de entorno del servidor

### **8. CONTACTO**

Si tienes problemas con la configuración:
1. Verifica que todas las variables estén correctas
2. Asegúrate de que Firebase esté habilitado
3. Revisa la consola del navegador para errores

---

**🚀 Una vez configurado, la autenticación funcionará perfectamente!**
