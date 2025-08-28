"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, MessageSquare, MapPin, CheckCircle, AlertCircle, Phone, Clock, User, Loader2 } from "lucide-react"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Debes seleccionar un asunto"
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es requerido"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "El mensaje debe tener al menos 10 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setMessageSent(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
        setErrors({})
      } else {
        setErrorMessage(result.message || "Error al enviar el mensaje")
      }
    } catch (error) {
      console.error("Error enviando formulario:", error)
      setErrorMessage("Error de conexión. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const subjects = [
    "Consulta General",
    "Demo de la Plataforma",
    "Cotización de Servicios",
    "Soporte Técnico",
    "Colaboración Comercial",
    "Otro"
  ]

  if (messageSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] via-[#0f0f0f] to-[#0A1C2F] pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-[#0A1C2F]" />
            </div>
            <h1 className="text-4xl font-bold text-[#EAEAEA] mb-6">
              ¡Mensaje Enviado!
            </h1>
            <p className="text-xl text-[#EAEAEA]/80 mb-8">
              Gracias por contactarnos. Te responderemos en menos de 24 horas.
            </p>
            <Button 
              onClick={() => setMessageSent(false)}
              className="bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] px-8 py-3 text-lg font-semibold"
            >
              Enviar Otro Mensaje
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] via-[#0f0f0f] to-[#0A1C2F] pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2">
            <span className="bg-gradient-to-r from-[#C5B358] via-[#FFD700] to-[#C5B358] bg-clip-text text-transparent">
              CONTACTO
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-[#EAEAEA]/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4">
            ¿Tienes preguntas sobre Automatía? ¿Quieres saber cómo podemos ayudarte a automatizar tu negocio?
          </p>
          
          <p className="text-lg text-[#EAEAEA]/70 max-w-3xl mx-auto px-4">
            Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Formulario */}
              <div>
                <Card className="bg-[#0f0f0f]/50 border-[#C5B358]/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#EAEAEA] flex items-center">
                      <MessageSquare className="w-6 h-6 mr-3 text-[#C5B358]" />
                      Envíanos un mensaje
                    </CardTitle>
                    <CardDescription className="text-[#EAEAEA]/70">
                      Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Nombre y Email en la misma fila */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-[#EAEAEA]">
                            Nombre completo
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Tu nombre"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className={`mt-2 bg-[#0A1C2F]/50 border-[#C5B358]/30 text-[#EAEAEA] placeholder-[#EAEAEA]/50 focus:border-[#C5B358] focus:ring-[#C5B358]/20 ${
                              errors.name ? "border-red-500" : ""
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-[#EAEAEA]">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={`mt-2 bg-[#0A1C2F]/50 border-[#C5B358]/30 text-[#EAEAEA] placeholder-[#EAEAEA]/50 focus:border-[#C5B358] focus:ring-[#C5B358]/20 ${
                              errors.email ? "border-red-500" : ""
                            }`}
                          />
                          {errors.email && (
                            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      {/* Asunto */}
                      <div>
                        <Label htmlFor="subject" className="text-[#EAEAEA]">
                          Asunto
                        </Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => handleInputChange("subject", value)}
                        >
                          <SelectTrigger className={`mt-2 bg-[#0A1C2F]/50 border-[#C5B358]/30 text-[#EAEAEA] focus:border-[#C5B358] focus:ring-[#C5B358]/20 ${
                            errors.subject ? "border-red-500" : ""
                          }`}>
                            <SelectValue placeholder="Selecciona un asunto" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0A1C2F] border-[#C5B358]/30">
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject} className="text-[#EAEAEA] hover:bg-[#C5B358]/20">
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.subject && (
                          <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
                        )}
                      </div>

                      {/* Mensaje */}
                      <div>
                        <Label htmlFor="message" className="text-[#EAEAEA]">
                          Mensaje
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Cuéntanos más sobre tu consulta..."
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          rows={6}
                          className={`mt-2 bg-[#0A1C2F]/50 border-[#C5B358]/30 text-[#EAEAEA] placeholder-[#EAEAEA]/50 focus:border-[#C5B358] focus:ring-[#C5B358]/20 resize-none ${
                            errors.message ? "border-red-500" : ""
                          }`}
                        />
                        {errors.message && (
                          <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                        )}
                      </div>

                      {/* Error Message */}
                      {errorMessage && (
                        <Alert className="border-red-500 bg-red-500/10">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <AlertDescription className="text-red-400">
                            {errorMessage}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5 mr-2" />
                            Enviar Mensaje
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Información de Contacto */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-[#EAEAEA] mb-6">
                    Información de Contacto
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="w-6 h-6 text-[#0A1C2F]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#EAEAEA] mb-1">Ubicación</h4>
                        <p className="text-[#EAEAEA]/80">Rosario, Santa Fe, Argentina</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <Mail className="w-6 h-6 text-[#0A1C2F]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#EAEAEA] mb-1">Email</h4>
                        <p className="text-[#EAEAEA]/80">contacto@automatia.store</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <Phone className="w-6 h-6 text-[#0A1C2F]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#EAEAEA] mb-1">Teléfono</h4>
                        <p className="text-[#EAEAEA]/80">+54 9 341 XXX XXXX</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#0A1C2F]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#EAEAEA] mb-1">Horarios de Atención</h4>
                        <p className="text-[#EAEAEA]/80">Lun - Vie: 9:00 - 18:00</p>
                        <p className="text-[#EAEAEA]/80">Sáb: 9:00 - 13:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#C5B358]/10 to-[#FFD700]/10 border border-[#C5B358]/30">
                  <h4 className="text-xl font-semibold text-[#EAEAEA] mb-3">
                    ¿Por qué elegir Automatía?
                  </h4>
                  <ul className="space-y-2 text-[#EAEAEA]/80">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C5B358] mr-2 flex-shrink-0" />
                      Respuesta en menos de 24 horas
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C5B358] mr-2 flex-shrink-0" />
                      Soporte técnico especializado
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C5B358] mr-2 flex-shrink-0" />
                      Soluciones personalizadas para tu negocio
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C5B358] mr-2 flex-shrink-0" />
                      Implementación en menos de 48 horas
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
