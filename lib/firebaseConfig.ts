// Firebase Configuration - AUTOMATÍA
export const firebaseConfig = {
  apiKey: "AIzaSyCzxEdM4ve2RqCOesUN4nasyGXuHc1Cnsc",
  authDomain: "automatia-b2138.firebaseapp.com",
  projectId: "automatia-b2138",
  storageBucket: "automatia-b2138.firebasestorage.app",
  messagingSenderId: "902831495475",
  appId: "1:902831495475:web:680ef62d6c507f36520646",
  measurementId: "G-40HTEYL9XZ"
}

// Environment variables (for production)
export const getFirebaseConfig = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variables if available
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfig.appId,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId
    }
  }
  
  // Server-side: return default config
  return firebaseConfig
}



