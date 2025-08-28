"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  Brain, 
  MessageCircle,
  Headphones,
  Target,
  TrendingUp,
  Crown,
  Star,
  Zap,
  Shield,
  Sparkles,
  Rocket
} from "lucide-react"
import { useState, useEffect } from "react"

export default function ChatbotWhatsAppClient() {
  const [clientCount, setClientCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const whatsappMessage = encodeURIComponent("Hola! Me gustaría contratar el asistente de IA para WhatsApp 🤖")
  const whatsappUrl = `https://wa.me/5493416115981?text=${whatsappMessage}`

  // Contador animado de clientes
  useEffect(() => {
    const timer = setInterval(() => {
      setClientCount(prev => {
        if (prev < 127) return prev + 1
        return prev
      })
    }, 50)
    return () => clearInterval(timer)
  }, [])

  // Animación de entrada
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Rotación de testimonios
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "María González",
      company: "Restaurante La Parrilla",
      text: "El asistente de IA nos ayudó a aumentar las reservas en un 300% en solo 2 meses. ¡Es como tener un vendedor súper inteligente 24/7!",
      avatar: "👩‍🍳"
    },
    {
      name: "Carlos Mendoza",
      company: "Gimnasio PowerFit",
      text: "Automatizamos el 80% de las consultas. Nuestros clientes están súper satisfechos porque sienten que hablan con alguien real.",
      avatar: "💪"
    },
    {
      name: "Ana Silva",
      company: "Salón de Belleza Glamour",
      text: "El ROI fue inmediato. En 30 días ya habíamos recuperado la inversión. Es como tener un empleado perfecto que nunca duerme.",
      avatar: "💄"
    }
  ]

  const features = [
    {
      icon: Brain,
      title: "Asistente de WhatsApp con IA",
      description: "No es un bot común. Es un asistente inteligente que piensa, responde y convierte. Tu negocio presente en el WhatsApp de cada cliente, 24/7.",
      highlight: "Cerebro central de IA"
    },
    {
      icon: MessageCircle,
      title: "Atención ultra-humana, sin humanos",
      description: "Conversaciones naturales, personalizadas y siempre disponibles. Tus clientes sentirán que hablan con alguien de tu equipo… aunque todo sea IA.",
      highlight: "Indistinguible de humano"
    },
    {
      icon: TrendingUp,
      title: "Escala sin límites",
      description: "Podés atender a 10 o 10.000 clientes al mismo tiempo, sin perder calidad. Automatía crece con vos, sin barreras ni horarios.",
      highlight: "Crecimiento infinito"
    },
    {
      icon: Zap,
      title: "Procesos invisibles, resultados visibles",
      description: "Mientras atiende clientes, Automatía llena tu Google Sheets, conecta con tu CRM y dispara automatizaciones. Todo fluye, vos solo ves las ventas crecer.",
      highlight: "Automatización total"
    },
    {
      icon: Target,
      title: "Métricas que hablan de futuro",
      description: "No solo atiende: mide, analiza y predice. Tenés un tablero con datos en tiempo real para entender cómo evoluciona tu negocio.",
      highlight: "Data de nivel CEO"
    },
    {
      icon: Rocket,
      title: "Tu asistente listo en 48h",
      description: "En menos de dos días, tu empresa deja de estar en el pasado y entra al futuro: con un asistente de IA entrenado para tu marca.",
      highlight: "Implementación ultra-rápida"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] via-[#0f0f0f] to-[#0A1C2F] pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C5B358]/10 via-transparent to-[#FFD700]/10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] border-0 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold animate-bounce">
            <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Producto Oficial
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2">
            <span className="bg-gradient-to-r from-[#C5B358] via-[#FFD700] to-[#C5B358] bg-clip-text text-transparent">
              Chatbot de WhatsApp con IA
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-[#EAEAEA]/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4">
            Tu asistente corporativo que atiende, automatiza y vende
          </p>

          {/* Stats Counter */}
          <div className={`mb-8 sm:mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="inline-flex items-center space-x-8 p-6 rounded-2xl bg-[#0A1C2F]/50 backdrop-blur-sm border border-[#C5B358]/20">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#C5B358]">{clientCount}+</div>
                <div className="text-sm text-[#EAEAEA]/70">Empresas en el futuro</div>
              </div>
              <div className="w-px h-12 bg-[#C5B358]/30"></div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#C5B358]">99.9%</div>
                <div className="text-sm text-[#EAEAEA]/70">Disponibilidad</div>
              </div>
              <div className="w-px h-12 bg-[#C5B358]/30"></div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#C5B358]">48h</div>
                <div className="text-sm text-[#EAEAEA]/70">Al futuro</div>
              </div>
            </div>
          </div>
          
          <div className={`flex justify-center mb-8 sm:mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Button 
              asChild
              className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#F7931E] hover:to-[#FF6B35] text-white px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 animate-pulse"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                🔥 Contratar ahora
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Plan Card */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#C5B358]/20 via-[#FFD700]/10 to-[#C5B358]/20 border-2 border-[#C5B358]/30 shadow-2xl overflow-hidden hover:shadow-[#C5B358]/20 transition-all duration-500">
              {/* Header */}
              <div className="relative z-10 text-center mb-8 sm:mb-12">
                <Badge className="mb-4 bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] border-0 px-4 py-2 text-lg font-bold animate-pulse">
                  <Star className="w-4 h-4 mr-2" />
                  Plan Completo
                </Badge>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-4">
                  Todo Incluido
                </h2>
                
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#C5B358] animate-pulse">$500</span>
                  <span className="text-2xl sm:text-3xl text-[#EAEAEA]/70">/mes</span>
                </div>
                
                <p className="text-lg sm:text-xl text-[#EAEAEA]/80 max-w-2xl mx-auto">
                  Sin límites, sin sorpresas. Todo el poder de la IA para hacer crecer tu negocio
                </p>
              </div>

              {/* Features Grid */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                {features.map((feature, index) => (
                  <div 
                    key={feature.title}
                    className="flex items-start space-x-4 p-4 rounded-2xl bg-[#0A1C2F]/50 backdrop-blur-sm border border-[#C5B358]/20 hover:border-[#C5B358]/50 hover:bg-[#0A1C2F]/70 transition-all duration-300 transform hover:scale-105 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-5 h-5 text-[#0A1C2F]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#EAEAEA] mb-2">{feature.title}</h3>
                      <p className="text-[#EAEAEA]/80 text-sm mb-2">{feature.description}</p>
                      <span className="inline-block px-2 py-1 bg-[#C5B358]/20 text-[#C5B358] text-xs rounded-full font-medium">
                        {feature.highlight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="relative z-10 text-center">
                <div className="mb-6">
                  <p className="text-lg text-[#EAEAEA]/90 mb-4">
                    ¿Listo para el salto cuántico?
                  </p>
                  <p className="text-sm text-[#C5B358] font-semibold">
                    Sin contratos largos • Cancelación en cualquier momento
                  </p>
                </div>

                <Button
                  asChild
                  className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#F7931E] hover:to-[#FF6B35] text-white px-10 sm:px-16 py-4 sm:py-5 text-xl sm:text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 animate-pulse"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Sparkles className="w-6 h-6 mr-3" />
                    🔥 ¡Empezar Ahora!
                  </a>
                </Button>

                <p className="text-sm text-[#EAEAEA]/60 mt-4">
                  Te responderemos en menos de 1 hora
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copy General Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#C5B358]/20 to-[#FFD700]/20 border-2 border-[#C5B358]/30">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-6">
                Automatía no es un bot.
              </h2>
              <p className="text-lg sm:text-xl text-[#EAEAEA]/80 mb-6 max-w-3xl mx-auto">
                Es tu asistente corporativo de IA en WhatsApp, entrenado en tu negocio, que atiende sin límites, automatiza procesos y te da métricas de nivel CEO.
              </p>
              <p className="text-lg sm:text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto">
                En 48h tu empresa puede tener lo que otras recién están soñando: un sistema de IA que nunca duerme, nunca se cansa y siempre vende.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-4 sm:mb-6">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg sm:text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto">
              Empresas reales que transformaron su negocio con Automatía
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#C5B358]/10 to-[#FFD700]/10 border border-[#C5B358]/30">
              <div className="text-center">
                <div className="text-6xl mb-6 animate-bounce">{testimonials[currentTestimonial].avatar}</div>
                <blockquote className="text-xl sm:text-2xl text-[#EAEAEA] mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="text-[#C5B358] font-semibold text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-[#EAEAEA]/70">
                  {testimonials[currentTestimonial].company}
                </div>
              </div>

              {/* Testimonial Navigation */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-[#C5B358] scale-125'
                        : 'bg-[#C5B358]/30 hover:bg-[#C5B358]/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-4 sm:mb-6">
              ¿Por qué elegir Automatía?
            </h2>
            <p className="text-lg sm:text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto">
              Somos diferentes porque entendemos que la tecnología debe servir al negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#C5B358]/10 to-[#FFD700]/10 border border-[#C5B358]/30 hover:border-[#C5B358]/50 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-4">Rápido</h3>
              <p className="text-[#EAEAEA]/80">
                Tu asistente funcionando en 48 horas, no en meses
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#C5B358]/10 to-[#FFD700]/10 border border-[#C5B358]/30 hover:border-[#C5B358]/50 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-4">Confiable</h3>
              <p className="text-[#EAEAEA]/80">
                99.9% de disponibilidad garantizada para tu negocio
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#C5B358]/10 to-[#FFD700]/10 border border-[#C5B358]/30 hover:border-[#C5B358]/50 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-4">Efectivo</h3>
              <p className="text-[#EAEAEA]/80">
                ROI medible desde el primer mes de uso
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#C5B358]/20 to-[#FFD700]/20 border-2 border-[#C5B358]/30">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-6">
                Calcula tu ROI
              </h2>
              <p className="text-lg sm:text-xl text-[#EAEAEA]/80 mb-8 max-w-2xl mx-auto">
                Descubre cuánto puedes ahorrar y ganar con Automatía
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-[#0A1C2F]/50 border border-[#C5B358]/20">
                  <div className="text-3xl font-bold text-[#C5B358] mb-2">$2,500</div>
                  <div className="text-[#EAEAEA]/80">Ahorro mensual en personal</div>
                </div>
                <div className="p-6 rounded-2xl bg-[#0A1C2F]/50 border border-[#C5B358]/20">
                  <div className="text-3xl font-bold text-[#C5B358] mb-2">$5,000</div>
                  <div className="text-[#EAEAEA]/80">Ventas adicionales mensuales</div>
                </div>
                <div className="p-6 rounded-2xl bg-[#0A1C2F]/50 border border-[#C5B358]/20">
                  <div className="text-3xl font-bold text-[#C5B358] mb-2">$7,500</div>
                  <div className="text-[#EAEAEA]/80">ROI mensual total</div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-[#C5B358] font-semibold mb-4">
                  Inversión: $500/mes • Retorno: $7,500/mes
                </p>
                <p className="text-sm text-[#EAEAEA]/60">
                  Basado en el promedio de nuestros clientes activos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#C5B358]/20 to-[#FFD700]/20 border-2 border-[#C5B358]/30">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-6">
                ¿Tienes dudas?
              </h2>
              <p className="text-lg sm:text-xl text-[#EAEAEA]/80 mb-8 max-w-2xl mx-auto">
                Nuestro equipo está listo para responder todas tus preguntas y ayudarte a elegir la mejor estrategia
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#F7931E] hover:to-[#FF6B35] text-white px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    🔥 Hablar por WhatsApp
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-[#C5B358] text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0A1C2F] px-8 py-4 text-lg font-bold transition-all duration-300"
                >
                  <a href="mailto:contacto@automatia.store?subject=Consulta%20sobre%20Chatbot%20WhatsApp&body=Hola,%20me%20gustaría%20saber%20más%20sobre%20el%20Chatbot%20de%20WhatsApp%20de%20Automatía" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Enviar Email
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}






