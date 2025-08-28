"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, Smartphone } from "lucide-react"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      console.log('PWA was installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  if (isInstalled || !showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-gradient-to-r from-[#0A1C2F] to-[#0f0f0f] border border-[#C5B358]/30 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-[#0A1C2F]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-[#EAEAEA] mb-1">
              Instalar Automatía
            </h3>
            <p className="text-sm text-[#EAEAEA]/80 mb-3">
              Accede más rápido y recibe notificaciones importantes
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] px-4 py-2 text-sm font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Instalar
              </Button>
              
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="border-[#C5B358]/30 text-[#EAEAEA] hover:bg-[#C5B358]/10 px-4 py-2 text-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Más tarde
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-[#EAEAEA]/60 hover:text-[#EAEAEA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}







