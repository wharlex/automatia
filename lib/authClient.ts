import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebaseClient"

const googleProvider = new GoogleAuthProvider()

export const signInWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const registerWithEmail = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await sendEmailVerification(result.user)
  await createUserDocument(result.user)
  return result
}

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)
  await createUserDocument(result.user)
  return result
}

export const resendVerification = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser)
  }
}

export const signOut = async () => {
  await firebaseSignOut(auth)
}

const createUserDocument = async (user: User) => {
  const userRef = doc(db, "users", user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      emailVerified: user.emailVerified,
      createdAt: new Date(),
    })

    // Create demo account and bot
    await createDemoData(user.uid)
  }
}

const createDemoData = async (uid: string) => {
  // Create demo account
  const accountRef = doc(db, "accounts", `account_${uid}`)
  await setDoc(accountRef, {
    name: "Mi Empresa",
    ownerUid: uid,
    members: [{ uid, role: "owner" }],
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Create demo bot
  const botRef = doc(db, "bots", `bot_${uid}`)
  await setDoc(botRef, {
    name: "Mi Chatbot",
    accountId: `account_${uid}`,
    ownerUid: uid,
    status: "inactive",
    createdAt: new Date(),
    updatedAt: new Date(),
    config: {
      welcomeMessage: "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?",
      personality: "friendly",
      language: "es",
    },
  })
}

