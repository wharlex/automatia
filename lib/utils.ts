import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export function generateDemoData() {
  return {
    modules: [
      {
        id: "1",
        accountId: "demo",
        type: "chatbot" as const,
        name: "Chatbot Pro",
        status: "active" as const,
        createdAt: new Date(),
        settings: {},
        metrics: {
          messages24h: 247,
          satisfaction: 94,
          timeSaved: 8.5,
        },
      },
    ],
    kpis: [
      { label: "Módulos activos", value: 3, trend: "up" as const },
      { label: "Mensajes hoy", value: 247, trend: "up" as const },
      { label: "Satisfacción", value: "94%", trend: "stable" as const },
      { label: "Tiempo ahorrado", value: "8.5h", trend: "up" as const },
    ],
  }
}
