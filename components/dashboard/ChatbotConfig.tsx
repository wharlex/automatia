"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Building2, 
  MessageCircle, 
  Bot, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Save,
  Loader2,
  Shield,
  BarChart3
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BusinessConfig {
  name: string
  industry: string
  description: string
  hours: string
  phone: string
  email: string
  website: string
  menuUrl: string
  // Nuevas configuraciones avanzadas
  timezone: string
  businessHours: {
    [key: string]: { start: string; end: string; enabled: boolean; breakStart?: string; breakEnd?: string }
  }
  categories: Array<{
    name: string
    description: string
    icon: string
    products: Array<{
      name: string
      description: string
      price: number
      currency: string
      available: boolean
      imageUrl?: string
    }>
  }>
  specialHours: Array<{
    date: string
    start: string
    end: string
    reason: string
    enabled: boolean
  }>
  holidays: Array<{
    date: string
    name: string
    closed: boolean
  }>
  locations: Array<{
    name: string
    address: string
    coordinates: { lat: number; lng: number }
    phone: string
    hours: string
  }>
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  paymentMethods: Array<'cash' | 'credit' | 'debit' | 'transfer' | 'crypto'>
  languages: string[]
  currency: string
  taxRate: number
}

interface WhatsAppConfig {
  phoneNumberId: string
  wabaId: string
  accessToken: string
  verifyToken: string
  appId: string
  appSecret: string
  graphVersion: string
  mode: 'sandbox' | 'production'
  // Nuevas configuraciones avanzadas
  autoReplyEnabled: boolean
  autoReplyMessage: string
  businessHours: {
    enabled: boolean
    timezone: string
    schedule: {
      [key: string]: { start: string; end: string; enabled: boolean }
    }
  }
  messageTemplates: Array<{
    name: string
    language: string
    category: string
    components: any[]
  }>
  webhookUrl: string
  webhookEvents: string[]
  mediaHandling: {
    enableImages: boolean
    enableDocuments: boolean
    enableAudio: boolean
    enableVideo: boolean
    maxFileSize: number
  }
  rateLimiting: {
    enabled: boolean
    messagesPerMinute: number
    messagesPerHour: number
  }
  crmIntegration: {
    enabled: boolean
    provider: 'hubspot' | 'salesforce' | 'custom'
    apiKey: string
    webhookUrl: string
  }
}

interface AIConfig {
  openaiApiKey: string
  systemPrompt: string
  model: string
  maxTokens: number
  temperature: number
  // Nuevas configuraciones avanzadas
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  memoryContext: number
  personality: 'formal' | 'casual' | 'technical' | 'friendly' | 'professional'
  language: 'es' | 'en' | 'pt' | 'auto'
  responseStyle: 'concise' | 'detailed' | 'conversational' | 'technical'
  maxResponseTime: number
  fallbackModel: string
  enableStreaming: boolean
  customInstructions: string
}

interface SecurityConfig {
  contentFiltering: {
    enabled: boolean
    inappropriateWords: string[]
    maxMessageLength: number
    blockSpam: boolean
    spamThreshold: number
  }
  userManagement: {
    whitelist: string[]
    blacklist: string[]
    maxUsersPerDay: number
    requireVerification: boolean
    verificationMethod: 'email' | 'phone' | 'none'
  }
  dataProtection: {
    encryptionEnabled: boolean
    dataRetentionDays: number
    gdprCompliant: boolean
    anonymizeData: boolean
    exportData: boolean
  }
  accessControl: {
    adminEmails: string[]
    moderatorEmails: string[]
    restrictedFeatures: string[]
    ipWhitelist: string[]
    vpnBlocking: boolean
  }
  monitoring: {
    suspiciousActivity: boolean
    failedLoginAttempts: number
    blockDuration: number
    alertEmails: string[]
    logLevel: 'debug' | 'info' | 'warn' | 'error'
  }
}

interface AnalyticsConfig {
  metrics: {
    trackConversations: boolean
    trackUserBehavior: boolean
    trackResponseTime: boolean
    trackSatisfaction: boolean
    trackConversions: boolean
  }
  reporting: {
    dailyReports: boolean
    weeklyReports: boolean
    monthlyReports: boolean
    customReports: boolean
    reportEmails: string[]
  }
  integrations: {
    googleAnalytics: {
      enabled: boolean
      trackingId: string
    }
    googleTagManager: {
      enabled: boolean
      containerId: string
    }
    facebookPixel: {
      enabled: boolean
      pixelId: string
    }
    hotjar: {
      enabled: boolean
      siteId: string
    }
  }
  kpis: {
    responseTimeTarget: number
    satisfactionTarget: number
    conversionTarget: number
    retentionTarget: number
  }
  dataExport: {
    csvExport: boolean
    jsonExport: boolean
    apiAccess: boolean
    webhookNotifications: boolean
  }
}

