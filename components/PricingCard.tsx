import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PricingCardProps {
  name: string
  priceUsd: number
  description: string
  active: boolean
  features?: string[]
  isPopular?: boolean
}

export function PricingCard({ name, priceUsd, description, active, features, isPopular }: PricingCardProps) {
  return (
    <Card
      className={`relative ${isPopular ? "border-bright-gold shadow-lg" : "border-charcoal-gray"} bg-automatia-black`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-bright-gold text-deep-black px-3 py-1 rounded-full text-sm font-semibold">
            Más Popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-automatia-white font-heading">{name}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-bright-gold">${priceUsd}</span>
          <span className="text-silver-gray">USD</span>
        </div>
        <CardDescription className="text-silver-gray">{description}</CardDescription>
        {!active && <p className="text-alert-red text-sm font-medium">No disponible</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {features && (
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-automatia-white">
                <Check className="h-4 w-4 text-success-green" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        )}
        <Button
          className={`w-full ${isPopular ? "bg-bright-gold hover:bg-automatia-gold text-deep-black" : "bg-electric-blue hover:bg-blue-600 text-pure-white"}`}
          disabled={!active}
        >
          {active ? "Contratar Ahora" : "No Disponible"}
        </Button>
      </CardContent>
    </Card>
  )
}
