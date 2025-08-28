import { adminAuth, adminDb } from "./firebaseAdmin"

export interface UserClaims {
  role: "admin" | "user"
  features: Record<string, boolean>
  orgId?: string
}

export interface AllowlistEntry {
  email: string
  features: string[]
  role?: "admin" | "user"
  createdAt: Date
  appliedAt?: Date
}

export class ClaimsManager {
  static async setUserClaims(uid: string, claims: Partial<UserClaims>): Promise<void> {
    const user = await adminAuth.getUser(uid)
    const currentClaims = (user.customClaims as UserClaims) || { role: "user", features: {} }

    const newClaims: UserClaims = {
      role: claims.role || currentClaims.role,
      features: { ...currentClaims.features, ...claims.features },
      orgId: claims.orgId || currentClaims.orgId,
    }

    await adminAuth.setCustomUserClaims(uid, newClaims)
  }

  static async getUserClaims(uid: string): Promise<UserClaims> {
    const user = await adminAuth.getUser(uid)
    return (user.customClaims as UserClaims) || { role: "user", features: {} }
  }

  static async addToAllowlist(email: string, features: string[], role: "admin" | "user" = "user"): Promise<void> {
    const allowlistEntry: AllowlistEntry = {
      email,
      features,
      role,
      createdAt: new Date(),
    }

    await adminDb.collection("allowlist").doc(email).set(allowlistEntry)
  }

  static async applyPendingClaims(email: string): Promise<boolean> {
    try {
      const allowlistDoc = await adminDb.collection("allowlist").doc(email).get()

      if (!allowlistDoc.exists) {
        return false
      }

      const entry = allowlistDoc.data() as AllowlistEntry

      if (entry.appliedAt) {
        return false // Already applied
      }

      // Find user by email
      const userRecord = await adminAuth.getUserByEmail(email)

      // Apply claims
      const features: Record<string, boolean> = {}
      entry.features.forEach((feature) => {
        features[feature] = true
      })

      await this.setUserClaims(userRecord.uid, {
        role: entry.role || "user",
        features,
      })

      // Mark as applied
      await adminDb.collection("allowlist").doc(email).update({
        appliedAt: new Date(),
      })

      return true
    } catch (error) {
      console.error("[v0] Failed to apply pending claims:", error)
      return false
    }
  }

  static async hasFeature(uid: string, feature: string): Promise<boolean> {
    const claims = await this.getUserClaims(uid)
    return claims.features[feature] === true
  }

  static async isAdmin(uid: string): Promise<boolean> {
    const claims = await this.getUserClaims(uid)
    return claims.role === "admin"
  }

  static async ensureAdminUser(uid: string, email: string): Promise<void> {
    if (email === "vr212563@gmail.com") {
      const currentClaims = await this.getUserClaims(uid)

      if (currentClaims.role !== "admin" || !currentClaims.features.chatbot) {
        await this.setUserClaims(uid, {
          role: "admin",
          features: { ...currentClaims.features, chatbot: true },
        })

        console.log(`[v0] Admin privileges granted to ${email}`)
      }
    }
  }

  static async grantFeature(uid: string, feature: string): Promise<void> {
    const currentClaims = await this.getUserClaims(uid)
    await this.setUserClaims(uid, {
      features: { ...currentClaims.features, [feature]: true },
    })
  }

  static async revokeFeature(uid: string, feature: string): Promise<void> {
    const currentClaims = await this.getUserClaims(uid)
    const newFeatures = { ...currentClaims.features }
    delete newFeatures[feature]

    await this.setUserClaims(uid, {
      features: newFeatures,
    })
  }
}

export const hasFeature = (user: any, feature: string): boolean => {
  return user.features && user.features[feature] === true
}

export const isAdmin = (user: any): boolean => {
  return user.role === "admin"
}
