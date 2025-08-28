import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar Sesión | Automatía",
  description: "Accede a tu cuenta de Automatía. Login seguro con email/password o Google. Gestiona tu chatbot de IA para WhatsApp desde tu dashboard personal.",
  keywords: [
    "login Automatía",
    "iniciar sesión",
    "acceso cuenta",
    "dashboard chatbot",
    "autenticación segura",
    "WhatsApp Business"
  ],
  openGraph: {
    title: "Iniciar Sesión | Automatía",
    description: "Accede a tu cuenta de Automatía. Login seguro con email/password o Google.",
    type: "website",
    url: "https://automatia.com/login",
    images: [
      {
        url: "/images/og-login.jpg",
        width: 1200,
        height: 630,
        alt: "Login - Automatía",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iniciar Sesión | Automatía",
    description: "Accede a tu cuenta de Automatía. Login seguro con email/password o Google.",
    images: ["/images/og-login.jpg"],
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
