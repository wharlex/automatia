import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)

    const leadsSnapshot = await adminDb
      .collection("leads")
      .where("userId", "==", user.uid)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get()

    const leads = leadsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }))

    return NextResponse.json({ leads })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { leadId, status, notes } = await req.json()

    await adminDb.collection("leads").doc(leadId).update({
      status,
      notes,
      updatedAt: new Date(),
      updatedBy: user.uid,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
