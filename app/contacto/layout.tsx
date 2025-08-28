import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto | Automatía",
  description: "Contacta con el equipo de Automatía. Soporte técnico, consultas comerciales y asistencia personalizada. WhatsApp: +54 9 341 611-5981 | Email: contacto@automatia.store",
  keywords: [
    "contacto Automatía",
    "soporte chatbot WhatsApp",
    "consultas IA empresarial",
    "WhatsApp Business",
    "automatización de ventas"
  ],
  openGraph: {
    title: "Contacto | Automatía",
    description: "Contacta con el equipo de Automatía. Soporte técnico y consultas comerciales.",
    type: "website",
    url: "https://automatia.com/contacto",
    images: [
      {
        url: "/images/og-contacto.jpg",
        width: 1200,
        height: 630,
        alt: "Contacto Automatía",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto | Automatía",
    description: "Contacta con el equipo de Automatía. Soporte técnico y consultas comerciales.",
    images: ["/images/og-contacto.jpg"],
  },
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
