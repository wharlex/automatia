import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre Nosotros | Automatía",
  description: "Conoce la historia de Automatía, fundada por Valentín Rodríguez. Democratizamos la automatización inteligente para que cualquier negocio pueda competir con IA de nivel empresarial.",
  keywords: [
    "Automatía empresa",
    "Valentín Rodríguez",
    "historia Automatía",
    "fundador Automatía",
    "automatización inteligente",
    "IA empresarial"
  ],
  openGraph: {
    title: "Sobre Nosotros | Automatía",
    description: "Conoce la historia de Automatía, fundada por Valentín Rodríguez.",
    type: "website",
    url: "https://automatia.com/sobre-nosotros",
    images: [
      {
        url: "/images/og-sobre-nosotros.jpg",
        width: 1200,
        height: 630,
        alt: "Sobre Nosotros - Automatía",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre Nosotros | Automatía",
    description: "Conoce la historia de Automatía, fundada por Valentín Rodríguez.",
    images: ["/images/og-sobre-nosotros.jpg"],
  },
}

export default function SobreNosotrosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
