"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"

export default function HeroSection() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{t("hero.title")}</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              {t(
                "hero.subtitle",
                "Conectamos empresas a transportadores de forma simples e eficiente. Encontre o frete ideal para sua carga ou oportunidades de transporte em toda Angola.",
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/register">{t("hero.register")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/services">
                  {t("hero.services")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src="/images/truck-angola-1.png"
                alt="KamiLink - Transporte de cargas em Angola"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-medium">Conectando toda Angola</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
