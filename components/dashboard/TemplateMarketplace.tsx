"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Star,
  Download,
  Eye,
  Filter,
  Grid3X3,
  List,
  Plus,
  Sparkles,
  Zap,
  ShoppingCart,
  Users,
  MessageSquare,
  Bot,
  Briefcase,
  GraduationCap,
  Heart,
  Car,
  Home,
  Utensils,
  Palette,
  Code,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Play
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ChatbotTemplate {
  id: string
  name: string
  description: string
  category: string
  industry: string
  rating: number
  downloads: number
  price: number
  isPremium: boolean
  isFeatured: boolean
  tags: string[]
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  preview: {
    messages: Array<{
      role: 'user' | 'assistant'
      content: string
    }>
  }
  config: {
    personality: string
    tone: string
    language: string
    features: string[]
    integrations: string[]
  }
  metrics: {
    conversionRate: number
    satisfactionScore: number
    avgResponseTime: number
  }
  createdAt: string
  updatedAt: string
}

const mockTemplates: ChatbotTemplate[] = [
  {
    id: "ecommerce-pro",
    name: "E-commerce Pro Assistant",
    description: "Asistente especializado en ventas online con funciones de recomendación de productos, seguimiento de pedidos y soporte post-venta.",
    category: "Ventas",
    industry: "E-commerce",
    rating: 4.9,
    downloads: 1247,
    price: 0,
    isPremium: false,
    isFeatured: true,
    tags: ["ventas", "e-commerce", "recomendaciones", "pedidos"],
    author: {
      name: "Automatía Team",
      avatar: "🤖",
      verified: true
    },
    preview: {
      messages: [
        { role: "assistant", content: "¡Hola! Soy tu asistente de compras. ¿En qué producto estás interesado hoy?" },
        { role: "user", content: "Busco una laptop para trabajo" },
        { role: "assistant", content: "Perfecto! Te puedo recomendar algunas opciones. ¿Cuál es tu presupuesto aproximado y qué tipo de trabajo realizas?" }
      ]
    },
    config: {
      personality: "professional",
      tone: "helpful",
      language: "es",
      features: ["product-recommendations", "order-tracking", "payment-support"],
      integrations: ["shopify", "woocommerce", "stripe"]
    },
    metrics: {
      conversionRate: 23.5,
      satisfactionScore: 94.2,
      avgResponseTime: 1.2
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  },
  {
    id: "healthcare-assistant",
    name: "Healthcare Assistant",
    description: "Asistente médico para consultas básicas, programación de citas y seguimiento de pacientes con protocolos de seguridad médica.",
    category: "Salud",
    industry: "Healthcare",
    rating: 4.8,
    downloads: 892,
    price: 29.99,
    isPremium: true,
    isFeatured: true,
    tags: ["salud", "citas", "consultas", "pacientes"],
    author: {
      name: "MedTech Solutions",
      avatar: "⚕️",
      verified: true
    },
    preview: {
      messages: [
        { role: "assistant", content: "Hola, soy tu asistente médico. Puedo ayudarte con consultas generales y programar citas. ¿En qué puedo asistirte?" },
        { role: "user", content: "Necesito agendar una consulta" },
        { role: "assistant", content: "Por supuesto. ¿Qué tipo de consulta necesitas y cuándo te gustaría que fuera?" }
      ]
    },
    config: {
      personality: "professional",
      tone: "caring",
      language: "es",
      features: ["appointment-booking", "symptom-checker", "patient-follow-up"],
      integrations: ["calendly", "zoom", "google-calendar"]
    },
    metrics: {
      conversionRate: 31.8,
      satisfactionScore: 96.7,
      avgResponseTime: 0.9
    },
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18"
  },
  {
    id: "restaurant-host",
    name: "Restaurant Host Bot",
    description: "Asistente para restaurantes que maneja reservas, consultas sobre el menú, pedidos para llevar y recomendaciones personalizadas.",
    category: "Hospitalidad",
    industry: "Restaurantes",
    rating: 4.7,
    downloads: 654,
    price: 19.99,
    isPremium: true,
    isFeatured: false,
    tags: ["restaurante", "reservas", "menú", "pedidos"],
    author: {
      name: "Hospitality Pro",
      avatar: "🍽️",
      verified: false
    },
    preview: {
      messages: [
        { role: "assistant", content: "¡Bienvenido! Soy el asistente de nuestro restaurante. ¿Te gustaría hacer una reserva o consultar nuestro menú?" },
        { role: "user", content: "Quiero hacer una reserva para esta noche" },
        { role: "assistant", content: "Excelente! ¿Para cuántas personas y a qué hora te gustaría cenar?" }
      ]
    },
    config: {
      personality: "friendly",
      tone: "welcoming",
      language: "es",
      features: ["reservations", "menu-info", "takeout-orders"],
      integrations: ["opentable", "uber-eats", "whatsapp"]
    },
    metrics: {
      conversionRate: 28.3,
      satisfactionScore: 91.5,
      avgResponseTime: 1.1
    },
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16"
  },
  {
    id: "real-estate-agent",
    name: "Real Estate Agent",
    description: "Asistente inmobiliario que califica leads, programa visitas, proporciona información de propiedades y maneja consultas de inversión.",
    category: "Inmobiliaria",
    industry: "Real Estate",
    rating: 4.6,
    downloads: 423,
    price: 39.99,
    isPremium: true,
    isFeatured: false,
    tags: ["inmobiliaria", "propiedades", "visitas", "inversión"],
    author: {
      name: "PropTech Innovations",
      avatar: "🏠",
      verified: true
    },
    preview: {
      messages: [
        { role: "assistant", content: "¡Hola! Soy tu agente inmobiliario virtual. ¿Estás buscando comprar, vender o alquilar una propiedad?" },
        { role: "user", content: "Busco un apartamento para alquilar" },
        { role: "assistant", content: "Perfecto! ¿En qué zona te interesa y cuál es tu presupuesto mensual?" }
      ]
    },
    config: {
      personality: "professional",
      tone: "consultative",
      language: "es",
      features: ["lead-qualification", "property-search", "tour-scheduling"],
      integrations: ["zillow", "mls", "google-maps"]
    },
    metrics: {
      conversionRate: 35.2,
      satisfactionScore: 89.3,
      avgResponseTime: 1.4
    },
    createdAt: "2024-01-05",
    updatedAt: "2024-01-14"
  },
  {
    id: "education-tutor",
    name: "AI Education Tutor",
    description: "Tutor virtual para estudiantes con explicaciones personalizadas, ejercicios interactivos y seguimiento del progreso académico.",
    category: "Educación",
    industry: "Education",
    rating: 4.9,
    downloads: 1156,
    price: 0,
    isPremium: false,
    isFeatured: true,
    tags: ["educación", "tutor", "ejercicios", "progreso"],
    author: {
      name: "EduTech Global",
      avatar: "🎓",
      verified: true
    },
    preview: {
      messages: [
        { role: "assistant", content: "¡Hola estudiante! Soy tu tutor personal de IA. ¿En qué materia necesitas ayuda hoy?" },
        { role: "user", content: "Tengo dudas con matemáticas" },
        { role: "assistant", content: "¡Excelente! Las matemáticas son mi especialidad. ¿Qué tema específico te está dando problemas?" }
      ]
    },
    config: {
      personality: "encouraging",
      tone: "educational",
      language: "es",
      features: ["personalized-explanations", "interactive-exercises", "progress-tracking"],
      integrations: ["google-classroom", "khan-academy", "zoom"]
    },
    metrics: {
      conversionRate: 42.1,
      satisfactionScore: 97.8,
      avgResponseTime: 0.8
    },
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19"
  }
]

const categories = [
  { id: "all", name: "Todos", icon: Grid3X3 },
  { id: "ventas", name: "Ventas", icon: TrendingUp },
  { id: "soporte", name: "Soporte", icon: MessageSquare },
  { id: "salud", name: "Salud", icon: Heart },
  { id: "educacion", name: "Educación", icon: GraduationCap },
  { id: "inmobiliaria", name: "Inmobiliaria", icon: Home },
  { id: "hospitalidad", name: "Hospitalidad", icon: Utensils },
  { id: "finanzas", name: "Finanzas", icon: Briefcase },
  { id: "tecnologia", name: "Tecnología", icon: Code }
]

export function TemplateMarketplace() {
  const [templates, setTemplates] = useState<ChatbotTemplate[]>(mockTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState<ChatbotTemplate[]>(mockTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedTemplate, setSelectedTemplate] = useState<ChatbotTemplate | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    let filtered = templates

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(template =>
        template.category.toLowerCase() === selectedCategory ||
        template.industry.toLowerCase().includes(selectedCategory)
      )
    }

    // Sort templates
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return b.rating - a.rating
        case "rating":
          return b.rating - a.rating
        case "downloads":
          return b.downloads - a.downloads
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        default:
          return 0
      }
    })

    setFilteredTemplates(filtered)
  }, [templates, searchQuery, selectedCategory, sortBy])

  const handleInstallTemplate = (template: ChatbotTemplate) => {
    toast.success(`Template "${template.name}" instalado correctamente!`)
    // Here you would implement the actual installation logic
  }

  const handlePreviewTemplate = (template: ChatbotTemplate) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const TemplateCard = ({ template }: { template: ChatbotTemplate }) => (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-200 cursor-pointer",
      template.isFeatured && "ring-2 ring-primary/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{template.author.avatar}</div>
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {template.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{template.author.name}</span>
                {template.author.verified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {template.isFeatured && (
              <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                <Star className="w-3 h-3 mr-1" />
                Destacado
              </Badge>
            )}
            {template.isPremium && (
              <Badge variant="secondary">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {template.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-primary">{template.rating}</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{template.downloads}</div>
            <div className="text-xs text-muted-foreground">Descargas</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {template.price === 0 ? "Gratis" : `$${template.price}`}
            </div>
            <div className="text-xs text-muted-foreground">Precio</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center py-2 border-t">
          <div>
            <div className="text-sm font-semibold">{template.metrics.conversionRate}%</div>
            <div className="text-xs text-muted-foreground">Conversión</div>
          </div>
          <div>
            <div className="text-sm font-semibold">{template.metrics.satisfactionScore}%</div>
            <div className="text-xs text-muted-foreground">Satisfacción</div>
          </div>
          <div>
            <div className="text-sm font-semibold">{template.metrics.avgResponseTime}s</div>
            <div className="text-xs text-muted-foreground">Respuesta</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handlePreviewTemplate(template)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleInstallTemplate(template)}
          >
            <Download className="w-4 h-4 mr-2" />
            {template.price === 0 ? "Instalar" : "Comprar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Template Marketplace</h2>
          <p className="text-muted-foreground">Descubre y instala templates de chatbot profesionales</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Crear Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Destacados</SelectItem>
              <SelectItem value="rating">Mejor Rating</SelectItem>
              <SelectItem value="downloads">Más Descargados</SelectItem>
              <SelectItem value="newest">Más Nuevos</SelectItem>
              <SelectItem value="price-low">Precio: Menor</SelectItem>
              <SelectItem value="price-high">Precio: Mayor</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="gap-2"
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </Button>
          )
        })}
      </div>

      {/* Templates Grid */}
      <div className={cn(
        "grid gap-6",
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      )}>
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron templates</h3>
          <p className="text-muted-foreground">Intenta ajustar tus filtros de búsqueda</p>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-2xl">{selectedTemplate.author.avatar}</span>
                  {selectedTemplate.name}
                  {selectedTemplate.isFeatured && (
                    <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                      <Star className="w-3 h-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Descripción</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Características</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTemplate.config.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Integraciones</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTemplate.config.integrations.map((integration) => (
                        <Badge key={integration} variant="secondary" className="text-xs">
                          {integration}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-bold text-primary">
                        {selectedTemplate.metrics.conversionRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">Conversión</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {selectedTemplate.metrics.satisfactionScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">Satisfacción</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedTemplate.metrics.avgResponseTime}s
                      </div>
                      <div className="text-xs text-muted-foreground">Respuesta</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Vista Previa de Conversación</h4>
                  <Card className="h-80">
                    <CardContent className="p-4 space-y-3 h-full overflow-y-auto">
                      {selectedTemplate.preview.messages.map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex gap-3",
                            message.role === 'user' ? "justify-end" : "justify-start"
                          )}
                        >
                          {message.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                              {selectedTemplate.author.avatar}
                            </div>
                          )}
                          <div className={cn(
                            "max-w-[80%] rounded-lg px-3 py-2",
                            message.role === 'user' 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          )}>
                            {message.content}
                          </div>
                          {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Users className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    handleInstallTemplate(selectedTemplate)
                    setShowPreview(false)
                  }}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {selectedTemplate.price === 0 ? "Instalar Gratis" : `Comprar por $${selectedTemplate.price}`}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}










