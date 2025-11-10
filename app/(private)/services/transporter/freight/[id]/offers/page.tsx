"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, CheckCircle, DollarSign, MapPin, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"

export default function FreightOffersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [freight, setFreight] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [acceptingOffer, setAcceptingOffer] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  const freightId = params.id as string

  useEffect(() => {
    const fetchFreightAndOffers = async () => {
      if (!user || !freightId) return

      try {
        // Buscar detalhes do frete
        const { data: freightData, error: freightError } = await supabase
          .from("freight_requests")
          .select("*")
          .eq("id", freightId)
          .eq("client_id", user.id)
          .single()

        if (freightError) throw freightError
        setFreight(freightData)

        // Buscar ofertas para este frete
        const { data: offersData, error: offersError } = await supabase
          .from("freight_offers")
          .select(`
            *,
            transporters:transporter_id(id, name, email, phone),
            vehicles:vehicle_id(id, vehicle_type, brand, model, license_plate)
          `)
          .eq("freight_request_id", freightId)
          .order("price", { ascending: true })

        if (offersError) throw offersError
        setOffers(offersData || [])
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as ofertas para este frete.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFreightAndOffers()
  }, [user, freightId, supabase])

  const acceptOffer = async (offerId: string) => {
    if (!user || !freightId) return

    setAcceptingOffer(offerId)

    try {
      // Atualizar o status da oferta para "accepted"
      const { error: updateOfferError } = await supabase
        .from("freight_offers")
        .update({ status: "accepted" })
        .eq("id", offerId)

      if (updateOfferError) throw updateOfferError

      // Atualizar o status das outras ofertas para "rejected"
      const { error: rejectOffersError } = await supabase
        .from("freight_offers")
        .update({ status: "rejected" })
        .eq("freight_request_id", freightId)
        .neq("id", offerId)

      if (rejectOffersError) throw rejectOffersError

      // Atualizar o status do frete para "assigned"
      const { error: updateFreightError } = await supabase
        .from("freight_requests")
        .update({ status: "assigned" })
        .eq("id", freightId)

      if (updateFreightError) throw updateFreightError

      toast({
        title: "Oferta aceita com sucesso!",
        description: "O transportador será notificado e entrará em contato em breve.",
      })

      // Redirecionar para a página de detalhes do frete
      setTimeout(() => {
        router.push(`/services/freight/${freightId}`)
      }, 2000)
    } catch (error) {
      console.error("Erro ao aceitar oferta:", error)
      toast({
        title: "Erro ao aceitar oferta",
        description: "Não foi possível aceitar a oferta. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setAcceptingOffer(null)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Carregando ofertas...</p>
        </div>
      </div>
    )
  }

  if (!freight) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Frete não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            O frete solicitado não foi encontrado ou você não tem permissão para visualizá-lo.
          </p>
          <Button asChild>
            <Link href="/dashboard">Voltar para o Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-4">Propostas de Frete</h1>
        <p className="text-muted-foreground">Analise e escolha a melhor proposta para seu frete</p>
      </div>

      {/* Detalhes do Frete */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Detalhes do Frete</CardTitle>
          <CardDescription>Informações sobre a carga e rota</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Rota</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {freight.origin_city}, {freight.origin_state}
                  </span>
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {freight.destination_city}, {freight.destination_state}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Coleta</h3>
                  <p className="font-medium">{new Date(freight.pickup_date).toLocaleDateString("pt-AO")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Entrega</h3>
                  <p className="font-medium">{new Date(freight.delivery_date).toLocaleDateString("pt-AO")}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Carga</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Tipo de Carga</span>
                  <span className="font-medium">{freight.cargo_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Peso</span>
                  <span className="font-medium">{freight.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Quantidade</span>
                  <span className="font-medium">{freight.quantity} unidades</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Dimensões</span>
                  <span className="font-medium">{freight.dimensions || "Não especificado"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Ofertas */}
      <h2 className="text-xl font-semibold mb-4">Propostas Recebidas ({offers.length})</h2>

      {offers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma proposta recebida</h3>
              <p className="text-muted-foreground mb-4">
                Seu frete ainda não recebeu propostas de transportadores. Aguarde um pouco mais.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {offers.map((offer) => (
            <Card key={offer.id} className={offer.status === "accepted" ? "border-green-500" : ""}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Informações do Transportador */}
                  <div className="md:w-1/3">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" alt={offer.transporters?.name} />
                        <AvatarFallback>
                          {(offer.transporters?.name || "")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{offer.transporters?.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>4.8</span>
                          <span className="mx-1">•</span>
                          <span>32 fretes</span>
                        </div>
                      </div>
                    </div>

                    {offer.vehicles && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Veículo</h4>
                        <p className="font-medium">
                          {offer.vehicles.brand} {offer.vehicles.model}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {offer.vehicles.vehicle_type} • {offer.vehicles.license_plate}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Contato</h4>
                      <p className="text-sm">{offer.transporters?.phone}</p>
                      <p className="text-sm">{offer.transporters?.email}</p>
                    </div>
                  </div>

                  {/* Detalhes da Oferta */}
                  <div className="md:w-2/3 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-primary">AOA {offer.price.toLocaleString("pt-AO")}</h3>
                        {offer.estimated_delivery_date && (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Entrega estimada: {new Date(offer.estimated_delivery_date).toLocaleDateString("pt-AO")}
                            </span>
                          </div>
                        )}
                      </div>

                      <Badge
                        variant="outline"
                        className={
                          offer.status === "accepted"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : offer.status === "rejected"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                        }
                      >
                        {offer.status === "accepted" ? "Aceita" : offer.status === "rejected" ? "Recusada" : "Pendente"}
                      </Badge>
                    </div>

                    {offer.notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Observações</h4>
                        <p className="text-sm text-muted-foreground">{offer.notes}</p>
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      {offer.status === "pending" ? (
                        <Button className="w-full" onClick={() => acceptOffer(offer.id)} disabled={!!acceptingOffer}>
                          {acceptingOffer === offer.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processando...
                            </>
                          ) : (
                            "Aceitar Proposta"
                          )}
                        </Button>
                      ) : offer.status === "accepted" ? (
                        <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                          <CheckCircle className="h-5 w-5" />
                          <span>Proposta aceita</span>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Proposta recusada
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
