import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "stable"
  description?: string
  className?: string
}

export function KpiCard({ title, value, change, trend, description, className }: KpiCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />
      case "down":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-success-green"
      case "down":
        return "text-alert-red"
      default:
        return "text-silver-gray"
    }
  }

  return (
    <Card className={cn("bg-automatia-black border-charcoal-gray", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-automatia-white">{title}</CardTitle>
        {trend && (
          <div className={cn("flex items-center space-x-1", getTrendColor())}>
            {getTrendIcon()}
            {change !== undefined && (
              <span className="text-xs font-medium">
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-automatia-gold">{value}</div>
        {description && <p className="text-xs text-silver-gray mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
