import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Brain,
  Clock,
  Users,
  Utensils,
  Dumbbell,
  Stethoscope,
  Scissors,
  Store,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Shield,
} from "lucide-react"
import { CoreAIDemo } from "@/components/core-ai-demo"

export default function CoreAIPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-primary text-primary-foreground">Producto Principal</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Automatía Core AI</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Más que un chatbot: una infraestructura inteligente que conversa, ejecuta tareas y aprende de cada
            interacción para transformar tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Probar demo interactiva
            </Button>
            <Link href="/precios">
              <Button size="lg" variant="outline">
                Ver planes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What is Core AI Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Qué es Automatía Core AI?</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Un asistente inteligente conectado a WhatsApp y web vía API, basado en ChatGPT, que procesa lenguaje
                  natural y maneja contexto complejo.
                </p>
                <p>
                  Se entrena diariamente con tus planillas, calendarios y CRM, adaptándose perfectamente a tu negocio y
                  manteniendo memoria contextual de cada cliente.
                </p>
                <p>
                  Capaz de reservar turnos, gestionar pedidos, responder consultas, actualizar planillas, crear eventos
                  y automatizar flujos complejos.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MessageSquare, title: "Conversación Natural", desc: "Entiende contexto y matices" },
                { icon: Brain, title: "Aprendizaje Continuo", desc: "Se entrena con tus datos diariamente" },
                { icon: Zap, title: "Ejecución de Tareas", desc: "No solo responde, actúa" },
                { icon: Shield, title: "Memoria Contextual", desc: "Recuerda cada interacción" },
              ].map((feature, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <feature.icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-sm">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Makes it Different Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Qué lo hace diferente</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Más que un chatbot",
                description:
                  "No es un simple bot de respuestas. Es una infraestructura que entiende, decide y ejecuta acciones complejas.",
              },
              {
                icon: Brain,
                title: "Memoria y personalización",
                description:
                  "Recuerda preferencias, historial y contexto. Se adapta al tono y reglas específicas de tu negocio.",
              },
              {
                icon: Users,
                title: "Adaptación total",
                description:
                  "Cada Core AI es único: se moldea a tu industria, procesos y forma de comunicarte con clientes.",
              },
            ].map((item, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader className="text-center">
                  <item.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Verticals Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Módulos verticales especializados</h2>
          <Tabs defaultValue="restaurants" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="restaurants" className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                <span className="hidden sm:inline">Restaurantes</span>
              </TabsTrigger>
              <TabsTrigger value="gyms" className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                <span className="hidden sm:inline">Gimnasios</span>
              </TabsTrigger>
              <TabsTrigger value="clinics" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Clínicas</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Scissors className="h-4 w-4" />
                <span className="hidden sm:inline">Servicios</span>
              </TabsTrigger>
              <TabsTrigger value="commerce" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Comercios</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="restaurants" className="mt-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-6 w-6 text-primary" />
                    Restaurantes y Gastronomía
                  </CardTitle>
                  <CardDescription>
                    Gestión completa de reservas, consultas de menú y atención al cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Capacidades principales:</h4>
                      <ul className="space-y-2">
                        {[
                          "Gestiona reservas de mesas en tiempo real",
                          "Consulta disponibilidad en Google Sheets",
                          "Muestra menú actualizado y sugiere platos",
                          "Captura datos para campañas de marketing",
                          "Maneja pedidos para delivery y takeaway",
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Ejemplo de conversación:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-primary/10 p-2 rounded">
                          <strong>Cliente:</strong> "Hola, quiero reservar para 4 personas el sábado"
                        </div>
                        <div className="bg-secondary/10 p-2 rounded">
                          <strong>Core AI:</strong> "¡Perfecto! ¿Para qué hora te gustaría? Tengo disponibilidad a las
                          20:00 y 22:00"
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gyms" className="mt-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-6 w-6 text-primary" />
                    Gimnasios y Fitness
                  </CardTitle>
                  <CardDescription>Control de clases, cupos y gestión de membresías</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Capacidades principales:</h4>
                      <ul className="space-y-2">
                        {[
                          "Responde horarios de clases en tiempo real",
                          "Informa tarifas y planes disponibles",
                          "Controla cupos y lista de espera",
                          "Envía links de inscripción automática",
                          "Recuerda vencimientos de pagos",
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Ejemplo de conversación:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-primary/10 p-2 rounded">
                          <strong>Cliente:</strong> "¿Hay lugar en spinning de mañana a las 9?"
                        </div>
                        <div className="bg-secondary/10 p-2 rounded">
                          <strong>Core AI:</strong> "Sí, quedan 3 lugares. ¿Te reservo? Solo necesito tu nombre y
                          teléfono"
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clinics" className="mt-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-6 w-6 text-primary" />
                    Clínicas y Salud
                  </CardTitle>
                  <CardDescription>Gestión de turnos médicos y atención personalizada</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Capacidades principales:</h4>
                      <ul className="space-y-2">
                        {[
                          "Agenda turnos con profesionales específicos",
                          "Informa sobre tratamientos y especialidades",
                          "Envía recordatorios de citas automáticos",
                          "Recopila antecedentes con consentimiento",
                          "Gestiona cancelaciones y reprogramaciones",
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Ejemplo de conversación:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-primary/10 p-2 rounded">
                          <strong>Paciente:</strong> "Necesito turno con el cardiólogo"
                        </div>
                        <div className="bg-secondary/10 p-2 rounded">
                          <strong>Core AI:</strong> "El Dr. Martínez tiene disponibilidad el jueves 15 a las 14:30. ¿Te
                          sirve?"
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scissors className="h-6 w-6 text-primary" />
                    Servicios Profesionales
                  </CardTitle>
                  <CardDescription>Peluquerías, talleres, estudios y servicios personalizados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Capacidades principales:</h4>
                      <ul className="space-y-2">
                        {[
                          "Agenda citas con profesionales específicos",
                          "Calcula tiempos según tipo de servicio",
                          "Envía presupuestos automáticos",
                          "Gestiona lista de espera inteligente",
                          "Recuerda citas y servicios previos",
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Ejemplo de conversación:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-primary/10 p-2 rounded">
                          <strong>Cliente:</strong> "Quiero corte y color para el viernes"
                        </div>
                        <div className="bg-secondary/10 p-2 rounded">
                          <strong>Core AI:</strong> "Perfecto, eso son 2 horas. Tengo disponible a las 15:00 con María.
                          ¿Te confirmo?"
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commerce" className="mt-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-6 w-6 text-primary" />
                    Comercios y Retail
                  </CardTitle>
                  <CardDescription>Ventas, consultas de stock y atención comercial</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Capacidades principales:</h4>
                      <ul className="space-y-2">
                        {[
                          "Responde preguntas frecuentes sobre productos",
                          "Consulta stock en tiempo real",
                          "Toma pedidos y procesa pagos",
                          "Sugiere productos complementarios",
                          "Gestiona reclamos y devoluciones",
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Ejemplo de conversación:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-primary/10 p-2 rounded">
                          <strong>Cliente:</strong> "¿Tienen zapatillas Nike en talle 42?"
                        </div>
                        <div className="bg-secondary/10 p-2 rounded">
                          <strong>Core AI:</strong> "Sí, tengo 3 modelos disponibles en talle 42. Te muestro las
                          opciones..."
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prueba Core AI en acción</h2>
            <p className="text-xl text-muted-foreground">
              Interactúa con nuestro demo y experimenta cómo Core AI maneja reservas, pedidos y consultas
            </p>
          </div>
          <CoreAIDemo />
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Integraciones disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: "WhatsApp Business", logo: "📱" },
              { name: "Google Sheets", logo: "📊" },
              { name: "Google Calendar", logo: "📅" },
              { name: "n8n", logo: "🔄" },
              { name: "CRM Systems", logo: "👥" },
              { name: "Payment Gateways", logo: "💳" },
            ].map((integration, index) => (
              <Card key={index} className="bg-card border-border text-center p-6">
                <div className="text-4xl mb-2">{integration.logo}</div>
                <p className="text-sm font-medium">{integration.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Training Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Entrenamiento diario automático</h2>
            <p className="text-xl text-muted-foreground">
              Core AI se actualiza cada día con la información más reciente de tu negocio
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" />
                  Actualización automática
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Menús y precios actualizados",
                    "Horarios y disponibilidad",
                    "Nuevos servicios y promociones",
                    "Preferencias de clientes",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  Aprendizaje continuo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Patrones de comportamiento",
                    "Respuestas más efectivas",
                    "Optimización de conversiones",
                    "Detección de oportunidades",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans Comparison Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Elige tu plan</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Planes diseñados para crecer con tu negocio, desde startups hasta empresas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: "Starter",
                price: "$99",
                features: ["1,000 conversaciones/mes", "1 canal (WhatsApp o Web)", "Setup básico", "Soporte por email"],
              },
              {
                name: "Growth",
                price: "$299",
                features: [
                  "Conversaciones ilimitadas",
                  "Multicanal",
                  "Integraciones avanzadas",
                  "Optimización mensual",
                ],
                popular: true,
              },
              {
                name: "Pro",
                price: "$599",
                features: ["Multi-negocio", "API personalizada", "Reportes avanzados", "Soporte prioritario"],
              },
            ].map((plan, index) => (
              <Card key={index} className={`bg-card border-border ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    Más Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {plan.price}
                    <span className="text-sm text-muted-foreground">/mes</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    Comenzar ahora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Link href="/precios">
            <Button size="lg" variant="outline">
              Ver comparación completa de planes
            </Button>
          </Link>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para revolucionar tu atención al cliente?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Únete a cientos de empresas que ya transformaron sus ventas con Automatía Core AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Comenzar prueba gratuita
            </Button>
            <Button size="lg" variant="outline">
              Hablar con un especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
