import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Brain, Users, Award, Globe, Rocket, Shield, Zap, CheckCircle, ArrowRight, Star, MessageCircle, Headphones, Target, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] via-[#0f0f0f] to-[#0A1C2F] pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C5B358]/10 via-transparent to-[#FFD700]/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] border-0 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold">
            <Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Lanzamiento Oficial 2024
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2">
            <span className="bg-gradient-to-r from-[#C5B358] via-[#FFD700] to-[#C5B358] bg-clip-text text-transparent">
              AUTOMATÍA
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-[#EAEAEA]/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4">
            La Inteligencia Artificial que automatiza tu negocio en WhatsApp
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Empezar por USD 500/mes
            </Button>
            <Button 
              className="w-full sm:w-auto border-[#C5B358] text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0A1C2F] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-2 font-semibold transition-all duration-300"
              asChild
            >
              <a href="mailto:contacto@automatia.store?subject=Consulta%20desde%20web&body=Hola%20Valentín,%20me%20gustaría%20hablar%20contigo%20sobre%20Automatía" target="_blank" rel="noopener noreferrer">
                <Bot className="w-4 h-4 sm:w-5 sm:w-5 mr-2" />
                Hablar con Valentín
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto px-4">
            <div className="text-center p-4 sm:p-6 rounded-2xl bg-[#0f0f0f]/50 backdrop-blur-sm border border-[#C5B358]/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#EAEAEA] mb-1 sm:mb-2">48h</h3>
              <p className="text-[#EAEAEA]/80 text-sm sm:text-base">Implementación</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 rounded-2xl bg-[#0f0f0f]/50 backdrop-blur-sm border border-[#C5B358]/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#EAEAEA] mb-1 sm:mb-2">99.9%</h3>
              <p className="text-[#EAEAEA]/80 text-sm sm:text-base">Uptime</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 rounded-2xl bg-[#0f0f0f]/50 backdrop-blur-sm border border-[#C5B358]/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center mx-auto mb-3 sm:mb-4">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#EAEAEA] mb-1 sm:mb-2">24/7</h3>
              <p className="text-[#EAEAEA]/80 text-sm sm:text-base">Soporte</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-4 sm:mb-6 px-4">
              ¿Por qué elegir Automatía?
            </h2>
            <p className="text-lg sm:text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto px-4">
              Somos diferentes porque entendemos que la tecnología debe servir al negocio, no al revés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#C5B358]/10 to-[#FFD700]/10 border border-[#C5B358]/30 hover:border-[#C5B358]/50 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-3 sm:mb-4">IA de Vanguardia</h3>
              <p className="text-[#EAEAEA]/80 mb-4 sm:mb-6 text-sm sm:text-base">
                Utilizamos GPT-4 y Gemini, los modelos de IA más avanzados del mundo, 
                para crear conversaciones naturales e inteligentes.
              </p>
              <div className="flex items-center text-[#C5B358] font-semibold text-sm sm:text-base">
                <span>Saber más</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#C5B358]/10 to-[#FFD700]/10 border border-[#C5B358]/30 hover:border-[#C5B358]/50 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-3 sm:mb-4">Implementación Rápida</h3>
              <p className="text-[#EAEAEA]/80 mb-4 sm:mb-6 text-sm sm:text-base">
                Tu bot estará funcionando en 48 horas, no en meses. 
                Resultados inmediatos y ROI desde el primer día.
              </p>
              <div className="flex items-center text-[#C5B358] font-semibold text-sm sm:text-base">
                <span>Saber más</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#C5B358]/10 to-[#FFD700]/10 border border-[#C5B358]/30 hover:border-[#C5B358]/50 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-3 sm:mb-4">Experiencia Local</h3>
              <p className="text-[#EAEAEA]/80 mb-4 sm:mb-6 text-sm sm:text-base">
                Nacimos en Argentina y entendemos las necesidades específicas 
                del mercado latinoamericano.
              </p>
              <div className="flex items-center text-[#C5B358] font-semibold text-sm sm:text-base">
                <span>Saber más</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#C5B358]/10 to-[#FFD700]/10 border border-[#C5B358]/30 hover:border-[#C5B358]/50 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-3 sm:mb-4">Soporte en Español</h3>
              <p className="text-[#EAEAEA]/80 mb-4 sm:mb-6 text-sm sm:text-base">
                Todo nuestro soporte y documentación está en español, 
                sin barreras de idioma.
              </p>
              <div className="flex items-center text-[#C5B358] font-semibold text-sm sm:text-base">
                <span>Saber más</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#C5B358]/10 to-[#FFD700]/10 border border-[#C5B358]/30 hover:border-[#C5B358]/50 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-3 sm:mb-4">Personalización Total</h3>
              <p className="text-[#EAEAEA]/80 mb-4 sm:mb-6 text-sm sm:text-base">
                Adaptamos cada bot a tu marca, productos y estilo de comunicación. 
                No hay dos bots iguales.
              </p>
              <div className="flex items-center text-[#C5B358] font-semibold text-sm sm:text-base">
                <span>Saber más</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#C5B358]/10 to-[#FFD700]/10 border border-[#C5B358]/30 hover:border-[#C5B358]/50 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A1C2F]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-3 sm:mb-4">ROI Garantizado</h3>
              <p className="text-[#EAEAEA]/80 mb-4 sm:mb-6 text-sm sm:text-base">
                Nuestros clientes ven retornos de inversión en los primeros 30 días 
                de implementación.
              </p>
              <div className="flex items-center text-[#C5B358] font-semibold text-sm sm:text-base">
                <span>Saber más</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0f0f0f]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-4 sm:mb-6 px-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-lg sm:text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto px-4">
              En solo 3 pasos simples, tu negocio estará automatizado con IA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="text-center relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-[#0A1C2F]">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-3 sm:mb-4">Configuración</h3>
              <p className="text-[#EAEAEA]/80 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                Cuéntanos sobre tu negocio, productos y estilo de comunicación. 
                Nos encargamos de todo.
              </p>
              <div className="w-full h-1 bg-gradient-to-r from-[#C5B358] to-[#FFD700] rounded-full hidden md:block"></div>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-[#0A1C2F]">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-3 sm:mb-4">Entrenamiento</h3>
              <p className="text-[#EAEAEA]/80 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                Nuestro equipo entrena la IA con tu información específica 
                para respuestas precisas y personalizadas.
              </p>
              <div className="w-full h-1 bg-gradient-to-r from-[#C5B358] to-[#FFD700] rounded-full hidden md:block"></div>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-[#0A1C2F]">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-3 sm:mb-4">¡Listo!</h3>
              <p className="text-[#EAEAEA]/80 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                Tu bot está activo y respondiendo a clientes 24/7. 
                Monitoreamos y optimizamos continuamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-4 sm:mb-6 px-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg sm:text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto px-4">
              Empresas que ya transformaron su comunicación con Automatía
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0f0f]/50 backdrop-blur-sm border border-[#C5B358]/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5B358] fill-current" />
                ))}
              </div>
              <p className="text-[#EAEAEA]/90 mb-4 sm:mb-6 text-sm sm:text-base">
                "Automatía revolucionó nuestro servicio al cliente. Los clientes están 
                más satisfechos y nuestro equipo puede enfocarse en casos complejos."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-[#0A1C2F] font-bold text-sm sm:text-base">MC</span>
                </div>
                <div>
                  <p className="text-[#EAEAEA] font-semibold text-sm sm:text-base">María Castro</p>
                  <p className="text-[#EAEAEA]/60 text-xs sm:text-sm">CEO, TechSolutions</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0f0f]/50 backdrop-blur-sm border border-[#C5B358]/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5B358] fill-current" />
                ))}
              </div>
              <p className="text-[#EAEAEA]/90 mb-4 sm:mb-6 text-sm sm:text-base">
                "Implementación en 2 días y resultados inmediatos. Nuestras ventas 
                aumentaron 40% en el primer mes."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-[#0A1C2F] font-bold text-sm sm:text-base">JL</span>
                </div>
                <div>
                  <p className="text-[#EAEAEA] font-semibold text-sm sm:text-base">Juan López</p>
                  <p className="text-[#EAEAEA]/60 text-xs sm:text-sm">Director, RetailPro</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0f0f]/50 backdrop-blur-sm border border-[#C5B358]/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5B358] fill-current" />
                ))}
              </div>
              <p className="text-[#EAEAEA]/90 mb-4 sm:mb-6 text-sm sm:text-base">
                "El soporte es excepcional. Valentín y su equipo están siempre 
                disponibles para ayudarnos a optimizar el bot."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-[#0A1C2F] font-bold text-sm sm:text-base">AS</span>
                </div>
                <div>
                  <p className="text-[#EAEAEA] font-semibold text-sm sm:text-base">Ana Silva</p>
                  <p className="text-[#EAEAEA]/60 text-xs sm:text-sm">CTO, StartupXYZ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#C5B358]/10 to-[#FFD700]/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-4 sm:mb-6 px-4">
            ¿Listo para automatizar tu negocio?
          </h2>
          <p className="text-lg sm:text-xl text-[#EAEAEA]/80 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Únete a cientos de empresas que ya están ahorrando tiempo y dinero con Automatía
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Comenzar Gratis
            </Button>
            <Button className="w-full sm:w-auto border-[#EAEAEA] text-[#EAEAEA] hover:bg-[#EAEAEA] hover:text-[#0A1C2F] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-2 font-semibold transition-all duration-300">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Hablar con Expertos
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