export default function ChatbotConfig() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('business')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Business Configuration
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>({
    name: '',
    industry: '',
    description: '',
    hours: '',
    phone: '',
    email: '',
    website: '',
    menuUrl: '',
    // Nuevas configuraciones avanzadas
    timezone: 'UTC',
    businessHours: {},
    categories: [],
    specialHours: [],
    holidays: [],
    locations: [],
    socialMedia: {},
    paymentMethods: [],
    languages: [],
    currency: 'USD',
    taxRate: 0
  })

  // WhatsApp Configuration
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    phoneNumberId: '',
    wabaId: '',
    accessToken: '',
    verifyToken: '',
    appId: '',
    appSecret: '',
    graphVersion: 'v21.0',
    mode: 'sandbox',
    autoReplyEnabled: false,
    autoReplyMessage: '',
    businessHours: {
      enabled: false,
      timezone: 'UTC',
      schedule: {}
    },
    messageTemplates: [],
    webhookUrl: '',
    webhookEvents: [],
    mediaHandling: {
      enableImages: true,
      enableDocuments: true,
      enableAudio: true,
      enableVideo: true,
      maxFileSize: 10 * 1024 * 1024 // 10MB
    },
    rateLimiting: {
      enabled: false,
      messagesPerMinute: 10,
      messagesPerHour: 100
    },
    crmIntegration: {
      enabled: false,
      provider: 'custom',
      apiKey: '',
      webhookUrl: ''
    }
  })

  // AI Configuration
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    openaiApiKey: '',
    systemPrompt: 'Eres un asistente virtual profesional y amigable para un negocio. Responde de manera clara, útil y siempre mantén un tono profesional pero cercano.',
    model: 'gpt-4o-mini',
    maxTokens: 1000,
    temperature: 0.7,
    // Nuevas configuraciones avanzadas
    topP: 0.9,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    memoryContext: 10,
    personality: 'professional',
    language: 'es',
    responseStyle: 'conversational',
    maxResponseTime: 30,
    fallbackModel: 'gpt-3.5-turbo',
    enableStreaming: true,
    customInstructions: ''
  })

  // Security Configuration
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    contentFiltering: {
      enabled: false,
      inappropriateWords: [],
      maxMessageLength: 1000,
      blockSpam: true,
      spamThreshold: 5
    },
    userManagement: {
      whitelist: [],
      blacklist: [],
      maxUsersPerDay: 1000,
      requireVerification: false,
      verificationMethod: 'none'
    },
    dataProtection: {
      encryptionEnabled: true,
      dataRetentionDays: 365,
      gdprCompliant: true,
      anonymizeData: false,
      exportData: true
    },
    accessControl: {
      adminEmails: [],
      moderatorEmails: [],
      restrictedFeatures: [],
      ipWhitelist: [],
      vpnBlocking: false
    },
    monitoring: {
      suspiciousActivity: true,
      failedLoginAttempts: 5,
      blockDuration: 15,
      alertEmails: [],
      logLevel: 'info'
    }
  })

  // Analytics Configuration
  const [analyticsConfig, setAnalyticsConfig] = useState<AnalyticsConfig>({
    metrics: {
      trackConversations: true,
      trackUserBehavior: true,
      trackResponseTime: true,
      trackSatisfaction: true,
      trackConversions: true
    },
    reporting: {
      dailyReports: false,
      weeklyReports: true,
      monthlyReports: true,
      customReports: false,
      reportEmails: []
    },
    integrations: {
      googleAnalytics: {
        enabled: false,
        trackingId: ''
      },
      googleTagManager: {
        enabled: false,
        containerId: ''
      },
      facebookPixel: {
        enabled: false,
        pixelId: ''
      },
      hotjar: {
        enabled: false,
        siteId: ''
      }
    },
    kpis: {
      responseTimeTarget: 30,
      satisfactionTarget: 4.5,
      conversionTarget: 15,
      retentionTarget: 70
    },
    dataExport: {
      csvExport: true,
      jsonExport: true,
      apiAccess: false,
      webhookNotifications: false
    }
  })

  // Load existing configuration
  useEffect(() => {
    loadConfiguration()
  }, [])

  const loadConfiguration = async () => {
    setIsLoading(true)
    try {
      // Load business config
      const businessResponse = await fetch('/api/config/business')
      if (businessResponse.ok) {
        const data = await businessResponse.json()
        setBusinessConfig(data)
      }

      // Load WhatsApp config
      const whatsappResponse = await fetch('/api/config/whatsapp')
      if (whatsappResponse.ok) {
        const data = await whatsappResponse.json()
        setWhatsappConfig(data)
      }

      // Load AI config
      const aiResponse = await fetch('/api/config/ai')
      if (aiResponse.ok) {
        const data = await aiResponse.json()
        setAiConfig(data)
      }
    } catch (error) {
      console.error('Error loading configuration:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveConfiguration = async (tab: string) => {
    setIsSaving(true)
    try {
      let configToSave: any = {}
      
      switch (tab) {
        case 'business':
          configToSave = businessConfig
          break
        case 'whatsapp':
          configToSave = whatsappConfig
          break
        case 'ai':
          configToSave = aiConfig
          break
        case 'security':
          configToSave = securityConfig
          break
        case 'analytics':
          configToSave = analyticsConfig
          break
        case 'advanced':
          configToSave = aiConfig // La configuración avanzada se guarda en AI
          break
        default:
          configToSave = { business: businessConfig, whatsapp: whatsappConfig, ai: aiConfig, security: securityConfig, analytics: analyticsConfig }
      }

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Configuración guardada",
        description: `La configuración de ${tab} se ha guardado exitosamente.`,
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar la configuración. Inténtalo de nuevo.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const testConnection = async () => {
    try {
      const response = await fetch('/api/bot/test', { method: 'POST' })
      if (response.ok) {
        toast({
          title: "Conexión exitosa",
          description: "El chatbot está funcionando correctamente.",
        })
      } else {
        throw new Error('Test failed')
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el chatbot. Verifica la configuración.",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuración del Chatbot</h2>
          <p className="text-muted-foreground">
            Configura tu negocio, WhatsApp Business API y IA para el chatbot
          </p>
        </div>
        <Button onClick={testConnection} variant="outline">
          <Bot className="w-4 h-4 mr-2" />
          Probar Conexión
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Negocio
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            IA
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Avanzado
          </TabsTrigger>
        </TabsList>

        {/* Business Configuration Tab */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Información del Negocio
              </CardTitle>
              <CardDescription>
                Configura los datos básicos de tu negocio para personalizar el chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nombre del Negocio *</Label>
                  <Input
                    id="businessName"
                    value={businessConfig.name}
                    onChange={(e) => setBusinessConfig({...businessConfig, name: e.target.value})}
                    placeholder="Ej: Restaurante La Esquina"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Rubro/Industria *</Label>
                  <Select value={businessConfig.industry} onValueChange={(value) => setBusinessConfig({...businessConfig, industry: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu rubro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurante">Restaurante</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="servicios">Servicios</SelectItem>
                      <SelectItem value="salud">Salud</SelectItem>
                      <SelectItem value="educacion">Educación</SelectItem>
                      <SelectItem value="tecnologia">Tecnología</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción del Negocio</Label>
                <Textarea
                  id="description"
                  value={businessConfig.description}
                  onChange={(e) => setBusinessConfig({...businessConfig, description: e.target.value})}
                  placeholder="Describe tu negocio, especialidades, valores..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Horarios de Atención</Label>
                  <Textarea
                    id="hours"
                    value={businessConfig.hours}
                    onChange={(e) => setBusinessConfig({...businessConfig, hours: e.target.value})}
                    placeholder="Ej: Lunes a Viernes 9:00-18:00, Sábados 10:00-14:00"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono de Contacto</Label>
                  <Input
                    id="phone"
                    value={businessConfig.phone}
                    onChange={(e) => setBusinessConfig({...businessConfig, phone: e.target.value})}
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email de Contacto</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessConfig.email}
                    onChange={(e) => setBusinessConfig({...businessConfig, email: e.target.value})}
                    placeholder="contacto@tunegocio.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    value={businessConfig.website}
                    onChange={(e) => setBusinessConfig({...businessConfig, website: e.target.value})}
                    placeholder="https://tunegocio.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="menuUrl">Enlace a Menú/Servicios</Label>
                <Input
                  id="menuUrl"
                  value={businessConfig.menuUrl}
                  onChange={(e) => setBusinessConfig({...businessConfig, menuUrl: e.target.value})}
                  placeholder="https://docs.google.com/spreadsheets/..."
                />
              </div>

              <Button 
                onClick={() => saveConfiguration('business')} 
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Guardar y Continuar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Configuration Tab */}
        <TabsContent value="whatsapp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Configuración de WhatsApp Business API
              </CardTitle>
              <CardDescription>
                Configura la integración con WhatsApp Business API para recibir y enviar mensajes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumberId">Phone Number ID *</Label>
                  <Input
                    id="phoneNumberId"
                    value={whatsappConfig.phoneNumberId}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, phoneNumberId: e.target.value})}
                    placeholder="Ej: 3416115981"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wabaId">WhatsApp Business Account ID *</Label>
                  <Input
                    id="wabaId"
                    value={whatsappConfig.wabaId}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, wabaId: e.target.value})}
                    placeholder="Ej: 54564615"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accessToken">Access Token *</Label>
                  <Input
                    id="accessToken"
                    type="password"
                    value={whatsappConfig.accessToken}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, accessToken: e.target.value})}
                    placeholder="Token de acceso de Meta"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verifyToken">Verify Token *</Label>
                  <Input
                    id="verifyToken"
                    value={whatsappConfig.verifyToken}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, verifyToken: e.target.value})}
                    placeholder="Token de verificación personalizado"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appId">App ID (opcional)</Label>
                  <Input
                    id="appId"
                    value={whatsappConfig.appId}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, appId: e.target.value})}
                    placeholder="Ej: AWE2131231"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appSecret">App Secret (opcional)</Label>
                  <Input
                    id="appSecret"
                    type="password"
                    value={whatsappConfig.appSecret}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, appSecret: e.target.value})}
                    placeholder="Secret de la aplicación"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="graphVersion">Graph API Version</Label>
                  <Input
                    id="graphVersion"
                    value={whatsappConfig.graphVersion}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, graphVersion: e.target.value})}
                    placeholder="v21.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode">Modo</Label>
                  <Select value={whatsappConfig.mode} onValueChange={(value: 'sandbox' | 'production') => setWhatsappConfig({...whatsappConfig, mode: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox (Pruebas)</SelectItem>
                      <SelectItem value="production">Production (Producción)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="autoReplyEnabled">Respuesta Automática</Label>
                  <Select value={whatsappConfig.autoReplyEnabled ? 'true' : 'false'} onValueChange={(value) => setWhatsappConfig({...whatsappConfig, autoReplyEnabled: value === 'true'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="autoReplyMessage">Mensaje de Respuesta Automática</Label>
                  <Textarea
                    id="autoReplyMessage"
                    value={whatsappConfig.autoReplyMessage}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, autoReplyMessage: e.target.value})}
                    placeholder="Hola! Soy un asistente virtual. ¿En qué puedo ayudarte?"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessHoursEnabled">Horarios de Atención</Label>
                  <Select value={whatsappConfig.businessHours.enabled ? 'true' : 'false'} onValueChange={(value) => setWhatsappConfig({...whatsappConfig, businessHours: { ...whatsappConfig.businessHours, enabled: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Input
                    id="timezone"
                    value={whatsappConfig.businessHours.timezone}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, businessHours: { ...whatsappConfig.businessHours, timezone: e.target.value }})}
                    placeholder="Ej: America/Argentina/Buenos_Aires"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="messageTemplates">Plantillas de Mensaje</Label>
                  <Select value={whatsappConfig.messageTemplates.length > 0 ? 'true' : 'false'} onValueChange={(value) => setWhatsappConfig({...whatsappConfig, messageTemplates: value === 'true' ? [] : []})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">URL de Webhook</Label>
                  <Input
                    id="webhookUrl"
                    value={whatsappConfig.webhookUrl}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, webhookUrl: e.target.value})}
                    placeholder="https://api.tunegocio.com/webhook"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookEvents">Eventos de Webhook</Label>
                  <Select value={whatsappConfig.webhookEvents.length > 0 ? 'true' : 'false'} onValueChange={(value) => setWhatsappConfig({...whatsappConfig, webhookEvents: value === 'true' ? [] : []})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mediaHandlingEnabled">Manejo de Multimedia</Label>
                  <Select value={whatsappConfig.mediaHandling.enableImages ? 'true' : 'false'} onValueChange={(value) => setWhatsappConfig({...whatsappConfig, mediaHandling: { ...whatsappConfig.mediaHandling, enableImages: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Tamaño Máximo de Archivo</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={whatsappConfig.mediaHandling.maxFileSize}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, mediaHandling: { ...whatsappConfig.mediaHandling, maxFileSize: parseInt(e.target.value) }})}
                    min={1024}
                    max={100 * 1024 * 1024} // 100MB
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rateLimitingEnabled">Límites de Tasa</Label>
                  <Select value={whatsappConfig.rateLimiting.enabled ? 'true' : 'false'} onValueChange={(value) => setWhatsappConfig({...whatsappConfig, rateLimiting: { ...whatsappConfig.rateLimiting, enabled: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="messagesPerMinute">Mensajes por Minuto</Label>
                  <Input
                    id="messagesPerMinute"
                    type="number"
                    value={whatsappConfig.rateLimiting.messagesPerMinute}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, rateLimiting: { ...whatsappConfig.rateLimiting, messagesPerMinute: parseInt(e.target.value) }})}
                    min={1}
                    max={1000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messagesPerHour">Mensajes por Hora</Label>
                  <Input
                    id="messagesPerHour"
                    type="number"
                    value={whatsappConfig.rateLimiting.messagesPerHour}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, rateLimiting: { ...whatsappConfig.rateLimiting, messagesPerHour: parseInt(e.target.value) }})}
                    min={1}
                    max={10000}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crmIntegrationEnabled">Integración CRM</Label>
                  <Select value={whatsappConfig.crmIntegration.enabled ? 'true' : 'false'} onValueChange={(value) => setWhatsappConfig({...whatsappConfig, crmIntegration: { ...whatsappConfig.crmIntegration, enabled: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crmProvider">Proveedor CRM</Label>
                  <Select value={whatsappConfig.crmIntegration.provider} onValueChange={(value) => setWhatsappConfig({...whatsappConfig, crmIntegration: { ...whatsappConfig.crmIntegration, provider: value as 'hubspot' | 'salesforce' | 'custom' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crmApiKey">API Key (opcional)</Label>
                <Input
                  id="crmApiKey"
                  type="password"
                  value={whatsappConfig.crmIntegration.apiKey}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, crmIntegration: { ...whatsappConfig.crmIntegration, apiKey: e.target.value }})}
                  placeholder="API Key de HubSpot, SalesForce, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crmWebhookUrl">URL de Webhook (CRM)</Label>
                <Input
                  id="crmWebhookUrl"
                  value={whatsappConfig.crmIntegration.webhookUrl}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, crmIntegration: { ...whatsappConfig.crmIntegration, webhookUrl: e.target.value }})}
                  placeholder="https://api.crm.tunegocio.com/webhook"
                />
              </div>

              <Button 
                onClick={() => saveConfiguration('whatsapp')} 
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Configuration Tab */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Configuración de Inteligencia Artificial
              </CardTitle>
              <CardDescription>
                Configura OpenAI y personaliza el comportamiento de tu chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openaiApiKey">OpenAI API Key *</Label>
                <Input
                  id="openaiApiKey"
                  type="password"
                  value={aiConfig.openaiApiKey}
                  onChange={(e) => setAiConfig({...aiConfig, openaiApiKey: e.target.value})}
                  placeholder="sk-..."
                />
                <p className="text-xs text-muted-foreground">
                  Tu API key se encriptará y almacenará de forma segura
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">Prompt del Sistema</Label>
                <Textarea
                  id="systemPrompt"
                  value={aiConfig.systemPrompt}
                  onChange={(e) => setAiConfig({...aiConfig, systemPrompt: e.target.value})}
                  placeholder="Instrucciones para el comportamiento del chatbot..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Define cómo debe comportarse tu chatbot y qué información debe conocer
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo de IA</Label>
                  <Select value={aiConfig.model} onValueChange={(value) => setAiConfig({...aiConfig, model: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini (Recomendado)</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Máximo de Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={aiConfig.maxTokens}
                    onChange={(e) => setAiConfig({...aiConfig, maxTokens: parseInt(e.target.value)})}
                    min={100}
                    max={4000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperatura</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={aiConfig.temperature}
                    onChange={(e) => setAiConfig({...aiConfig, temperature: parseFloat(e.target.value)})}
                    min={0}
                    max={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    0 = Determinístico, 2 = Muy creativo
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Capacidades del Chatbot</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Respuestas de texto
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Análisis de imágenes
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Transcripción de audio
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Procesamiento de PDFs
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => saveConfiguration('ai')} 
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Configuration Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>
                Configura las políticas de seguridad para proteger tu chatbot y datos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contentFilteringEnabled">Filtrado de Contenido</Label>
                  <Select value={securityConfig.contentFiltering.enabled ? 'true' : 'false'} onValueChange={(value) => setSecurityConfig({...securityConfig, contentFiltering: { ...securityConfig.contentFiltering, enabled: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inappropriateWords">Palabras Inapropiadas</Label>
                  <Input
                    id="inappropriateWords"
                    value={securityConfig.contentFiltering.inappropriateWords.join(', ')}
                    onChange={(e) => setSecurityConfig({...securityConfig, contentFiltering: { ...securityConfig.contentFiltering, inappropriateWords: e.target.value.split(',').map(word => word.trim()) }})}
                    placeholder="palabras,separadas,por,coma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxMessageLength">Longitud Máxima de Mensaje</Label>
                  <Input
                    id="maxMessageLength"
                    type="number"
                    value={securityConfig.contentFiltering.maxMessageLength}
                    onChange={(e) => setSecurityConfig({...securityConfig, contentFiltering: { ...securityConfig.contentFiltering, maxMessageLength: parseInt(e.target.value) }})}
                    min={100}
                    max={2000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blockSpam">Bloquear Spam</Label>
                  <Select value={securityConfig.contentFiltering.blockSpam ? 'true' : 'false'} onValueChange={(value) => setSecurityConfig({...securityConfig, contentFiltering: { ...securityConfig.contentFiltering, blockSpam: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spamThreshold">Umbral de Spam</Label>
                  <Input
                    id="spamThreshold"
                    type="number"
                    value={securityConfig.contentFiltering.spamThreshold}
                    onChange={(e) => setSecurityConfig({...securityConfig, contentFiltering: { ...securityConfig.contentFiltering, spamThreshold: parseInt(e.target.value) }})}
                    min={1}
                    max={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userManagementWhitelist">Whitelist de Usuarios</Label>
                  <Input
                    id="userManagementWhitelist"
                    value={securityConfig.userManagement.whitelist.join(', ')}
                    onChange={(e) => setSecurityConfig({...securityConfig, userManagement: { ...securityConfig.userManagement, whitelist: e.target.value.split(',').map(email => email.trim()) }})}
                    placeholder="usuario1@example.com,usuario2@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userManagementBlacklist">Blacklist de Usuarios</Label>
                  <Input
                    id="userManagementBlacklist"
                    value={securityConfig.userManagement.blacklist.join(', ')}
                    onChange={(e) => setSecurityConfig({...securityConfig, userManagement: { ...securityConfig.userManagement, blacklist: e.target.value.split(',').map(email => email.trim()) }})}
                    placeholder="usuario-spam@example.com,usuario-spam2@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUsersPerDay">Usuarios por Día</Label>
                  <Input
                    id="maxUsersPerDay"
                    type="number"
                    value={securityConfig.userManagement.maxUsersPerDay}
                    onChange={(e) => setSecurityConfig({...securityConfig, userManagement: { ...securityConfig.userManagement, maxUsersPerDay: parseInt(e.target.value) }})}
                    min={10}
                    max={10000}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requireVerification">Requerir Verificación</Label>
                  <Select value={securityConfig.userManagement.requireVerification ? 'true' : 'false'} onValueChange={(value) => setSecurityConfig({...securityConfig, userManagement: { ...securityConfig.userManagement, requireVerification: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verificationMethod">Método de Verificación</Label>
                  <Select value={securityConfig.userManagement.verificationMethod} onValueChange={(value) => setSecurityConfig({...securityConfig, userManagement: { ...securityConfig.userManagement, verificationMethod: value as 'email' | 'phone' | 'none' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Teléfono</SelectItem>
                      <SelectItem value="none">Ninguno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataProtectionEncryptionEnabled">Encriptación de Datos</Label>
                  <Select value={securityConfig.dataProtection.encryptionEnabled ? 'true' : 'false'} onValueChange={(value) => setSecurityConfig({...securityConfig, dataProtection: { ...securityConfig.dataProtection, encryptionEnabled: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataRetentionDays">Retención de Datos (Días)</Label>
                  <Input
                    id="dataRetentionDays"
                    type="number"
                    value={securityConfig.dataProtection.dataRetentionDays}
                    onChange={(e) => setSecurityConfig({...securityConfig, dataProtection: { ...securityConfig.dataProtection, dataRetentionDays: parseInt(e.target.value) }})}
                    min={30}
                    max={3650}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gdprCompliant">GDPR Compatible</Label>
                  <Select value={securityConfig.dataProtection.gdprCompliant ? 'true' : 'false'} onValueChange={(value) => setSecurityConfig({...securityConfig, dataProtection: { ...securityConfig.dataProtection, gdprCompliant: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Sí</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anonymizeData">Anonimizar Datos</Label>
                  <Select value={securityConfig.dataProtection.anonymizeData ? 'true' : 'false'} onValueChange={(value) => setSecurityConfig({...securityConfig, dataProtection: { ...securityConfig.dataProtection, anonymizeData: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exportData">Exportar Datos</Label>
                  <Select value={securityConfig.dataProtection.exportData ? 'true' : 'false'} onValueChange={(value) => setSecurityConfig({...securityConfig, dataProtection: { ...securityConfig.dataProtection, exportData: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessControlAdminEmails">Emails de Administradores</Label>
                  <Input
                    id="accessControlAdminEmails"
                    value={securityConfig.accessControl.adminEmails.join(', ')}
                    onChange={(e) => setSecurityConfig({...securityConfig, accessControl: { ...securityConfig.accessControl, adminEmails: e.target.value.split(',').map(email => email.trim()) }})}
                    placeholder="admin@tunegocio.com,moderador@tunegocio.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accessControlModeratorEmails">Emails de Moderadores</Label>
                  <Input
                    id="accessControlModeratorEmails"
                    value={securityConfig.accessControl.moderatorEmails.join(', ')}
                    onChange={(e) => setSecurityConfig({...securityConfig, accessControl: { ...securityConfig.accessControl, moderatorEmails: e.target.value.split(',').map(email => email.trim()) }})}
                    placeholder="moderador@tunegocio.com,corrector@tunegocio.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restrictedFeatures">Características Restringidas</Label>
                  <Input
                    id="restrictedFeatures"
                    value={securityConfig.accessControl.restrictedFeatures.join(', ')}
                    onChange={(e) => setSecurityConfig({...securityConfig, accessControl: { ...securityConfig.accessControl, restrictedFeatures: e.target.value.split(',').map(feature => feature.trim()) }})}
                    placeholder="chat,api,config"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">Whitelist de IPs</Label>
                  <Input
                    id="ipWhitelist"
                    value={securityConfig.accessControl.ipWhitelist.join(', ')}
                    onChange={(e) => setSecurityConfig({...securityConfig, accessControl: { ...securityConfig.accessControl, ipWhitelist: e.target.value.split(',').map(ip => ip.trim()) }})}
                    placeholder="192.168.1.1,10.0.0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vpnBlocking">Bloqueo de VPN</Label>
                  <Select value={securityConfig.accessControl.vpnBlocking ? 'true' : 'false'} onValueChange={(value) => setSecurityConfig({...securityConfig, accessControl: { ...securityConfig.accessControl, vpnBlocking: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monitoringSuspiciousActivity">Actividad Sospechosa</Label>
                  <Select value={securityConfig.monitoring.suspiciousActivity ? 'true' : 'false'} onValueChange={(value) => setSecurityConfig({...securityConfig, monitoring: { ...securityConfig.monitoring, suspiciousActivity: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="failedLoginAttempts">Intentos de Login Fallidos</Label>
                  <Input
                    id="failedLoginAttempts"
                    type="number"
                    value={securityConfig.monitoring.failedLoginAttempts}
                    onChange={(e) => setSecurityConfig({...securityConfig, monitoring: { ...securityConfig.monitoring, failedLoginAttempts: parseInt(e.target.value) }})}
                    min={1}
                    max={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blockDuration">Duración del Bloqueo</Label>
                  <Input
                    id="blockDuration"
                    type="number"
                    value={securityConfig.monitoring.blockDuration}
                    onChange={(e) => setSecurityConfig({...securityConfig, monitoring: { ...securityConfig.monitoring, blockDuration: parseInt(e.target.value) }})}
                    min={5}
                    max={3600}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alertEmails">Emails de Alertas</Label>
                  <Input
                    id="alertEmails"
                    value={securityConfig.monitoring.alertEmails.join(', ')}
                    onChange={(e) => setSecurityConfig({...securityConfig, monitoring: { ...securityConfig.monitoring, alertEmails: e.target.value.split(',').map(email => email.trim()) }})}
                    placeholder="admin@tunegocio.com,seguridad@tunegocio.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Nivel de Log</Label>
                  <Select value={securityConfig.monitoring.logLevel} onValueChange={(value) => setSecurityConfig({...securityConfig, monitoring: { ...securityConfig.monitoring, logLevel: value as 'debug' | 'info' | 'warn' | 'error' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warn</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessControlRestrictedFeatures">Características Restringidas</Label>
                  <Input
                    id="accessControlRestrictedFeatures"
                    value={securityConfig.accessControl.restrictedFeatures.join(', ')}
                    onChange={(e) => setSecurityConfig({...securityConfig, accessControl: { ...securityConfig.accessControl, restrictedFeatures: e.target.value.split(',').map(feature => feature.trim()) }})}
                    placeholder="chat,api,config"
                  />
                </div>
              </div>

              <Button 
                onClick={() => saveConfiguration('security')} 
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Configuration Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Configuración de Analytics
              </CardTitle>
              <CardDescription>
                Configura las métricas y reporting para analizar el comportamiento del chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trackConversations">Seguimiento de Conversaciones</Label>
                  <Select value={analyticsConfig.metrics.trackConversations ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, metrics: { ...analyticsConfig.metrics, trackConversations: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trackUserBehavior">Seguimiento de Comportamiento de Usuarios</Label>
                  <Select value={analyticsConfig.metrics.trackUserBehavior ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, metrics: { ...analyticsConfig.metrics, trackUserBehavior: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trackResponseTime">Seguimiento de Tiempo de Respuesta</Label>
                  <Select value={analyticsConfig.metrics.trackResponseTime ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, metrics: { ...analyticsConfig.metrics, trackResponseTime: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trackSatisfaction">Seguimiento de Satisfacción</Label>
                  <Select value={analyticsConfig.metrics.trackSatisfaction ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, metrics: { ...analyticsConfig.metrics, trackSatisfaction: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trackConversions">Seguimiento de Conversiones</Label>
                  <Select value={analyticsConfig.metrics.trackConversions ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, metrics: { ...analyticsConfig.metrics, trackConversions: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dailyReports">Reportes Diarios</Label>
                  <Select value={analyticsConfig.reporting.dailyReports ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, reporting: { ...analyticsConfig.reporting, dailyReports: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weeklyReports">Reportes Semanales</Label>
                  <Select value={analyticsConfig.reporting.weeklyReports ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, reporting: { ...analyticsConfig.reporting, weeklyReports: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyReports">Reportes Mensuales</Label>
                  <Select value={analyticsConfig.reporting.monthlyReports ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, reporting: { ...analyticsConfig.reporting, monthlyReports: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customReports">Reportes Personalizados</Label>
                  <Select value={analyticsConfig.reporting.customReports ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, reporting: { ...analyticsConfig.reporting, customReports: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportEmails">Emails para Reportes</Label>
                  <Input
                    id="reportEmails"
                    value={analyticsConfig.reporting.reportEmails.join(', ')}
                    onChange={(e) => setAnalyticsConfig({...analyticsConfig, reporting: { ...analyticsConfig.reporting, reportEmails: e.target.value.split(',').map(email => email.trim()) }})}
                    placeholder="reportes@tunegocio.com,analitica@tunegocio.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kpisResponseTimeTarget">Meta de Tiempo de Respuesta</Label>
                  <Input
                    id="kpisResponseTimeTarget"
                    type="number"
                    value={analyticsConfig.kpis.responseTimeTarget}
                    onChange={(e) => setAnalyticsConfig({...analyticsConfig, kpis: { ...analyticsConfig.kpis, responseTimeTarget: parseInt(e.target.value) }})}
                    min={10}
                    max={120}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kpisSatisfactionTarget">Meta de Satisfacción</Label>
                  <Input
                    id="kpisSatisfactionTarget"
                    type="number"
                    value={analyticsConfig.kpis.satisfactionTarget}
                    onChange={(e) => setAnalyticsConfig({...analyticsConfig, kpis: { ...analyticsConfig.kpis, satisfactionTarget: parseFloat(e.target.value) }})}
                    min={3}
                    max={5}
                    step="0.1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kpisConversionTarget">Meta de Conversiones</Label>
                  <Input
                    id="kpisConversionTarget"
                    type="number"
                    value={analyticsConfig.kpis.conversionTarget}
                    onChange={(e) => setAnalyticsConfig({...analyticsConfig, kpis: { ...analyticsConfig.kpis, conversionTarget: parseInt(e.target.value) }})}
                    min={5}
                    max={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kpisRetentionTarget">Meta de Retención</Label>
                  <Input
                    id="kpisRetentionTarget"
                    type="number"
                    value={analyticsConfig.kpis.retentionTarget}
                    onChange={(e) => setAnalyticsConfig({...analyticsConfig, kpis: { ...analyticsConfig.kpis, retentionTarget: parseInt(e.target.value) }})}
                    min={50}
                    max={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataExportCsv">Exportar CSV</Label>
                  <Select value={analyticsConfig.dataExport.csvExport ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, dataExport: { ...analyticsConfig.dataExport, csvExport: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataExportJson">Exportar JSON</Label>
                  <Select value={analyticsConfig.dataExport.jsonExport ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, dataExport: { ...analyticsConfig.dataExport, jsonExport: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiAccess">Acceso a API</Label>
                  <Select value={analyticsConfig.dataExport.apiAccess ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, dataExport: { ...analyticsConfig.dataExport, apiAccess: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookNotifications">Notificaciones de Webhook</Label>
                  <Select value={analyticsConfig.dataExport.webhookNotifications ? 'true' : 'false'} onValueChange={(value) => setAnalyticsConfig({...analyticsConfig, dataExport: { ...analyticsConfig.dataExport, webhookNotifications: value === 'true' }})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={() => saveConfiguration('analytics')} 
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Configuration Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración Avanzada
              </CardTitle>
              <CardDescription>
                Configura opciones avanzadas del chatbot, como personalización de respuestas y manejo de errores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customInstructions">Instrucciones Personalizadas</Label>
                  <Textarea
                    id="customInstructions"
                    value={aiConfig.customInstructions}
                    onChange={(e) => setAiConfig({...aiConfig, customInstructions: e.target.value})}
                    placeholder="Instrucciones adicionales para el chatbot..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxResponseTime">Tiempo Máximo de Respuesta</Label>
                  <Input
                    id="maxResponseTime"
                    type="number"
                    value={aiConfig.maxResponseTime}
                    onChange={(e) => setAiConfig({...aiConfig, maxResponseTime: parseInt(e.target.value)})}
                    min={10}
                    max={120}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fallbackModel">Modelo de Fallback</Label>
                  <Select value={aiConfig.fallbackModel} onValueChange={(value) => setAiConfig({...aiConfig, fallbackModel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enableStreaming">Streaming de Respuestas</Label>
                  <Select value={aiConfig.enableStreaming ? 'true' : 'false'} onValueChange={(value) => setAiConfig({...aiConfig, enableStreaming: value === 'true'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Habilitado</SelectItem>
                      <SelectItem value="false">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topP">Top P</Label>
                  <Input
                    id="topP"
                    type="number"
                    step="0.1"
                    value={aiConfig.topP}
                    onChange={(e) => setAiConfig({...aiConfig, topP: parseFloat(e.target.value)})}
                    min={0}
                    max={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    0 = Determinístico, 1 = Muy creativo
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequencyPenalty">Penalización de Frecuencia</Label>
                  <Input
                    id="frequencyPenalty"
                    type="number"
                    step="0.1"
                    value={aiConfig.frequencyPenalty}
                    onChange={(e) => setAiConfig({...aiConfig, frequencyPenalty: parseFloat(e.target.value)})}
                    min={-2}
                    max={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    -2 = Muy penaliza la repetición, 2 = No penaliza la repetición
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="presencePenalty">Penalización de Presencia</Label>
                  <Input
                    id="presencePenalty"
                    type="number"
                    step="0.1"
                    value={aiConfig.presencePenalty}
                    onChange={(e) => setAiConfig({...aiConfig, presencePenalty: parseFloat(e.target.value)})}
                    min={-2}
                    max={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    -2 = Muy penaliza la repetición, 2 = No penaliza la repetición
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memoryContext">Contexto de Memoria</Label>
                  <Input
                    id="memoryContext"
                    type="number"
                    value={aiConfig.memoryContext}
                    onChange={(e) => setAiConfig({...aiConfig, memoryContext: parseInt(e.target.value)})}
                    min={1}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    Número de mensajes anteriores a considerar para el contexto
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personality">Personalidad</Label>
                  <Select value={aiConfig.personality} onValueChange={(value) => setAiConfig({...aiConfig, personality: value as 'formal' | 'casual' | 'technical' | 'friendly' | 'professional' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Profesional Formal</SelectItem>
                      <SelectItem value="casual">Amigable Casual</SelectItem>
                      <SelectItem value="technical">Técnico</SelectItem>
                      <SelectItem value="friendly">Amigable</SelectItem>
                      <SelectItem value="professional">Profesional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma de Respuesta</Label>
                  <Select value={aiConfig.language} onValueChange={(value) => setAiConfig({...aiConfig, language: value as 'es' | 'en' | 'pt' | 'auto' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">Inglés</SelectItem>
                      <SelectItem value="pt">Portugués</SelectItem>
                      <SelectItem value="auto">Auto-Detectar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responseStyle">Estilo de Respuesta</Label>
                  <Select value={aiConfig.responseStyle} onValueChange={(value) => setAiConfig({...aiConfig, responseStyle: value as 'concise' | 'detailed' | 'conversational' | 'technical' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Conciso</SelectItem>
                      <SelectItem value="detailed">Detallado</SelectItem>
                      <SelectItem value="conversational">Conversacional</SelectItem>
                      <SelectItem value="technical">Técnico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo de IA</Label>
                  <Select value={aiConfig.model} onValueChange={(value) => setAiConfig({...aiConfig, model: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini (Recomendado)</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={() => saveConfiguration('advanced')} 
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Estado del Chatbot</Badge>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Configurado</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configuración Avanzada
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

