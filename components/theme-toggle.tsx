"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Theme = "dark" | "light" | "system"

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.toggle("dark", systemTheme === "dark")
    } else {
      root.classList.toggle("dark", newTheme === "dark")
    }
    
    localStorage.setItem("theme", newTheme)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) return null

  return (
    <div className="relative">
      <motion.div
        className="flex items-center gap-1 p-1 bg-[#0A1C2F]/50 border border-[#C5B358]/20 rounded-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {theme === "light" && (
            <motion.div
              key="light"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => handleThemeChange("light")}
                className="w-10 h-10 p-0 bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] shadow-lg"
              >
                <Sun className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
          
          {theme === "dark" && (
            <motion.div
              key="dark"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => handleThemeChange("dark")}
                className="w-10 h-10 p-0 bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] shadow-lg"
              >
                <Moon className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
          
          {theme === "system" && (
            <motion.div
              key="system"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => handleThemeChange("system")}
                className="w-10 h-10 p-0 bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] shadow-lg"
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex flex-col gap-1">
          <Button
            onClick={() => handleThemeChange("light")}
            variant="ghost"
            className={`w-8 h-8 p-0 text-xs ${
              theme === "light" 
                ? "text-[#C5B358] bg-[#C5B358]/10" 
                : "text-[#EAEAEA]/60 hover:text-[#EAEAEA] hover:bg-[#C5B358]/10"
            }`}
          >
            L
          </Button>
          <Button
            onClick={() => handleThemeChange("dark")}
            variant="ghost"
            className={`w-8 h-8 p-0 text-xs ${
              theme === "dark" 
                ? "text-[#C5B358] bg-[#C5B358]/10" 
                : "text-[#EAEAEA]/60 hover:text-[#EAEAEA] hover:bg-[#C5B358]/10"
            }`}
          >
            D
          </Button>
          <Button
            onClick={() => handleThemeChange("system")}
            variant="ghost"
            className={`w-8 h-8 p-0 text-xs ${
              theme === "system" 
                ? "text-[#C5B358] bg-[#C5B358]/10" 
                : "text-[#EAEAEA]/60 hover:text-[#EAEAEA] hover:bg-[#C5B358]/10"
            }`}
          >
            S
          </Button>
        </div>
      </motion.div>
    </div>
  )
}







