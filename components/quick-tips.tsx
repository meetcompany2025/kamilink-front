"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

type Tip = {
  title: string
  description: string
  actionText: string
  actionLink: string
}

type QuickTipsProps = {
  userType: "client" | "transporter"
  onDismiss: () => void
}

export function QuickTips({ userType, onDismiss }: QuickTipsProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  const clientTips: Tip[] = [
    {
      title: "Solicite seu primeiro frete",
      description: "Comece a usar a plataforma criando sua primeira solicitação de frete.",
      actionText: "Solicitar frete",
      actionLink: "/services/freight",
    },
    {
      title: "Acompanhe suas cargas",
      description: "Veja o status atual de todas as suas cargas em trânsito.",
      actionText: "Ver rastreamento",
      actionLink: "/services/tracking",
    },
    {
      title: "Gerencie seus pagamentos",
      description: "Configure seus métodos de pagamento para facilitar suas transações.",
      actionText: "Configurar pagamentos",
      actionLink: "/profile",
    },
  ]

  const transporterTips: Tip[] = [
    {
      title: "Cadastre seus veículos",
      description: "Adicione seus veículos para começar a receber fretes compatíveis.",
      actionText: "Adicionar veículo",
      actionLink: "/services/register-vehicle",
    },
    {
      title: "Encontre fretes disponíveis",
      description: "Veja todas as cargas disponíveis na sua região e envie propostas.",
      actionText: "Buscar fretes",
      actionLink: "/services/find-freight",
    },
    {
      title: "Atualize seu perfil",
      description: "Complete seu perfil para aumentar suas chances de conseguir fretes.",
      actionText: "Atualizar perfil",
      actionLink: "/profile",
    },
  ]

  const tips = userType === "client" ? clientTips : transporterTips
  const currentTip = tips[currentTipIndex]

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length)
  }

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length)
  }

  return (
    <Card className="relative border-l-4 border-l-primary">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2"
        onClick={onDismiss}
        aria-label="Fechar dicas"
      >
        <X className="h-4 w-4" />
      </Button>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Dica rápida</CardTitle>
        </div>
        <CardDescription className="text-xs">
          {currentTipIndex + 1} de {tips.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-1">{currentTip.title}</h3>
        <p className="text-sm text-muted-foreground">{currentTip.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={prevTip} disabled={tips.length <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextTip} disabled={tips.length <= 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button asChild size="sm" variant="default">
          <Link href={currentTip.actionLink}>{currentTip.actionText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
