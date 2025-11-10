"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export function GenerateTestNotifications() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleGenerateNotifications = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para gerar notificações de teste.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const response = await fetch("/api/generate-test-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: `${data.count} notificações de teste foram geradas.`,
        })
      } else {
        throw new Error(data.error || "Erro desconhecido")
      }
    } catch (error) {
      console.error("Erro ao gerar notificações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar notificações de teste.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleGenerateNotifications} disabled={loading} variant="outline" size="sm">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando...
        </>
      ) : (
        "Gerar Notificações de Teste"
      )}
    </Button>
  )
}
