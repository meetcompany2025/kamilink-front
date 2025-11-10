"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle,
  Package,
  Shield,
  Truck,
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  TruckIcon,
  BarChart3,
} from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Toaster } from "@/components/ui/toaster"

// Hook para efeito de digitação
function useTypewriter(text: string, speed = 50, delay = 0) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    // Delay inicial antes de começar a digitar
    if (!isTyping) {
      timeout = setTimeout(() => {
        setIsTyping(true)
      }, delay)
      return () => clearTimeout(timeout)
    }

    // Processo de digitação
    if (isTyping && currentIndex < text.length) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
    }

    return () => clearTimeout(timeout)
  }, [text, speed, delay, currentIndex, isTyping])

  return { displayText, isComplete: currentIndex === text.length }
}

export default function Home() {
  // Animated stats
  const [stats, setStats] = useState({ users: 0, trucks: 0, deliveries: 0, cities: 0 })
  const statsTarget = { users: 5000, trucks: 1200, deliveries: 25000, cities: 18 }
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    if (statsVisible) {
      const interval = setInterval(() => {
        setStats((prev) => ({
          users: Math.min(prev.users + 50, statsTarget.users),
          trucks: Math.min(prev.trucks + 12, statsTarget.trucks),
          deliveries: Math.min(prev.deliveries + 250, statsTarget.deliveries),
          cities: Math.min(prev.cities + 1, statsTarget.cities),
        }))
      }, 30)

      return () => clearInterval(interval)
    }
  }, [statsVisible])

  // Intersection observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  // Parallax effect
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  // Testimonial carousel
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const testimonials = [
    {
      name: "Ana Silva",
      role: "Gerente de Logística, Luanda",
      text: "Economizei mais de 20% nos custos de transporte da minha empresa desde que comecei a usar a KamiLink. O rastreamento em tempo real me dá tranquilidade.",
      rating: 5,
    },
    {
      name: "João Paulo",
      role: "Transportador Autônomo, Benguela",
      text: "Como caminhoneiro, a KamiLink mudou minha vida. Agora tenho fretes constantes e pagamentos seguros. Aumentei minha renda em 35% no primeiro mês.",
      rating: 5,
    },
    {
      name: "Maria Fernanda",
      role: "Proprietária de Loja, Huambo",
      text: "A plataforma é intuitiva e o suporte é excelente. Consegui resolver um problema com uma entrega em questão de minutos graças à equipe da KamiLink.",
      rating: 4,
    },
    {
      name: "Carlos Eduardo",
      role: "Diretor de Operações, Lubango",
      text: "Desde que implementamos a KamiLink, nossa eficiência logística aumentou em 40%. A plataforma é revolucionária para o mercado angolano.",
      rating: 5,
    },
  ]

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const faqs = [
    {
      question: "Como funciona o cadastro na KamiLink?",
      answer:
        "O cadastro é simples e rápido. Basta clicar em 'Sou Cliente' ou 'Sou Transportador', preencher seus dados básicos e verificar seu e-mail. Todo o processo leva menos de 2 minutos.",
    },
    {
      question: "Quais documentos são necessários para transportadores?",
      answer:
        "Transportadores precisam fornecer documentos do veículo, licença de condução válida, seguro de carga e documentos de identificação pessoal. Todos os documentos podem ser enviados diretamente pela plataforma.",
    },
    {
      question: "Como é calculado o preço do frete?",
      answer:
        "O preço é calculado com base na distância, tipo de carga, peso, dimensões e urgência da entrega. Nossa plataforma oferece uma estimativa instantânea e os transportadores podem enviar propostas personalizadas.",
    },
    {
      question: "A KamiLink opera em todas as províncias de Angola?",
      answer:
        "Sim, a KamiLink opera em todas as 18 províncias de Angola, conectando transportadores e clientes em todo o território nacional, das grandes cidades às áreas mais remotas.",
    },
  ]

  return (
    <>
      <div className="flex flex-col min-h-screen">
      {/* Hero Section with Interactive Elements */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[url('/images/map-pattern.png')] opacity-10 dark:opacity-5 bg-repeat"
          style={{ y }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary">{useTypewriter("Transformando", 70, 300).displayText}</span>{" "}
                {useTypewriter("Distâncias", 70, 1500).displayText} <br />
                {useTypewriter("Em Oportunidades", 70, 2700).displayText}
                <span
                  className={`inline-block w-1 h-8 bg-primary ml-1 ${
                    useTypewriter("Em Oportunidades", 70, 2700).isComplete ? "animate-pulse" : "animate-pulse"
                  }`}
                />
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Conectamos transportadores e clientes de forma simples, segura e eficiente em toda Angola.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="text-base w-full sm:w-auto">
                    <Link href="/register/client">
                      Sou Cliente
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" variant="outline" className="text-base w-full sm:w-auto">
                    <Link href="/register/transporter">
                      Sou Transportador
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - KamiLink Branded Truck */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <Image
                  src="/kamilink-branded-truck.png"
                  alt="Caminhão KamiLink - Conectando Angola"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />

                {/* Floating elements around the truck */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute top-4 right-4 bg-primary/10 backdrop-blur-sm rounded-full p-3"
                >
                  <Shield className="h-6 w-6 text-primary" />
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-8 left-4 bg-primary/10 backdrop-blur-sm rounded-full p-3"
                >
                  <Package className="h-6 w-6 text-primary" />
                </motion.div>

                <motion.div
                  animate={{ y: [-5, 15, -5] }}
                  transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-1/2 left-0 bg-primary/10 backdrop-blur-sm rounded-full p-3"
                >
                  <MapPin className="h-6 w-6 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
      </section>

      {/* Animated Stats Section */}
      <section ref={statsRef} className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={statsVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <Users className="h-10 w-10 mb-4 text-white/80" />
              <div className="text-3xl md:text-4xl font-bold">{stats.users.toLocaleString()}+</div>
              <p className="text-white/80 mt-2">Usuários Ativos</p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={statsVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <TruckIcon className="h-10 w-10 mb-4 text-white/80" />
              <div className="text-3xl md:text-4xl font-bold">{stats.trucks.toLocaleString()}+</div>
              <p className="text-white/80 mt-2">Transportadores</p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={statsVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <Package className="h-10 w-10 mb-4 text-white/80" />
              <div className="text-3xl md:text-4xl font-bold">{stats.deliveries.toLocaleString()}+</div>
              <p className="text-white/80 mt-2">Entregas Realizadas</p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={statsVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <MapPin className="h-10 w-10 mb-4 text-white/80" />
              <div className="text-3xl md:text-4xl font-bold">{stats.cities}</div>
              <p className="text-white/80 mt-2">Províncias Atendidas</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section with Interactive Elements */}
      <section className="py-20 bg-white dark:bg-slate-800" id="how-it-works">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Três passos simples para revolucionar sua experiência de transporte de cargas
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-slate-50 dark:bg-slate-700 p-8 rounded-xl text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-primary/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Cadastre-se</h3>
              <p className="text-muted-foreground relative">
                Crie sua conta como cliente ou transportador em menos de 2 minutos, sem burocracia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-slate-50 dark:bg-slate-700 p-8 rounded-xl text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-primary/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Solicite um Frete</h3>
              <p className="text-muted-foreground relative">
                Preencha um formulário simples com os detalhes da sua carga e receba propostas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-slate-50 dark:bg-slate-700 p-8 rounded-xl text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-primary/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Acompanhe em Tempo Real</h3>
              <p className="text-muted-foreground relative">
                Monitore o status da sua carga ou entrega com atualizações em tempo real e rastreamento no mapa.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section with Interactive Cards */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher a KamiLink?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Benefícios exclusivos para transportadores e clientes
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -8, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
            >
              <div className="mb-4 text-primary">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Segurança Garantida</h3>
              <p className="text-muted-foreground">
                Verificamos todos os transportadores e protegemos seus pagamentos com sistema anti-fraude.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
            >
              <div className="mb-4 text-primary">
                <Package className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rastreamento em Tempo Real</h3>
              <p className="text-muted-foreground">
                Acompanhe suas cargas em tempo real e receba atualizações instantâneas sobre o status.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ y: -8, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
            >
              <div className="mb-4 text-primary">
                <Truck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fretes Garantidos</h3>
              <p className="text-muted-foreground">
                Transportadores têm acesso a fretes verificados e pagamentos seguros após a entrega.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ y: -8, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
            >
              <div className="mb-4 text-primary">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sem Burocracia</h3>
              <p className="text-muted-foreground">
                Processo simplificado de cadastro e solicitação, sem papelada desnecessária.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ y: -8, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
            >
              <div className="mb-4 text-primary">
                <BarChart3 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Preços Competitivos</h3>
              <p className="text-muted-foreground">
                Economize até 30% em fretes comparado aos métodos tradicionais de contratação.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ y: -8, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
            >
              <div className="mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 6.1H3" />
                  <path d="M21 12.1H3" />
                  <path d="M15.1 18H3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Suporte Dedicado</h3>
              <p className="text-muted-foreground">
                Equipe de suporte disponível 24/7 para ajudar com qualquer problema durante o transporte.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Testimonial Carousel */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">O que nossos usuários dizem</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Histórias reais de clientes e transportadores que usam a KamiLink
              </p>
            </div>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-700 p-8 md:p-12 shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-1 mb-6 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6"
                        fill={i < testimonials[currentTestimonial].rating ? "currentColor" : "none"}
                        opacity={i < testimonials[currentTestimonial].rating ? 1 : 0.3}
                      />
                    ))}
                  </div>
                  <p className="text-xl italic mb-8">"{testimonials[currentTestimonial].text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden flex items-center justify-center text-2xl font-bold text-primary">
                      {testimonials[currentTestimonial].name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{testimonials[currentTestimonial].name}</p>
                      <p className="text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="p-2 rounded-full bg-white dark:bg-slate-700 shadow-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentTestimonial === index
                        ? "bg-primary scale-125"
                        : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                    }`}
                    aria-label={`Ver depoimento ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="p-2 rounded-full bg-white dark:bg-slate-700 shadow-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tire suas dúvidas sobre a plataforma KamiLink
              </p>
            </div>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="mb-4"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center p-5 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="font-medium text-left">{faq.question}</span>
                  <ChevronRight className={`h-5 w-5 transition-transform ${openFaq === index ? "rotate-90" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 bg-slate-100 dark:bg-slate-700 rounded-b-lg">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Animation */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ backgroundPosition: "0% 0%" }}
          animate={{ backgroundPosition: "100% 100%" }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          style={{
            backgroundImage: "url('/images/dot-pattern.png')",
            backgroundSize: "30px",
            opacity: 0.1,
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para revolucionar sua logística?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Junte-se a milhares de empresas e transportadores que já estão economizando tempo e dinheiro com a
              KamiLink.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" variant="secondary" className="text-base w-full sm:w-auto">
                  <Link href="/register/client">Sou Cliente</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white hover:bg-white/10 text-base w-full sm:w-auto"
                >
                  <Link href="/register/transporter">Sou Transportador</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    <Toaster />
    </>
    
  )
}
