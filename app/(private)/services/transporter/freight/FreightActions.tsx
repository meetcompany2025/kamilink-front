"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { FreightRequestService } from "@/services/freightRequestService"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface FreightActionsProps {
  freightId: string
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED"
}

export function FreightActions({ freightId, status }: FreightActionsProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  /**
   * Executa uma ação (aceitar, iniciar, finalizar ou cancelar)
   * e atualiza o estado do frete via backend.
   */
  const handleAction = async (action: "accept" | "cancel" | "start" | "finish") => {
    try {
      setLoading(true)
      let res

      // Ações possíveis no serviço de frete
      switch (action) {
        case "accept":
          res = await FreightRequestService.accept(freightId)
          break
        case "cancel":
          res = await FreightRequestService.cancel(freightId)
          break
        case "start":
          res = await FreightRequestService.start(freightId)
          break
        case "finish":
          res = await FreightRequestService.finish(freightId)
          break
      }

      // Trata erro genérico da API
      if (res?.error) throw new Error(res.error.message || "Erro ao executar ação")

      toast({
        title: "Sucesso!",
        description: `Ação "${action}" realizada com sucesso.`,
      })

      router.refresh() // Atualiza a página e o status do frete
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Não foi possível realizar a ação.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Renderiza os botões conforme o status atual do frete.
   */
  switch (status) {
    case "PENDING":
      return (
        <div className="flex gap-2">
          <Button onClick={() => handleAction("accept")} disabled={loading}>
            Aceitar Frete
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("cancel")}
            disabled={loading}
          >
            Cancelar Frete
          </Button>
        </div>
      )

    case "ACCEPTED":
      return (
        <div className="flex gap-2">
          <Button onClick={() => handleAction("start")} disabled={loading}>
            Iniciar Frete
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("cancel")}
            disabled={loading}
          >
            Cancelar Frete
          </Button>
        </div>
      )

    case "IN_PROGRESS":
      return (
        <div className="flex gap-2">
          <Button onClick={() => handleAction("finish")} disabled={loading}>
            Finalizar Frete
          </Button>
        </div>
      )

    case "COMPLETED":
      return (
        <Button disabled className="opacity-70 cursor-not-allowed">
          Frete Concluído
        </Button>
      )

    default:
      return null
  }
}
