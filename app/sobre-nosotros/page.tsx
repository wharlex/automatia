import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Brain, Users, Award, Globe, Rocket, Shield, Zap, CheckCircle, ArrowRight, Star, MessageCircle, Headphones, Target, TrendingUp, MapPin, Phone, Mail, Clock, CheckSquare, Lightbulb, Code, Database, Cloud, Zap as ZapIcon, User, MessageSquare } from "lucide-react"

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] via-[#0f0f0f] to-[#0A1C2F] pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] border-0 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold">
            <Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Nuestra Historia
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2">
            <span className="bg-gradient-to-r from-[#C5B358] via-[#FFD700] to-[#C5B358] bg-clip-text text-transparent">
              SOBRE NOSOTROS
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-[#EAEAEA]/90 mb-6 sm:mb-8 max-w-4xl mx-auto px-4">
            Somos una empresa argentina que nació en Rosario con la misión de democratizar la Inteligencia Artificial para las empresas latinoamericanas
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Contactar
            </Button>
            <Button className="w-full sm:w-auto border-[#C5B358] text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0A1C2F] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-2 font-semibold transition-all duration-300">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EAEAEA] mb-6">
              Nuestra Misión
            </h2>
            <p className="text-lg sm:text-xl text-[#EAEAEA]/80 leading-relaxed">
              Transformar la forma en que las empresas latinoamericanas interactúan con sus clientes a través de la Inteligencia Artificial. 
              Queremos que cada negocio, sin importar su tamaño, pueda acceder a tecnología de vanguardia que antes solo estaba disponible para grandes corporaciones.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 sm:py-20 bg-[#0f0f0f]/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] border-0 px-3 py-1 text-sm font-semibold">
                  <Star className="w-3 h-3 mr-2" />
                  Fundador & CEO
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EAEAEA] mb-6">
                  Valentín Rodríguez
                </h2>
                <p className="text-lg text-[#EAEAEA]/80 mb-6 leading-relaxed">
                  Apasionado por la tecnología y la innovación, Valentín comenzó su carrera en el mundo del desarrollo de software y la inteligencia artificial. 
                  Con más de 8 años de experiencia en el sector tecnológico, ha trabajado en proyectos de machine learning, automatización de procesos y desarrollo de chatbots empresariales.
                </p>
                <p className="text-lg text-[#EAEAEA]/80 mb-6 leading-relaxed">
                  Su visión siempre fue clara: hacer que la IA sea accesible y útil para las empresas latinoamericanas. 
                  Después de trabajar con grandes empresas y startups tecnológicas, decidió fundar Automatía para democratizar esta tecnología.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl bg-[#0A1C2F]/50 border border-[#C5B358]/20">
                    <div className="text-2xl font-bold text-[#C5B358] mb-1">8+</div>
                    <div className="text-sm text-[#EAEAEA]/70">Años de Experiencia</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-[#0A1C2F]/50 border border-[#C5B358]/20">
                    <div className="text-2xl font-bold text-[#C5B358] mb-1">50+</div>
                    <div className="text-sm text-[#EAEAEA]/70">Proyectos IA</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[#C5B358]/20 text-[#C5B358] border-[#C5B358]/30">
                    <Code className="w-3 h-3 mr-1" />
                    Full-Stack Developer
                  </Badge>
                  <Badge className="bg-[#C5B358]/20 text-[#C5B358] border-[#C5B358]/30">
                    <Brain className="w-3 h-3 mr-1" />
                    Machine Learning
                  </Badge>
                  <Badge className="bg-[#C5B358]/20 text-[#C5B358] border-[#C5B358]/30">
                    <Database className="w-3 h-3 mr-1" />
                    AI Architecture
                  </Badge>
                </div>
              </div>
              <div className="text-center">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mb-6">
                  <User className="w-32 h-32 text-[#0A1C2F]" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-center text-[#EAEAEA]/80">
                    <MapPin className="w-4 h-4 mr-2 text-[#C5B358]" />
                    <span>Rosario, Santa Fe, Argentina</span>
                  </div>
                  <div className="flex items-center justify-center text-[#EAEAEA]/80">
                    <Mail className="w-4 h-4 mr-2 text-[#C5B358]" />
                    <span>contacto@automatia.store</span>
                  </div>
                  <div className="flex items-center justify-center text-[#EAEAEA]/80">
                    <Phone className="w-4 h-4 mr-2 text-[#C5B358]" />
                    <span>+54 9 341 XXX XXXX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EAEAEA] text-center mb-16">
              Nuestra Historia
            </h2>
            <div className="space-y-12">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0A1C2F] font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#EAEAEA] mb-2">2022 - El Inicio</h3>
                  <p className="text-[#EAEAEA]/80 leading-relaxed">
                    Valentín comenzó a desarrollar la idea de Automatía mientras trabajaba en proyectos de IA para empresas multinacionales. 
                    Vio la necesidad de llevar esta tecnología a las empresas latinoamericanas de manera accesible y efectiva.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0A1C2F] font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#EAEAEA] mb-2">2023 - Desarrollo del MVP</h3>
                  <p className="text-[#EAEAEA]/80 leading-relaxed">
                    Se desarrolló el primer prototipo de la plataforma, integrando WhatsApp Business API con modelos de IA avanzados. 
                    Se realizaron las primeras pruebas con empresas locales de Rosario.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0A1C2F] font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#EAEAEA] mb-2">2024 - Lanzamiento Oficial</h3>
                  <p className="text-[#EAEAEA]/80 leading-relaxed">
                    Automatía se lanza oficialmente, ofreciendo su plataforma completa de IA conversacional. 
                    La empresa ya cuenta con clientes en Argentina, Chile, México y Colombia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-[#0f0f0f]/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EAEAEA] text-center mb-16">
              Nuestros Valores
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-2xl bg-[#0A1C2F]/50 border border-[#C5B358]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-[#0A1C2F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-3">Innovación Constante</h3>
                <p className="text-[#EAEAEA]/70">
                  Nos mantenemos a la vanguardia de la tecnología de IA para ofrecer las mejores soluciones a nuestros clientes.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-[#0A1C2F]/50 border border-[#C5B358]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#0A1C2F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-3">Confianza y Seguridad</h3>
                <p className="text-[#EAEAEA]/70">
                  La seguridad de los datos de nuestros clientes es nuestra máxima prioridad. Implementamos las mejores prácticas de ciberseguridad.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-[#0A1C2F]/50 border border-[#C5B358]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#0A1C2F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-3">Enfoque en el Cliente</h3>
                <p className="text-[#EAEAEA]/70">
                  Cada decisión que tomamos está centrada en cómo podemos mejorar la experiencia y resultados de nuestros clientes.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-[#0A1C2F]/50 border border-[#C5B358]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-[#0A1C2F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-3">Impacto Local</h3>
                <p className="text-[#EAEAEA]/70">
                  Nos enorgullece ser una empresa rosarina que está transformando el panorama tecnológico de América Latina.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-[#0A1C2F]/50 border border-[#C5B358]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ZapIcon className="w-8 h-8 text-[#0A1C2F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-3">Resultados Rápidos</h3>
                <p className="text-[#EAEAEA]/70">
                  Nuestras soluciones están diseñadas para generar valor inmediato, con implementación en menos de 48 horas.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-[#0A1C2F]/50 border border-[#C5B358]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#0A1C2F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-3">Calidad Premium</h3>
                <p className="text-[#EAEAEA]/70">
                  No comprometemos la calidad. Cada producto y servicio que ofrecemos cumple con los más altos estándares de la industria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EAEAEA] mb-16">
              Logros y Reconocimientos
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#0A1C2F]">25+</span>
                </div>
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-2">Clientes Activos</h3>
                <p className="text-[#EAEAEA]/70">Empresas que confían en Automatía</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#0A1C2F]">98%</span>
                </div>
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-2">Satisfacción</h3>
                <p className="text-[#EAEAEA]/70">Clientes satisfechos con nuestros servicios</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#0A1C2F]">4</span>
                </div>
                <h3 className="text-xl font-semibold text-[#EAEAEA] mb-2">Países</h3>
                <p className="text-[#EAEAEA]/70">Presencia en América Latina</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#C5B358]/10 via-transparent to-[#FFD700]/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EAEAEA] mb-6">
              ¿Listo para Automatizar tu Negocio?
            </h2>
            <p className="text-lg sm:text-xl text-[#EAEAEA]/80 mb-8 max-w-2xl mx-auto">
              Únete a las empresas que ya están transformando su atención al cliente con la potencia de la Inteligencia Artificial
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacto">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Hablar con Valentín
                </Button>
              </Link>
              <Link href="/precios">
                <Button className="w-full sm:w-auto border-[#C5B358] text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0A1C2F] px-8 py-4 text-lg border-2 font-semibold transition-all duration-300">
                  <CheckSquare className="w-5 h-5 mr-2" />
                  Ver Precios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
