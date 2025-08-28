"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/authClient"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut } from "lucide-react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebaseClient"

export function Topbar() {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-charcoal-gray bg-automatia-black/95 backdrop-blur supports-[backdrop-filter]:bg-automatia-black/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-automatia-white">
            ¡Hola, {user?.displayName || user?.email?.split("@")[0]}!
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
                  <AvatarFallback className="bg-automatia-gold text-automatia-black">
                    {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-automatia-black border-charcoal-gray" align="end">
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="text-automatia-white hover:bg-charcoal-gray hover:text-automatia-gold"
              >
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/account")}
                className="text-automatia-white hover:bg-charcoal-gray hover:text-automatia-gold"
              >
                <Settings className="mr-2 h-4 w-4" />
                Cuenta
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-charcoal-gray" />
              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={isLoading}
                className="text-automatia-white hover:bg-charcoal-gray hover:text-alert-red"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
