"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  Brain, 
  MessageSquare, 
  Shield, 
  Zap, 
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Palette,
  Languages,
  Clock,
  Users,
  Database
} from 'lucide-react'
import { useAccessControl } from '@/hooks/useAccessControl'
import { LockedFeature } from '@/components/dashboard/LockedFeature'
import { useToast } from '@/hooks/use-toast'

interface AdvancedConfig {
  ai: {
    model: string
    maxTokens: number
    temperature: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
    systemPrompt: string
    customInstructions: string
    contextWindow: number
    responseFormat: 'text' | 'json' | 'markdown'
  }
  behavior: {
    responseDelay: number
    typingIndicator: boolean
    autoRespond: boolean
    maxConversationLength: number
    conversationTimeout: number
    language: string
    tone: 'professional' | 'friendly' | 'casual' | 'formal'
    personality: string
  }
  security: {
    contentFilter: boolean
    profanityFilter: boolean
    sensitiveDataMasking: boolean
    rateLimit: number
    maxRequestsPerMinute: number
    blockList: string[]
    allowList: string[]
  }
  integration: {
    webhooks: string[]
    apiKeys: string[]
    externalServices: string[]
    customFunctions: string[]
    databaseConnections: string[]
  }
  performance: {
    caching: boolean
    cacheTTL: number
    compression: boolean
    batchProcessing: boolean
    maxConcurrentRequests: number
    timeout: number
  }
}

