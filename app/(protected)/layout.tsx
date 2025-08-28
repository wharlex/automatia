import type React from "react"
import { AuthGuard } from "@/components/AuthGuard"
import { Sidebar } from "@/components/Sidebar"
import { Topbar } from "@/components/Topbar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-automatia-teal">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
