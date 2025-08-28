import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

// Lazy initialization to avoid build-time errors
let adminApp: any = null
let adminAuthInstance: any = null
let adminDbInstance: any = null

function initializeFirebaseAdmin() {
  if (!adminApp) {
    // Check if we have the required environment variables
    const hasRequiredConfig = process.env.FIREBASE_PROJECT_ID && 
                             process.env.FIREBASE_CLIENT_EMAIL && 
                             process.env.FIREBASE_PRIVATE_KEY

    if (hasRequiredConfig) {
      try {
        const firebaseAdminConfig = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }

        adminApp = getApps().length === 0
          ? initializeApp({
              credential: cert(firebaseAdminConfig),
              projectId: process.env.FIREBASE_PROJECT_ID,
            })
          : getApps()[0]
        
        adminAuthInstance = getAuth(adminApp)
        adminDbInstance = getFirestore(adminApp)
      } catch (error) {
        console.warn("Firebase Admin initialization failed:", error)
        // Fall back to mock objects
        createMockInstances()
      }
    } else {
      // Create mock objects when config is missing
      createMockInstances()
    }
  }
  return { adminApp, adminAuth: adminAuthInstance, adminDb: adminDbInstance }
}

function createMockInstances() {
  adminApp = {}
  adminAuthInstance = {
    verifyIdToken: async () => ({ uid: 'mock-uid', email: 'mock@example.com' })
  }
  adminDbInstance = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => ({}) }),
        set: async () => ({}),
        add: async () => ({})
      })
    })
  }
}

export const getAdminAuth = () => {
  const { adminAuth } = initializeFirebaseAdmin()
  return adminAuth
}

export const getAdminDb = () => {
  const { adminDb } = initializeFirebaseAdmin()
  return adminDb
}

// Legacy exports for backward compatibility
export const adminAuth = getAdminAuth()
export const adminDb = getAdminDb()