export default function AdvancedPage() {
  const { hasAccess, isLoading } = useAccessControl()
  const { toast } = useToast()
  const [config, setConfig] = useState<AdvancedConfig | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  // Load configuration on mount
  useEffect(() => {
    if (hasAccess) {
      loadAdvancedConfig()
    }
  }, [hasAccess])

  const loadAdvancedConfig = async () => {
    setIsLoadingData(true)
    try {
      // For now, generate mock data
      // In real implementation, fetch from API
      const mockConfig: AdvancedConfig = {
        ai: {
          model: 'gpt-4o-mini',
          maxTokens: 1000,
          temperature: 0.7,
          topP: 1.0,
          frequencyPenalty: 0.0,
          presencePenalty: 0.0,
          systemPrompt: 'Eres un asistente virtual profesional y amigable para un negocio. Responde de manera clara, útil y siempre mantén un tono profesional pero cercano.',
          customInstructions: 'Siempre incluye información relevante del negocio en tus respuestas. Sé conciso pero completo.',
          contextWindow: 4000,
          responseFormat: 'text'
        },
        behavior: {
          responseDelay: 1000,
          typingIndicator: true,
          autoRespond: true,
          maxConversationLength: 50,
          conversationTimeout: 3600000, // 1 hour
          language: 'es',
          tone: 'friendly',
          personality: 'Amigable, profesional, servicial y empático'
        },
        security: {
          contentFilter: true,
          profanityFilter: true,
          sensitiveDataMasking: true,
          rateLimit: 10,
          maxRequestsPerMinute: 60,
          blockList: ['spam', 'inappropriate'],
          allowList: ['customers', 'partners']
        },
        integration: {
          webhooks: ['https://api.example.com/webhook'],
          apiKeys: ['sk-...'],
          externalServices: ['CRM', 'Payment Gateway'],
          customFunctions: ['calculate_discount', 'check_inventory'],
          databaseConnections: ['postgresql', 'redis']
        },
        performance: {
          caching: true,
          cacheTTL: 300, // 5 minutes
          compression: true,
          batchProcessing: true,
          maxConcurrentRequests: 100,
          timeout: 30000 // 30 seconds
        }
      }
      
      setConfig(mockConfig)
    } catch (error) {
      console.error('Error loading advanced config:', error)
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración avanzada.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const updateConfig = (section: keyof AdvancedConfig, field: string, value: any) => {
    if (!config) return
    
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [field]: value
      }
    })
    setHasChanges(true)
  }

  const saveConfig = async () => {
    if (!config) return
    
    setIsSaving(true)
    try {
      // In real implementation, save to API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setHasChanges(false)
      toast({
        title: "Configuración guardada",
        description: "La configuración avanzada se ha guardado correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const resetToDefaults = () => {
    if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) {
      loadAdvancedConfig()
      setHasChanges(false)
      toast({
        title: "Configuración restaurada",
        description: "Se han restaurado los valores por defecto.",
      })
    }
  }

  const testConfiguration = async () => {
    try {
      // In real implementation, test the configuration
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate test
      
      toast({
        title: "Configuración probada",
        description: "La configuración se ha probado exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error en la prueba",
        description: "La configuración falló en la prueba.",
        variant: "destructive"
      })
    }
  }

  // Show loading while checking access
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // Show locked feature if user doesn't have access
  if (!hasAccess) {
    return (
      <LockedFeature 
        feature="advanced" 
        userEmail=""
      />
    )
  }

  if (!config) {
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
          <h1 className="text-3xl font-bold">Configuración Avanzada</h1>
          <p className="text-muted-foreground">
            Configuración avanzada del chatbot y personalización avanzada
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            Restaurar Defaults
          </Button>
          <Button variant="outline" onClick={testConfiguration}>
            Probar Config
          </Button>
          <Button 
            onClick={saveConfig} 
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Guardar Cambios
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800">
            Tienes cambios sin guardar. Guarda la configuración para aplicarlos.
          </span>
        </div>
      )}

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            IA
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Comportamiento
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Integración
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* AI Configuration Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Configuración de IA
              </CardTitle>
              <CardDescription>
                Ajusta los parámetros del modelo de IA y el comportamiento del chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelo de IA</label>
                  <select
                    value={config.ai.model}
                    onChange={(e) => updateConfig('ai', 'model', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tokens Máximos</label>
                  <Input
                    type="number"
                    value={config.ai.maxTokens}
                    onChange={(e) => updateConfig('ai', 'maxTokens', parseInt(e.target.value))}
                    min="100"
                    max="4000"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temperatura</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={config.ai.temperature}
                    onChange={(e) => updateConfig('ai', 'temperature', parseFloat(e.target.value))}
                    min="0"
                    max="2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controla la creatividad (0 = foco, 2 = muy creativo)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Top P</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={config.ai.topP}
                    onChange={(e) => updateConfig('ai', 'topP', parseFloat(e.target.value))}
                    min="0"
                    max="1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Prompt del Sistema</label>
                <Textarea
                  value={config.ai.systemPrompt}
                  onChange={(e) => updateConfig('ai', 'systemPrompt', e.target.value)}
                  rows={4}
                  placeholder="Define el comportamiento base del chatbot..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Instrucciones Personalizadas</label>
                <Textarea
                  value={config.ai.customInstructions}
                  onChange={(e) => updateConfig('ai', 'customInstructions', e.target.value)}
                  rows={3}
                  placeholder="Instrucciones adicionales para el comportamiento..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ventana de Contexto</label>
                  <Input
                    type="number"
                    value={config.ai.contextWindow}
                    onChange={(e) => updateConfig('ai', 'contextWindow', parseInt(e.target.value))}
                    min="1000"
                    max="8000"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Formato de Respuesta</label>
                  <select
                    value={config.ai.responseFormat}
                    onChange={(e) => updateConfig('ai', 'responseFormat', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="text">Texto</option>
                    <option value="json">JSON</option>
                    <option value="markdown">Markdown</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Configuration Tab */}
        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comportamiento del Chatbot
              </CardTitle>
              <CardDescription>
                Personaliza cómo se comporta y responde el chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Retraso de Respuesta (ms)</label>
                  <Input
                    type="number"
                    value={config.behavior.responseDelay}
                    onChange={(e) => updateConfig('behavior', 'responseDelay', parseInt(e.target.value))}
                    min="0"
                    max="10000"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Idioma</label>
                  <select
                    value={config.behavior.language}
                    onChange={(e) => updateConfig('behavior', 'language', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tono</label>
                  <select
                    value={config.behavior.tone}
                    onChange={(e) => updateConfig('behavior', 'tone', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="professional">Profesional</option>
                    <option value="friendly">Amigable</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Longitud Máxima de Conversación</label>
                  <Input
                    type="number"
                    value={config.behavior.maxConversationLength}
                    onChange={(e) => updateConfig('behavior', 'maxConversationLength', parseInt(e.target.value))}
                    min="10"
                    max="200"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Personalidad</label>
                <Textarea
                  value={config.behavior.personality}
                  onChange={(e) => updateConfig('behavior', 'personality', e.target.value)}
                  rows={3}
                  placeholder="Describe la personalidad del chatbot..."
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Características</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.behavior.typingIndicator}
                      onCheckedChange={(checked) => updateConfig('behavior', 'typingIndicator', checked)}
                    />
                    <label className="text-sm">Indicador de escritura</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.behavior.autoRespond}
                      onCheckedChange={(checked) => updateConfig('behavior', 'autoRespond', checked)}
                    />
                    <label className="text-sm">Respuesta automática</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Configuration Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>
                Configura las medidas de seguridad y filtros de contenido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Filtros de Contenido</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.security.contentFilter}
                      onCheckedChange={(checked) => updateConfig('security', 'contentFilter', checked)}
                    />
                    <label className="text-sm">Filtro de contenido</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.security.profanityFilter}
                      onCheckedChange={(checked) => updateConfig('security', 'profanityFilter', checked)}
                    />
                    <label className="text-sm">Filtro de profanidad</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.security.sensitiveDataMasking}
                      onCheckedChange={(checked) => updateConfig('security', 'sensitiveDataMasking', checked)}
                    />
                    <label className="text-sm">Enmascarar datos sensibles</label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Límite de Tasa</label>
                  <Input
                    type="number"
                    value={config.security.rateLimit}
                    onChange={(e) => updateConfig('security', 'rateLimit', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Máx. Requests/Minuto</label>
                  <Input
                    type="number"
                    value={config.security.maxRequestsPerMinute}
                    onChange={(e) => updateConfig('security', 'maxRequestsPerMinute', parseInt(e.target.value))}
                    min="10"
                    max="1000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Lista de Bloqueo</label>
                <Textarea
                  value={config.security.blockList.join(', ')}
                  onChange={(e) => updateConfig('security', 'blockList', e.target.value.split(', ').filter(Boolean))}
                  rows={2}
                  placeholder="Palabras o frases bloqueadas (separadas por comas)"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Lista de Permisos</label>
                <Textarea
                  value={config.security.allowList.join(', ')}
                  onChange={(e) => updateConfig('security', 'allowList', e.target.value.split(', ').filter(Boolean))}
                  rows={2}
                  placeholder="Palabras o frases permitidas (separadas por comas)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Configuration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Integraciones y APIs
              </CardTitle>
              <CardDescription>
                Configura integraciones externas y conexiones de API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Webhooks</label>
                <Textarea
                  value={config.integration.webhooks.join('\n')}
                  onChange={(e) => updateConfig('integration', 'webhooks', e.target.value.split('\n').filter(Boolean))}
                  rows={3}
                  placeholder="URLs de webhooks (una por línea)"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Claves de API</label>
                <Textarea
                  value={config.integration.apiKeys.join('\n')}
                  onChange={(e) => updateConfig('integration', 'apiKeys', e.target.value.split('\n').filter(Boolean))}
                  rows={3}
                  placeholder="Claves de API (una por línea)"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Servicios Externos</label>
                <Textarea
                  value={config.integration.externalServices.join(', ')}
                  onChange={(e) => updateConfig('integration', 'externalServices', e.target.value.split(', ').filter(Boolean))}
                  rows={2}
                  placeholder="Servicios externos (separados por comas)"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Funciones Personalizadas</label>
                <Textarea
                  value={config.integration.customFunctions.join(', ')}
                  onChange={(e) => updateConfig('integration', 'customFunctions', e.target.value.split(', ').filter(Boolean))}
                  rows={2}
                  placeholder="Funciones personalizadas (separadas por comas)"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Conexiones de Base de Datos</label>
                <Textarea
                  value={config.integration.databaseConnections.join(', ')}
                  onChange={(e) => updateConfig('integration', 'databaseConnections', e.target.value.split(', ').filter(Boolean))}
                  rows={2}
                  placeholder="Conexiones de base de datos (separadas por comas)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Configuration Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Optimización de Performance
              </CardTitle>
              <CardDescription>
                Configura la optimización y rendimiento del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Optimizaciones</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.performance.caching}
                      onCheckedChange={(checked) => updateConfig('performance', 'caching', checked)}
                    />
                    <label className="text-sm">Habilitar caché</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.performance.compression}
                      onCheckedChange={(checked) => updateConfig('performance', 'compression', checked)}
                    />
                    <label className="text-sm">Compresión de datos</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.performance.batchProcessing}
                      onCheckedChange={(checked) => updateConfig('performance', 'batchProcessing', checked)}
                    />
                    <label className="text-sm">Procesamiento por lotes</label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">TTL del Caché (segundos)</label>
                  <Input
                    type="number"
                    value={config.performance.cacheTTL}
                    onChange={(e) => updateConfig('performance', 'cacheTTL', parseInt(e.target.value))}
                    min="60"
                    max="3600"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Máx. Requests Concurrentes</label>
                  <Input
                    type="number"
                    value={config.performance.maxConcurrentRequests}
                    onChange={(e) => updateConfig('performance', 'maxConcurrentRequests', parseInt(e.target.value))}
                    min="10"
                    max="1000"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timeout (ms)</label>
                  <Input
                    type="number"
                    value={config.performance.timeout}
                    onChange={(e) => updateConfig('performance', 'timeout', parseInt(e.target.value))}
                    min="5000"
                    max="120000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}



