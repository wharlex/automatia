import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registrarse | Automatía",
  description: "Crea tu cuenta en Automatía y comienza a automatizar tu negocio con IA. Chatbot inteligente para WhatsApp con implementación en 48 horas. Registro gratuito y sin compromiso.",
  keywords: [
    "registro Automatía",
    "crear cuenta",
    "registrarse gratis",
    "chatbot WhatsApp",
    "automatización IA",
    "WhatsApp Business"
  ],
  openGraph: {
    title: "Registrarse | Automatía",
    description: "Crea tu cuenta en Automatía y comienza a automatizar tu negocio con IA.",
    type: "website",
    url: "https://automatia.com/register",
    images: [
      {
        url: "/images/og-register.jpg",
        width: 1200,
        height: 630,
        alt: "Registro - Automatía",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Registrarse | Automatía",
    description: "Crea tu cuenta en Automatía y comienza a automatizar tu negocio con IA.",
    images: ["/images/og-register.jpg"],
  },
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
