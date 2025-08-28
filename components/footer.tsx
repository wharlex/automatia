import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ArrowRight,
  Heart,
  Zap,
  Shield,
  Users,
  Globe,
  Award,
  TrendingUp
} from "lucide-react"
import Image from "next/image"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "Productos",
      links: [
        { href: "/como-funciona", label: "Cómo funciona", description: "Proceso simple en 3 pasos" },
        { href: "/precios", label: "Precios", description: "Planes transparentes" },
        { href: "/contacto", label: "Contacto", description: "Habla con nuestros expertos" }
      ]
    },
    {
      title: "Empresa",
      links: [
        { href: "/sobre-nosotros", label: "Sobre nosotros", description: "Nuestra historia y misión" },
        { href: "/contacto", label: "Contacto", description: "Habla con nuestros expertos" }
      ]
    },
    {
      title: "Recursos",
      links: [
        { href: "/contacto", label: "Soporte", description: "Escribinos a contacto@automatia.store" }
      ]
    }
  ]

  const socialLinks = [
    { icon: Mail, href: "mailto:contacto@automatia.store", label: "Email", color: "hover:text-automatia-gold" },
    { icon: Phone, href: "tel:+5491112345678", label: "Teléfono", color: "hover:text-automatia-gold" }
  ]

  const stats = [
    { icon: Users, value: "500+", label: "Empresas activas" },
    { icon: Globe, value: "25+", label: "Países" },
    { icon: Award, value: "98%", label: "Satisfacción" },
    { icon: TrendingUp, value: "300%", label: "ROI promedio" }
  ]

  return (
    <footer className="bg-gradient-to-br from-automatia-black via-automatia-teal/20 to-automatia-black border-t border-automatia-gold/20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Automatía</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#C5B358] transition-colors">Inicio</Link></li>
              <li><Link href="/como-funciona" className="hover:text-[#C5B358] transition-colors">Cómo Funciona</Link></li>
              <li><Link href="/productos" className="hover:text-[#C5B358] transition-colors">Productos</Link></li>
              <li><Link href="/sobre-nosotros" className="hover:text-[#C5B358] transition-colors">Sobre Nosotros</Link></li>
            </ul>
          </div>
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image 
                  src="/images/logo.png" 
                  alt="Automatía Logo" 
                  width={48} 
                  height={48} 
                  className="h-12 w-auto"
                />
                <div className="absolute inset-0 w-12 h-12 bg-automatia-gold/20 rounded-full blur-xl"></div>
              </div>
              <span className="text-2xl font-bold text-automatia-gold">Automatía</span>
            </div>
            
            <p className="text-automatia-white/80 text-lg leading-relaxed max-w-md">
              Democratizamos la automatización inteligente para que cualquier negocio pueda competir con IA de nivel empresarial.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-automatia-black/30 rounded-lg border border-automatia-gold/10 hover:border-automatia-gold/20 transition-colors duration-300">
                  <stat.icon className="w-6 h-6 text-automatia-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-automatia-gold">{stat.value}</div>
                  <div className="text-sm text-automatia-white/70">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  size="sm" 
                  className="h-10 w-10 p-0 bg-automatia-black/30 border border-automatia-gold/20 hover:bg-automatia-gold/10 hover:border-automatia-gold/40 transition-all duration-300 hover:scale-110"
                  asChild
                >
                  <Link href={social.href} aria-label={social.label}>
                    <social.icon className="h-5 w-5 text-automatia-white/70 hover:text-automatia-gold transition-colors duration-300" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-6">
              <h3 className="text-lg font-semibold text-automatia-white border-b border-automatia-gold/30 pb-2">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="group flex flex-col space-y-1 text-automatia-white/70 hover:text-automatia-gold transition-colors duration-300"
                    >
                      <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                      <span className="text-sm text-automatia-white/50 group-hover:text-automatia-white/70 transition-colors duration-300">
                        {link.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-12 border-t border-automatia-gold/20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-automatia-gold" />
              <h3 className="text-2xl font-bold text-automatia-white">
                Mantente Actualizado
              </h3>
            </div>
            <p className="text-automatia-white/80 mb-6 text-lg">
              Recibe las últimas novedades sobre IA, automatización y casos de éxito directamente en tu email
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-automatia-white/50" />
                <Input 
                  placeholder="tu@email.com" 
                  className="pl-10 pr-4 py-3 bg-automatia-black/50 border-automatia-gold/20 text-automatia-white placeholder-automatia-white/50 focus:border-automatia-gold focus:ring-automatia-gold/20"
                />
              </div>
              <Button className="bg-automatia-gold text-automatia-black hover:bg-automatia-gold/90 px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 group">
                Suscribirse
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
            
            <p className="text-xs text-automatia-white/50 mt-3">
              ✨ Sin spam • Cancelar en cualquier momento • Respetamos tu privacidad
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-automatia-gold/20 bg-automatia-black/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Company Info */}
            <div className="text-center lg:text-left space-y-2">
              <p className="text-sm font-medium text-automatia-white/90">
                "Automatía: no vendemos flujos sueltos; vendemos sistemas inteligentes que funcionan desde el día uno"
              </p>
              <p className="text-xs text-automatia-white/60 flex items-center justify-center lg:justify-start gap-2">
                © {currentYear} Automatía. Todos los derechos reservados. 
                <span className="flex items-center gap-1">
                  Hecho con <Heart className="w-3 h-3 text-red-500 animate-pulse" /> en Argentina
                </span>
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-sm">
              <Link 
                href="/terminos" 
                className="text-automatia-white/60 hover:text-automatia-gold transition-colors duration-300"
              >
                Términos de uso
              </Link>
              <Link 
                href="/privacidad" 
                className="text-automatia-white/60 hover:text-automatia-gold transition-colors duration-300"
              >
                Privacidad
              </Link>
              <Link 
                href="/cookies" 
                className="text-automatia-white/60 hover:text-automatia-gold transition-colors duration-300"
              >
                Cookies
              </Link>
              <Link 
                href="/soporte" 
                className="text-automatia-white/60 hover:text-automatia-gold transition-colors duration-300"
              >
                Soporte
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 pt-6 border-t border-automatia-gold/10">
            <div className="flex flex-wrap justify-center items-center gap-6 text-automatia-white/50">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-automatia-gold" />
                <span className="text-xs">SSL Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-automatia-gold" />
                <span className="text-xs">500+ Empresas Confían</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-automatia-gold" />
                <span className="text-xs">Soporte 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-automatia-gold" />
                <span className="text-xs">Certificado ISO 27001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
