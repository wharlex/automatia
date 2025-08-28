"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { KpiMetric } from "@/lib/types"

interface KpiCardProps {
  metric: KpiMetric
}

export function KpiCard({ metric }: KpiCardProps) {
  // Validate that metric exists and has required properties
  if (!metric || !metric.trend) {
    return (
      <Card className="bg-automatia-teal/30 border-automatia-gold/20">
        <CardContent className="p-6 text-center">
          <div className="text-sm text-automatia-white">Cargando...</div>
        </CardContent>
      </Card>
    )
  }
  
  const TrendIcon = metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Minus

  return (
    <Card className="bg-automatia-teal/30 border-automatia-gold/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-automatia-white">{metric.label}</CardTitle>
        <TrendIcon
          className={`h-4 w-4 ${
            metric.trend === "up" ? "text-green-400" : metric.trend === "down" ? "text-red-400" : "text-automatia-gold"
          }`}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold automatia-gold">{metric.value}</div>
      </CardContent>
    </Card>
  )
}
