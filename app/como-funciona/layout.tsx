import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cómo Funciona | Automatía",
  description: "Descubre cómo Automatía implementa chatbots de IA en WhatsApp en solo 48 horas. Proceso simple en 3 pasos: configuración, entrenamiento y activación.",
  keywords: [
    "cómo funciona Automatía",
    "implementación chatbot WhatsApp",
    "proceso automatización IA",
    "chatbot en 48 horas",
    "WhatsApp Business API",
    "inteligencia artificial"
  ],
  openGraph: {
    title: "Cómo Funciona | Automatía",
    description: "Descubre cómo Automatía implementa chatbots de IA en WhatsApp en solo 48 horas.",
    type: "website",
    url: "https://automatia.com/como-funciona",
    images: [
      {
        url: "/images/og-como-funciona.jpg",
        width: 1200,
        height: 630,
        alt: "Cómo Funciona - Automatía",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo Funciona | Automatía",
    description: "Descubre cómo Automatía implementa chatbots de IA en WhatsApp en solo 48 horas.",
    images: ["/images/og-como-funciona.jpg"],
  },
}

export default function ComoFuncionaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
