"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { Menu, X, User, LogIn, UserPlus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/sobre-nosotros", label: "Sobre Nosotros" },
    { href: "/como-funciona", label: "Cómo Funciona" },
    { href: "/productos", label: "Productos" },
    { href: "/contacto", label: "Contacto" },
  ]

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[9999] bg-[#0A1C2F]/95 backdrop-blur-md border-b border-[#C5B358]/20 shadow-2xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                <div className="w-full h-full bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    {/* Logo SVG de Automatía - A con elementos de circuito */}
                    <svg
                      viewBox="0 0 100 100"
                      className="w-8 h-8 lg:w-10 lg:h-10"
                      fill="none"
                    >
                      {/* Fondo del logo */}
                      <rect x="20" y="20" width="60" height="60" rx="8" fill="#0A1C2F" opacity="0.1"/>
                      
                      {/* Letra A estilizada */}
                      <path
                        d="M30 75 L50 25 L70 75 M35 60 L65 60"
                        stroke="#0A1C2F"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Elementos de circuito */}
                      <circle cx="50" cy="35" r="3" fill="#C5B358"/>
                      <circle cx="45" cy="45" r="2" fill="#C5B358"/>
                      <circle cx="55" cy="45" r="2" fill="#C5B358"/>
                      
                      {/* Líneas de conexión */}
                      <path d="M45 45 L50 35" stroke="#C5B358" strokeWidth="1.5"/>
                      <path d="M55 45 L50 35" stroke="#C5B358" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>
              </div>
              <span className="text-xl lg:text-2xl font-bold text-[#EAEAEA] group-hover:text-[#C5B358] transition-colors duration-300">
                Automatía
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`relative group text-[#EAEAEA]/90 hover:text-[#EAEAEA] transition-colors duration-200 font-medium ${
                    item.href === "/" ? "text-[#C5B358] font-semibold" : ""
                  }`}
                >
                  {item.label}
                  {item.href === "/" && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C5B358] rounded-full"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C5B358] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Auth & Theme */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            
            <div className="flex items-center space-x-2">
              <Button
                asChild
                variant="ghost"
                className="text-[#EAEAEA] hover:text-[#C5B358] hover:bg-[#C5B358]/10"
              >
                <Link href="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Link>
              </Button>
              
              <Button
                asChild
                className="bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/registro">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrarse
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#EAEAEA] hover:text-[#C5B358] hover:bg-[#C5B358]/10"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4 border-t border-[#C5B358]/20 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-[#EAEAEA]/90 hover:text-[#C5B358] transition-colors duration-200 ${
                      item.href === "/" ? "text-[#C5B358] font-semibold" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-[#C5B358]/20 space-y-3">
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start text-[#EAEAEA] hover:text-[#C5B358] hover:bg-[#C5B358]/10"
                  >
                    <Link href="/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    className="w-full justify-start bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358]"
                  >
                    <Link href="/registro">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Registrarse
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
