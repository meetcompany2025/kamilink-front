"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, Truck, Package, MapPin } from "lucide-react"

type OnboardingStep = {
  title: string
  description: string
  icon: React.ReactNode
}

export function OnboardingModal({
  userType,
  isOpen,
  onClose,
}: {
  userType: "client" | "transporter" | null
  isOpen: boolean
  onClose: () => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const clientSteps: OnboardingStep[] = [
    {
      title: "Bem-vindo à KamiLink!",
      description:
        "Estamos felizes em tê-lo conosco. Vamos mostrar como você pode começar a solicitar fretes em poucos passos.",
      icon: <Package className="h-12 w-12 text-primary" />,
    },
    {
      title: "Solicite seu primeiro frete",
      description:
        "Vá para a seção 'Solicitar Frete' e preencha os detalhes da sua carga, origem, destino e data desejada.",
      icon: <Package className="h-12 w-12 text-primary" />,
    },
    {
      title: "Receba propostas",
      description:
        "Transportadores interessados enviarão propostas para seu frete. Você pode comparar preços e avaliações.",
      icon: <MapPin className="h-12 w-12 text-primary" />,
    },
    {
      title: "Acompanhe sua carga",
      description:
        "Após aceitar uma proposta, você poderá acompanhar o status da sua carga em tempo real através do painel.",
      icon: <Truck className="h-12 w-12 text-primary" />,
    },
  ]

  const transporterSteps: OnboardingStep[] = [
    {
      title: "Bem-vindo à KamiLink!",
      description:
        "Estamos felizes em tê-lo conosco. Vamos mostrar como você pode começar a encontrar fretes em poucos passos.",
      icon: <Truck className="h-12 w-12 text-primary" />,
    },
    {
      title: "Cadastre seus veículos",
      description:
        "Vá para a seção 'Meus Veículos' e adicione os detalhes dos seus veículos para começar a receber fretes compatíveis.",
      icon: <Truck className="h-12 w-12 text-primary" />,
    },
    {
      title: "Encontre fretes disponíveis",
      description: "Acesse 'Encontrar Fretes' para ver todas as cargas disponíveis na sua região e enviar propostas.",
      icon: <Package className="h-12 w-12 text-primary" />,
    },
    {
      title: "Gerencie seus fretes",
      description: "Após ter uma proposta aceita, você poderá gerenciar todos os seus fretes ativos através do painel.",
      icon: <MapPin className="h-12 w-12 text-primary" />,
    },
  ]

  const steps = userType === "client" ? clientSteps : transporterSteps

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
      if (userType === "client") {
        router.push("/services/freight")
      } else {
        router.push("/services/register-vehicle")
      }
    }
  }

  const handleSkip = () => {
    onClose()
    router.push("/dashboard")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            {steps[currentStep].icon}
          </div>
          <DialogTitle className="text-xl text-center mt-4">{steps[currentStep].title}</DialogTitle>
          <DialogDescription className="text-center">{steps[currentStep].description}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === currentStep ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
          <Button variant="ghost" onClick={handleSkip}>
            Pular tour
          </Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? (
              <>
                Próximo <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Começar <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
