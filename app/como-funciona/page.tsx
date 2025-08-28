"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Bot, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Rocket,
  Star,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react"

export default function ComoFuncionaPage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      id: 1,
      title: "Configuración Inicial",
      description: "Conecta tu WhatsApp Business en minutos",
      icon: MessageSquare,
      details: [
        "Vincula tu número de WhatsApp Business",
        "Configura la personalidad del bot",
        "Define respuestas automáticas básicas",
        "Prueba la conexión en tiempo real"
      ],
      duration: "15 minutos",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Personalización IA",
      description: "Entrena tu bot con tu negocio específico",
      icon: Bot,
      details: [
        "Sube documentos de tu empresa",
        "Configura respuestas personalizadas",
        "Define flujos de conversación",
        "Integra con tu base de datos"
      ],
      duration: "30 minutos",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Lanzamiento",
      description: "Tu bot está listo para atender clientes",
      icon: Zap,
      details: [
        "Activa el bot en producción",
        "Monitorea conversaciones en tiempo real",
        "Analiza métricas y performance",
        "Optimiza basado en datos reales"
      ],
      duration: "Inmediato",
      color: "from-green-500 to-emerald-500"
    }
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Implementación Rápida",
      description: "Tu bot funcionando en menos de 1 hora",
      metric: "48h máximo"
    },
    {
      icon: Users,
      title: "Atención 24/7",
      description: "Nunca más pierdas un cliente por horarios",
      metric: "100% disponible"
    },
    {
      icon: TrendingUp,
      title: "ROI Inmediato",
      description: "Resultados medibles desde el primer día",
      metric: "300% promedio"
    },
    {
      icon: Shield,
      title: "Seguridad Total",
      description: "Datos protegidos y cumplimiento GDPR",
      metric: "100% seguro"
    }
  ]

  const testimonials = [
    {
      name: "María González",
      company: "Restaurante El Sabor",
      text: "En 2 horas teníamos el bot funcionando. Los clientes quedan fascinados con la rapidez de respuesta.",
      rating: 5
    },
    {
      name: "Carlos Rodríguez",
      company: "Gimnasio PowerFit",
      text: "Automatizamos el 80% de las consultas. El equipo puede enfocarse en lo importante.",
      rating: 5
    },
    {
      name: "Ana Martínez",
      company: "Clínica Dental Sonrisa",
      text: "Los pacientes agendan citas sin esperar. La satisfacción aumentó un 40%.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-[#0A1C2F]">
      {/* Header */}
      <div className="bg-[#0f0f0f] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#EAEAEA] mb-6">
            Cómo <span className="text-[#C5B358]">Funciona</span>
          </h1>
          <p className="text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto">
            En solo 3 pasos simples, tu negocio tendrá un asistente de IA profesional 
            que atiende clientes 24/7 en WhatsApp
          </p>
        </div>
      </div>

      {/* Process Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <Card 
                  key={step.id}
                  className={`bg-[#0f0f0f] border-[#C5B358]/20 hover:border-[#C5B358]/40 transition-all duration-300 cursor-pointer ${
                    activeStep === step.id ? 'ring-2 ring-[#C5B358]' : ''
                  }`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Badge className="bg-[#C5B358] text-[#0f0f0f]">
                        Paso {step.id}
                      </Badge>
                      <span className="text-[#C5B358] text-sm font-medium">
                        {step.duration}
                      </span>
                    </div>
                    <CardTitle className="text-2xl text-[#EAEAEA]">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-[#EAEAEA]/70 text-lg">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#C5B358] mt-0.5 flex-shrink-0" />
                          <span className="text-[#EAEAEA]/80">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#EAEAEA] mb-6">
              ¿Por qué elegir Automatía?
            </h2>
            <p className="text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto">
              No solo automatizamos tu WhatsApp, transformamos la experiencia de tus clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-[#0A1C2F] border-[#C5B358]/20 hover:border-[#C5B358]/40 transition-all duration-300 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#C5B358]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-[#C5B358]" />
                  </div>
                  <CardTitle className="text-[#EAEAEA] text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#EAEAEA]/80 text-sm mb-3">{benefit.description}</p>
                  <Badge className="bg-[#C5B358] text-[#0f0f0f] font-bold">
                    {benefit.metric}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#EAEAEA] mb-6">
              ¿Quieres verlo en acción?
            </h2>
            <p className="text-xl text-[#EAEAEA]/80 mb-8 max-w-2xl mx-auto">
              Agenda una demo personalizada de 30 minutos y descubre cómo Automatía 
              puede transformar tu negocio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-[#C5B358] hover:bg-[#FFD700] text-[#0f0f0f] font-bold px-10 py-5 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => router.push('/contacto')}
              >
                <Play className="mr-3 h-6 w-6" />
                Agendar Demo Gratuita
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-[#C5B358] text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0f0f0f] font-semibold px-10 py-5 text-xl rounded-xl transition-all duration-300"
                onClick={() => window.open('https://wa.me/543416115981', '_blank')}
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                WhatsApp Directo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#EAEAEA] mb-6">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-[#EAEAEA]/80 max-w-3xl mx-auto">
              Empresas que ya transformaron su atención al cliente con Automatía
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-[#0A1C2F] border-[#C5B358]/20 hover:border-[#C5B358]/40 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-[#C5B358] fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-[#EAEAEA] text-lg">{testimonial.name}</CardTitle>
                  <CardDescription className="text-[#C5B358] font-semibold">
                    {testimonial.company}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-[#EAEAEA]/80 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#EAEAEA] mb-6">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-[#EAEAEA]/80 mb-8 max-w-2xl mx-auto">
            Únete a cientos de empresas que ya automatizaron su WhatsApp con Automatía
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-[#C5B358] hover:bg-[#FFD700] text-[#0f0f0f] font-bold px-10 py-5 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => router.push('/precios')}
            >
              <Rocket className="mr-3 h-6 w-6" />
              Empezar por USD 500/mes
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-[#C5B358] text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0f0f0f] font-semibold px-10 py-5 text-xl rounded-xl transition-all duration-300"
              onClick={() => router.push('/contacto')}
            >
              <Phone className="mr-3 h-6 w-6" />
              Hablar con Expertos
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
