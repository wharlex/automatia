"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, BarChart3 } from "lucide-react"

const modules = [
  {
    id: "chatbot-pro",
    name: "Chatbot Pro",
    description: "Asistente conversacional inteligente para atención al cliente 24/7",
    icon: MessageSquare,
    price: "$497",
    recommended: true,
    tags: ["Popular", "IA Avanzada"],
  },
  {
    id: "lead-generator",
    name: "Lead Generator",
    description: "Genera y califica leads automáticamente desde múltiples canales",
    icon: Users,
    price: "$297",
    recommended: false,
    tags: ["Ventas", "Automatización"],
  },
  {
    id: "analytics-pro",
    name: "Analytics Pro",
    description: "Análisis predictivo y reportes automáticos de rendimiento",
    icon: BarChart3,
    price: "$197",
    recommended: false,
    tags: ["Análisis", "Reportes"],
  },
]

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-automatia-white">Marketplace</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const IconComponent = module.icon
          return (
            <Card key={module.id} className="bg-automatia-teal/30 border-automatia-gold/20 relative">
              {module.recommended && (
                <Badge className="absolute -top-2 -right-2 bg-automatia-gold text-automatia-black">Recomendado</Badge>
              )}
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-automatia-gold/20 rounded-lg">
                    <IconComponent className="h-6 w-6 text-automatia-gold" />
                  </div>
                  <div>
                    <CardTitle className="text-automatia-white">{module.name}</CardTitle>
                    <p className="text-2xl font-bold automatia-gold">{module.price}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-automatia-white/80">{module.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {module.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-automatia-gold/30 text-automatia-gold">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full">Activar módulo</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
