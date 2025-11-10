"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Monitor, Bell, Lock, User, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import AnimatedPageTransition from "@/components/animated-page-transition"

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <AnimatedPageTransition>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">{t("settings.title")}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <User className="h-6 w-6 text-primary mb-2" />
              <CardTitle>{t("settings.account")}</CardTitle>
              <CardDescription>{t("settings.accountDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/settings/account">{t("common.manage")}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <Bell className="h-6 w-6 text-primary mb-2" />
              <CardTitle>{t("settings.notifications")}</CardTitle>
              <CardDescription>{t("settings.notificationsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/settings/notifications">{t("common.manage")}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <Lock className="h-6 w-6 text-primary mb-2" />
              <CardTitle>{t("settings.security")}</CardTitle>
              <CardDescription>{t("settings.securityDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/settings/security">{t("common.manage")}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <Globe className="h-6 w-6 text-primary mb-2" />
              <CardTitle>{t("settings.language")}</CardTitle>
              <CardDescription>{t("settings.languageDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/settings/language">{t("common.manage")}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <Monitor className="h-6 w-6 text-primary mb-2" />
              <CardTitle>{t("settings.animations")}</CardTitle>
              <CardDescription>{t("settings.animationsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/settings/animations">{t("common.manage")}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <HelpCircle className="h-6 w-6 text-primary mb-2" />
              <CardTitle>{t("settings.help")}</CardTitle>
              <CardDescription>{t("settings.helpDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/help">{t("common.view")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPageTransition>
  )
}
