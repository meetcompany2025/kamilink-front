"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useTranslation } from "@/hooks/use-translation"
import AnimatedPageTransition from "@/components/animated-page-transition"

export default function LanguageSettingsPage() {
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()

  return (
    <AnimatedPageTransition>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">{t("settings.language")}</h1>

        <Card>
          <CardHeader>
            <CardTitle>{t("settings.selectLanguage")}</CardTitle>
            <CardDescription>{t("settings.languageDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={language}
              onValueChange={(value) => setLanguage(value as "pt" | "en")}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pt" id="pt" />
                <Label htmlFor="pt" className="flex items-center gap-2">
                  <span className="font-medium">Português</span>
                  <span className="text-sm text-muted-foreground">(Português)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en" className="flex items-center gap-2">
                  <span className="font-medium">English</span>
                  <span className="text-sm text-muted-foreground">(Inglês)</span>
                </Label>
              </div>
            </RadioGroup>

            <div className="mt-6">
              <Button>{t("common.save")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPageTransition>
  )
}
