"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Truck, Twitter } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import FadeIn from "@/components/fade-in"

export default function SiteFooter() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <FadeIn>
      <footer className="bg-slate-900 text-slate-200 dark:bg-slate-950 dark:text-slate-300">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-white dark:text-slate-200">KamiLink</span>
              </Link>
              <p className="text-slate-400 dark:text-slate-500 mb-4">{t("hero.subtitle")}</p>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-white"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-white"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-white dark:text-slate-200 font-semibold mb-4">{t("footer.quickLinks")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-white"
                  >
                    {t("navigation.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-white"
                  >
                    {t("navigation.services")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-white"
                  >
                    {t("navigation.contact")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-white"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-white"
                  >
                    {t("navigation.faq", "FAQ")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white dark:text-slate-200 font-semibold mb-4">{t("footer.contact")}</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-slate-400 dark:text-slate-500">Kilamba, Luanda</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-slate-400 dark:text-slate-500">+244 923 456 789</span>
                </li>
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-slate-400 dark:text-slate-500">contato@kamilink.co.ao</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white dark:text-slate-200 font-semibold mb-4">{t("footer.newsletter")}</h3>
              <p className="text-slate-400 dark:text-slate-500 mb-4">{t("footer.newsletterDescription")}</p>
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
                <Button>{t("footer.subscribe")}</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 dark:border-slate-700 mt-12 pt-6 text-center text-slate-400 dark:text-slate-500">
            <p>
              © {currentYear} KamiLink. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </FadeIn>
  )
}
