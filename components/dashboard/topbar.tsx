"use client"

import { Bell, ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-automatia-gold/20 bg-automatia-teal/30 backdrop-blur-sm px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-automatia-white">Bienvenido, Usuario Demo</h2>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-automatia-gold rounded-full"></span>
        </Button>

        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-automatia-gold flex items-center justify-center">
            <User className="h-4 w-4 text-automatia-black" />
          </div>
          <ChevronDown className="h-4 w-4 text-automatia-white" />
        </div>
      </div>
    </header>
  )
}
