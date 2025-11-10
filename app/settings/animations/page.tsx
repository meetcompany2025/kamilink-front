"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import AnimatedPageTransition from "@/components/animated-page-transition"

export default function AnimationsSettingsPage() {
  const [enableAnimations, setEnableAnimations] = useState(true)
  const [enableTransitions, setEnableTransitions] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)
  const { t } = useTranslation()

  return (
    <AnimatedPageTransition>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">{t("settings.animations")}</h1>

        <Card>
          <CardHeader>
            <CardTitle>{t("settings.animationPreferences")}</CardTitle>
            <CardDescription>{t("settings.animationDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-animations" className="font-medium">
                  {t("settings.enableAnimations")}
                </Label>
                <p className="text-sm text-muted-foreground">{t("settings.enableAnimationsDescription")}</p>
              </div>
              <Switch id="enable-animations" checked={enableAnimations} onCheckedChange={setEnableAnimations} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-transitions" className="font-medium">
                  {t("settings.enableTransitions")}
                </Label>
                <p className="text-sm text-muted-foreground">{t("settings.enableTransitionsDescription")}</p>
              </div>
              <Switch
                id="enable-transitions"
                checked={enableTransitions}
                onCheckedChange={setEnableTransitions}
                disabled={!enableAnimations}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reduce-motion" className="font-medium">
                  {t("settings.reduceMotion")}
                </Label>
                <p className="text-sm text-muted-foreground">{t("settings.reduceMotionDescription")}</p>
              </div>
              <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={setReduceMotion} />
            </div>

            <div className="pt-4">
              <Button>{t("common.save")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPageTransition>
  )
}
