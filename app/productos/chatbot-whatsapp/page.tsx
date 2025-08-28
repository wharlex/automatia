import { Metadata } from "next"
import ChatbotWhatsAppClient from "./ChatbotWhatsAppClient"

export const metadata: Metadata = {
  title: "Chatbot de WhatsApp con IA | Automatía",
  description: "Automatía es un ecosistema de IA. Descubre nuestro Chatbot de WhatsApp: responde, automatiza y vende por ti, por solo 500 USD/mes.",
  keywords: "IA para negocios, WhatsApp con inteligencia artificial, chatbot avanzado que vende, automatización empresarial con IA",
  openGraph: {
    title: "Chatbot de WhatsApp con IA | Automatía",
    description: "Automatía es un ecosistema de IA. Descubre nuestro Chatbot de WhatsApp: responde, automatiza y vende por ti, por solo 500 USD/mes.",
    type: "website",
    url: "https://automatia.store/productos/chatbot-whatsapp",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chatbot de WhatsApp con IA | Automatía",
    description: "Automatía es un ecosistema de IA. Descubre nuestro Chatbot de WhatsApp: responde, automatiza y vende por ti, por solo 500 USD/mes.",
  },
}

export default function ChatbotWhatsAppPage() {
  return <ChatbotWhatsAppClient />
}
