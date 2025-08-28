import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { ClaimsManager } from "@/lib/claims"
import { adminAuth, adminDb } from "@/lib/firebaseAdmin"

export async function POST(req: NextRequest) {
 try {
   await requireAdmin(req)
   const { email, features = [], role = "user" } = await req.json()

   if (!email || !Array.isArray(features)) {
     return NextResponse.json({ error: "Email and features array required" }, { status: 400 })
   }

   try {
     const userRecord = await adminAuth.getUserByEmail(email)
     const featureMap: Record<string, boolean> = {}
     for (const f of features) featureMap[f] = true

     await ClaimsManager.setUserClaims(userRecord.uid, {
       role: role as "admin" | "user",
       features: featureMap,
     })

     return NextResponse.json({ success: true, message: "Claims applied immediately", applied: true })
   } catch {
     await ClaimsManager.addToAllowlist(email, features, role as "admin" | "user")
     return NextResponse.json({ success: true, message: "Added to allowlist for future application", applied: false })
   }
 } catch (error) {
   console.error("[v0] Allowlist error:", error)
   const message = error instanceof Error ? error.message : String(error)
   return NextResponse.json({ error: message }, { status: 500 })
 }
}

export async function GET(req: NextRequest) {
 try {
   await requireAdmin(req)
   const allowlistSnapshot = await adminDb.collection("allowlist").get()
   type AllowDoc = { createdAt?: { toDate?: () => Date }, appliedAt?: { toDate?: () => Date }, [k: string]: any }
   const allowlist = allowlistSnapshot.docs.map((doc) => {
     const data = doc.data() as AllowDoc
     return {
       email: doc.id,
       ...data,
       createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
       appliedAt: data.appliedAt?.toDate?.()?.toISOString() ?? null,
     }
   })
   return NextResponse.json({ allowlist })
 } catch (error) {
   console.error("[v0] Allowlist error:", error)
   const message = error instanceof Error ? error.message : String(error)
   return NextResponse.json({ error: message }, { status: 500 })
 }
}
