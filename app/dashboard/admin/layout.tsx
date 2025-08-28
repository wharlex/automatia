import type React from "react"
import AdminGuard from "@/components/dashboard/AdminGuard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminGuard>{children}</AdminGuard>
}
