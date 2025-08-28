// Firebase Admin Configuration
// IMPORTANTE: Necesitas descargar tu archivo de credenciales de servicio desde Firebase Console
// 1. Ve a Firebase Console > Configuración del proyecto > Cuentas de servicio
// 2. Haz clic en "Generar nueva clave privada"
// 3. Descarga el archivo JSON
// 4. Copia los valores a las variables de entorno

export const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'automatia-b2138',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  privateKey: process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : '',
}

// Verificar que tenemos la configuración necesaria
export const isFirebaseAdminConfigured = () => {
  return !!(firebaseAdminConfig.projectId && 
            firebaseAdminConfig.clientEmail && 
            firebaseAdminConfig.privateKey)
}

// Configuración para desarrollo local
export const getLocalFirebaseConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      projectId: 'automatia-b2138',
      // Para desarrollo, puedes usar las credenciales del archivo JSON descargado
      // o configurar las variables de entorno en .env.local
    }
  }
  return firebaseAdminConfig
}


