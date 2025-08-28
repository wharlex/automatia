"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal } from "lucide-react"

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-automatia-white">Mis módulos</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agregar módulo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-automatia-teal/30 border-automatia-gold/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-automatia-white">Chatbot Pro</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Activo</Badge>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-automatia-white">Mensajes 24h:</span>
                  <span className="automatia-gold">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-automatia-white">Satisfacción:</span>
                  <span className="automatia-gold">94%</span>
                </div>
              </div>
              <Button className="w-full">Configurar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
