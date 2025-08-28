import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, Poppins } from "next/font/google"
import "./globals.css"
import dynamic from "next/dynamic"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

// Lazy load components that are not immediately needed
const Analytics = dynamic(() => import("@/components/analytics").then(mod => ({ default: mod.Analytics })), {
  ssr: false,
  loading: () => null
})

const PWAInstallPrompt = dynamic(() => import("@/components/pwa-install-prompt").then(mod => ({ default: mod.PWAInstallPrompt })), {
  ssr: false,
  loading: () => null
})

const GoogleAnalyticsScript = dynamic(() => import("@/components/analytics").then(mod => ({ default: mod.GoogleAnalyticsScript })), {
  ssr: false,
  loading: () => null
})

const HotjarScript = dynamic(() => import("@/components/analytics").then(mod => ({ default: mod.HotjarScript })), {
  ssr: false,
  loading: () => null
})

// Optimized font loading with display swap and preload
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ['system-ui', 'arial'],
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  preload: true,
  fallback: ['system-ui', 'arial'],
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: {
    default: "Automatía - La IA que atiende, vende y fideliza clientes por ti, las 24 horas",
    template: "%s | Automatía"
  },
  description: "Tu nuevo asistente autónomo conectado a WhatsApp, entrenado para tu negocio y listo en 48 horas. Chatbot Pro: $497/mes. Implementación ultra rápida con IA especializada por industria.",
  keywords: [
    "WhatsApp chatbot",
    "IA conversacional",
    "automatización de ventas",
    "atención al cliente 24/7",
    "marketing automatizado",
    "inteligencia artificial",
    "automatización de procesos",
    "chatbot empresarial",
    "WhatsApp Business API",
    "ROI inmediato"
  ],
  authors: [{ name: "Valentín Rodríguez", url: "https://automatia.com" }],
  creator: "Automatía",
  publisher: "Automatía",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://automatia.com'),
  alternates: {
    canonical: '/',
    languages: {
      'es-AR': '/es-AR',
      'en-US': '/en-US',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://automatia.com',
    title: 'Automatía - La IA que atiende, vende y fideliza clientes por ti',
    description: 'Tu nuevo asistente autónomo conectado a WhatsApp, entrenado para tu negocio y listo en 48 horas.',
    siteName: 'Automatía',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Automatía - Plataforma de IA para WhatsApp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automatía - La IA que atiende, vende y fideliza clientes por ti',
    description: 'Tu nuevo asistente autónomo conectado a WhatsApp, entrenado para tu negocio y listo en 48 horas.',
    images: ['/images/twitter-image.jpg'],
    creator: '@automatia',
    site: '@automatia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'Business Software',
  other: {
    'theme-color': '#0a1c2f',
    'msapplication-TileColor': '#c5b358',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Automatía',
    'application-name': 'Automatía',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="es" 
      className={`${inter.variable} ${montserrat.variable} ${poppins.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/images/logo.png" as="image" />
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Automatía",
              "description": "Plataforma de IA para automatización de WhatsApp Business",
              "url": "https://automatia.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "497",
                "priceCurrency": "USD",
                "priceValidUntil": "2025-12-31"
              },
              "author": {
                "@type": "Person",
                "name": "Valentín Rodríguez",
                "jobTitle": "CEO & Founder",
                "worksFor": {
                  "@type": "Organization",
                  "name": "Automatía"
                }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "127"
              }
            })
          }}
        />
        {/* Analytics Scripts */}
        <GoogleAnalyticsScript />
        <HotjarScript />
      </head>
      <body className="min-h-screen bg-automatia-teal text-automatia-white font-sans">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <PWAInstallPrompt />
        
        {/* Performance monitoring script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if ('performance' in window) {
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                      console.log('🚀 Performance Metrics:', {
                        'Time to First Byte': Math.round(perfData.responseStart - perfData.requestStart) + 'ms',
                        'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart) + 'ms',
                        'Load Complete': Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms',
                        'Total Load Time': Math.round(perfData.loadEventEnd - perfData.requestStart) + 'ms'
                      });
                    }
                  }, 0);
                });
              }
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
