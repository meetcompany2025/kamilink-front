"use client"

import { useEffect, useState } from "react"
import { Loader2, PackageSearch, ArrowRight } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { FreightRequestService } from "@/services/freightRequestService"
import { FreightRequest } from "@/types/freightRequest"

type Freight = {
  id: string
  origin: string
  originState: string
  destination: string
  destinationState: string
  pickupDate: string
  deliveryDate: string
  cargoType: string
  status: keyof typeof statusConfig
}

const statusConfig = {
  PENDING:     { label: "Pendente",     color: "bg-yellow-200 text-yellow-900" },
  ACCEPTED:    { label: "Aceite",       color: "bg-blue-200 text-blue-900" },
  IN_PROGRESS: { label: "Em Andamento", color: "bg-purple-200 text-purple-900" },
  COMPLETED:   { label: "Concluído",    color: "bg-green-200 text-green-900" },
  CANCELED:    { label: "Cancelado",    color: "bg-red-200 text-red-900" },
} as const

export default function MyFreightsPage() {
  const { user } = useAuth()
  const [freights, setFreights] = useState<FreightRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFreights = async () => {
      try {
        if (!user?.id) return

        const response = await FreightRequestService.getClientFreights()

        if (!response) {
          console.warn("Nenhum frete retornado da API.")
          setFreights([])
          return
        }

        setFreights(response)
      } catch (err) {
        console.error("Erro ao buscar fretes:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFreights()
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">Carregando seus fretes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Meus Fretes</h1>
        <p className="text-muted-foreground">
          Acompanhe todos os fretes que você solicitou.
        </p>
      </div>

      {freights.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <PackageSearch className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum frete encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não solicitou nenhum frete. Crie um novo para começar.
              </p>
              <Button asChild>
                <Link href="/services/freight">Criar Novo Frete</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {freights.map((freight) => {
            const status =
              statusConfig[(freight as unknown as { status?: string }).status as keyof typeof statusConfig] ??
              statusConfig.PENDING


            return (
              <Card key={freight.id}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {freight.origin}, {freight.originState} →{" "}
                    {freight.destination}, {freight.destinationState}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <strong>Status:</strong>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-700">Data de Coleta</p>
                      <p>
                        {new Date(freight.pickupDate).toLocaleDateString("pt-AO")}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Data de Entrega</p>
                      <p>
                        {new Date(freight.deliveryDate).toLocaleDateString("pt-AO")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700">Tipo de Carga</p>
                    <p>{freight.cargoType}</p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button asChild className="mt-2 w-full">
                    <Link
                      href={`/services/client/freight/${freight.id}`}
                      className="inline-flex items-center gap-2"
                    >
                      Ver Detalhes <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
