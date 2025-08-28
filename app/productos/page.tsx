import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  Brain, 
  MessageCircle,
  Zap,
  Rocket,
  Sparkles,
  ArrowRight,
  Crown
} from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Productos Automatía | Ecosistema de IA",
  description: "Automatía es un ecosistema de IA. Descubre nuestro Chatbot de WhatsApp: responde, automatiza y vende por ti, por solo 500 USD/mes.",
  keywords: "IA para negocios, WhatsApp con inteligencia artificial, chatbot avanzado que vende, automatización empresarial con IA",
  openGraph: {
    title: "Productos Automatía | Ecosistema de IA",
    description: "Automatía es un ecosistema de IA. Descubre nuestro Chatbot de WhatsApp: responde, automatiza y vende por ti, por solo 500 USD/mes.",
    type: "website",
    url: "https://automatia.store/productos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Productos Automatía | Ecosistema de IA",
    description: "Automatía es un ecosistema de IA. Descubre nuestro Chatbot de WhatsApp: responde, automatiza y vende por ti, por solo 500 USD/mes.",
  },
}

export default function ProductosPage() {
  const products = [
    {
      id: "chatbot-whatsapp",
      name: "Chatbot de WhatsApp con IA",
      description: "Tu asistente corporativo que atiende, automatiza y vende. Respuestas inteligentes 24/7 con IA de vanguardia.",
      price: "$500/mes",
      features: [
        "Asistente de IA indistinguible de humano",
        "Escalabilidad sin límites",
        "Automatización de procesos",
        "Métricas de nivel CEO",
        "Implementación en 48h"
      ],
      icon: MessageCircle,
      status: "disponible",
      badge: "Producto Oficial",
      color: "from-[#25D366] to-[#128C7E]",
      href: "/productos/chatbot-whatsapp"
    }
  ]

  const upcomingProducts = [
    {
      name: "Automatía Fitness",
      description: "Sistema de IA especializado para gimnasios y centros deportivos. Gestión de membresías, entrenamientos personalizados y engagement automático.",
      icon: Zap,
      status: "próximamente"
    },
    {
      name: "Automatía OS",
      description: "Sistema operativo de IA para empresas. Automatización integral de procesos, análisis predictivo y toma de decisiones inteligente.",
      icon: Brain,
      status: "próximamente"
    },
    {
      name: "Auditorías de IA",
      description: "Servicio de auditoría y optimización de sistemas de IA existentes. Mejora el rendimiento y ROI de tus implementaciones de inteligencia artificial.",
      icon: Crown,
      status: "próximamente"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] via-[#0f0f0f] to-[#0A1C2F] pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C5B358]/10 via-transparent to-[#FFD700]/10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] border-0 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold animate-bounce">
            <Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Ecosistema de IA
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2">
            <span className="bg-gradient-to-r from-[#C5B358] via-[#FFD700] to-[#C5B358] bg-clip-text text-transparent">
              Productos Automatía
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-[#EAEAEA]/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4">
            Más que un chatbot. Un ecosistema completo de soluciones de IA para transformar tu negocio
          </p>

          <div className="mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-8 p-6 rounded-2xl bg-[#0A1C2F]/50 backdrop-blur-sm border border-[#C5B358]/20">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#C5B358]">1</div>
                <div className="text-sm text-[#EAEAEA]/70">Producto Disponible</div>
              </div>
              <div className="w-px h-12 bg-[#C5B358]/30"></div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#C5B358]">3+</div>
                <div className="text-sm text-[#EAEAEA]/70">Próximamente</div>
              </div>
              <div className="w-px h-12 bg-[#C5B358]/30"></div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#C5B358]">∞</div>
                <div className="text-sm text-[#EAEAEA]/70">Posibilidades</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Products */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-4 sm:mb-6">
              Productos Disponibles
            </h2>
            <p className="text-lg sm:text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto">
              Soluciones de IA que ya están transformando negocios reales
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#C5B358]/20 via-[#FFD700]/10 to-[#C5B358]/20 border-2 border-[#C5B358]/30 shadow-2xl overflow-hidden hover:shadow-[#C5B358]/20 transition-all duration-500 group"
                >
                  {/* Status Badge */}
                  <div className="absolute top-6 right-6 z-20">
                    <Badge className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white border-0 px-3 py-1 text-sm font-semibold">
                      {product.badge}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Column - Info */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <product.icon className="w-8 h-8 text-[#0A1C2F]" />
                        </div>
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-[#EAEAEA]">{product.name}</h3>
                          <p className="text-[#EAEAEA]/80">{product.description}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-[#C5B358] rounded-full"></div>
                            <span className="text-[#EAEAEA]/90 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-[#C5B358]">{product.price}</div>
                        <Button asChild className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#F7931E] hover:to-[#FF6B35] text-white px-6 py-3 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                          <Link href={product.href}>
                            Ver más <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Right Column - Visual */}
                    <div className="relative">
                      <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0A1C2F]/50 to-[#0A1C2F]/30 border border-[#C5B358]/20">
                        <div className="text-center">
                          <div className="text-6xl mb-4 animate-bounce">🤖</div>
                          <h4 className="text-xl font-semibold text-[#EAEAEA] mb-2">Disponible Ahora</h4>
                          <p className="text-[#EAEAEA]/70 text-sm">Implementación en 48 horas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Products */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-4 sm:mb-6">
              🚀 Próximamente
            </h2>
            <p className="text-lg sm:text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto">
              Esto es solo el comienzo. Automatía pronto lanzará más soluciones de IA para transformar tu negocio
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {upcomingProducts.map((product, index) => (
                <div 
                  key={index}
                  className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0A1C2F]/50 to-[#0A1C2F]/30 border border-[#C5B358]/20 hover:border-[#C5B358]/40 transition-all duration-300 transform hover:scale-105 group"
                >
                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] border-0 px-2 py-1 text-xs font-semibold">
                      Próximamente
                    </Badge>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#C5B358]/30 to-[#FFD700]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <product.icon className="w-8 h-8 text-[#C5B358]" />
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-4">{product.name}</h3>
                    <p className="text-[#EAEAEA]/80 text-sm mb-6">{product.description}</p>
                    
                    <div className="inline-flex items-center space-x-2 text-[#C5B358] text-sm font-semibold">
                      <Sparkles className="w-4 h-4" />
                      <span>En desarrollo</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#C5B358]/20 to-[#FFD700]/20 border-2 border-[#C5B358]/30">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-6">
                El futuro de la automatización
              </h2>
              <p className="text-lg sm:text-xl text-[#EAEAEA]/80 mb-6 max-w-3xl mx-auto">
                Automatía no es solo un chatbot. Es un ecosistema completo de soluciones de IA diseñadas para transformar la forma en que los negocios operan, crecen y se conectan con sus clientes.
              </p>
              <p className="text-lg sm:text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto">
                Desde WhatsApp hasta sistemas operativos empresariales, estamos construyendo el futuro de la automatización inteligente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#C5B358]/20 to-[#FFD700]/20 border-2 border-[#C5B358]/30">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-6">
                ¿Listo para el futuro?
              </h2>
              <p className="text-lg sm:text-xl text-[#EAEAEA]/80 mb-8 max-w-2xl mx-auto">
                Comienza con nuestro Chatbot de WhatsApp y prepárate para el ecosistema completo de Automatía
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:from-[#F7931E] hover:to-[#FF6B35] text-white px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link href="/productos/chatbot-whatsapp">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    🔥 Ver Chatbot de WhatsApp
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-[#C5B358] text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0A1C2F] px-8 py-4 text-lg font-bold transition-all duration-300"
                >
                  <Link href="/contacto">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Consultar sobre futuros productos
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
