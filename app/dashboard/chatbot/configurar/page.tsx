"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ConfigurarChatbotRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/configurar-chatbot")
  }, [router])

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        <span className="text-[var(--text)]">Redirigiendo a la nueva configuración...</span>
      </div>
    </div>
  )
}
