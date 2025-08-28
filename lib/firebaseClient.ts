import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getFirebaseConfig } from "./firebaseConfig"

// Initialize Firebase
let app
let auth
let db

if (typeof window !== 'undefined') {
  // Client-side only
  const config = getFirebaseConfig()
  
  if (!getApps().length) {
    app = initializeApp(config)
  } else {
    app = getApps()[0]
  }
  
  auth = getAuth(app)
  db = getFirestore(app)
} else {
  // Server-side: return mock objects
  app = {}
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: async () => ({}),
    createUserWithEmailAndPassword: async () => ({}),
    signInWithPopup: async () => ({}),
    sendEmailVerification: async () => ({}),
    signOut: async () => ({}),
  }
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => ({}) }),
        set: async () => ({}),
        add: async () => ({})
      })
    })
  }
}

export { app, auth, db }

