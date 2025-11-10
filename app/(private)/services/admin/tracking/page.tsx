"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, CheckCircle, Clock, MapPin, Package, Search, Truck } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { getFreightRequestByTrackingNumber } from "@/lib/supabase/freight"
import { MapView, type MapLocation } from "@/components/map/map-view"
import { geocodeAddress, generateRoutePoints } from "@/lib/geo-utils"
import { FreightRequestService } from "@/services/freightRequestService"


function TrackingContent() {
  const searchParams = useSearchParams()
  const trackingId = searchParams.get("id") || ""
  const [trackingNumber, setTrackingNumber] = useState(trackingId)
  const [freight, setFreight] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([])
  const [vehiclePosition, setVehiclePosition] = useState<MapLocation | null>(null)
  const [isLoadingMap, setIsLoadingMap] = useState(false)
  const { toast } = useToast()

  // Função para buscar o frete
  const trackFreight = async (trackingNum: string) => {
    if (!trackingNum) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de rastreamento válido.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      console.log("Buscando frete com número de rastreamento:", trackingNum)
      const data = await FreightRequestService.getFreightDetail(trackingNum)
      if (!data) {
        toast({
          title: "Frete não encontrado",
          description: "Verifique o número de rastreamento e tente novamente.",
          variant: "destructive",
        })
        setFreight(null)
        return
      }
      console.log("Frete encontrado:", data)
      setFreight(data)

      // Geocodificar endereços para o mapa
      setIsLoadingMap(true)
      try {
        const originAddress = `${data.originAddress}, ${data.originCity}, ${data.originState}, Angola`
        const destinationAddress = `${data.destinationAddress}, ${data.destinationCity}, ${data.destinationState}, Angola`

        const originCoords = await geocodeAddress(originAddress)
        const destinationCoords = await geocodeAddress(destinationAddress)

        const locations: MapLocation[] = []

        if (originCoords) {
          locations.push({
            ...originCoords,
            name: "Origem",
            description: originAddress,
            isOrigin: true,
          })
        }

        if (destinationCoords) {
          locations.push({
            ...destinationCoords,
            name: "Destino",
            description: destinationAddress,
            isDestination: true,
          })
        }

        setMapLocations(locations)

        // Simular posição do veículo se estiver em trânsito
        if (data.status === "in_transit" && originCoords && destinationCoords) {
          // Em uma implementação real, isso viria de um sistema de rastreamento GPS
          // Aqui estamos simulando uma posição ao longo da rota

          // Gerar pontos ao longo da rota
          const routePoints = generateRoutePoints(
            originCoords.latitude,
            originCoords.longitude,
            destinationCoords.latitude,
            destinationCoords.longitude,
            10, // número de pontos
          )

          // Escolher um ponto aleatório para simular a posição atual do veículo
          const randomIndex = Math.floor(Math.random() * (routePoints.length - 2)) + 1
          const vehiclePos = routePoints[randomIndex]

          setVehiclePosition({
            latitude: vehiclePos.latitude,
            longitude: vehiclePos.longitude,
            name: "Veículo em trânsito",
            description: `Transportando frete #${trackingNum}`,
          })
        } else {
          setVehiclePosition(null)
        }
      } catch (error) {
        console.error("Erro ao geocodificar endereços:", error)
      } finally {
        setIsLoadingMap(false)
      }
    } catch (error) {
      console.error("Erro ao buscar frete:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar as informações do frete.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Buscar o frete se o ID estiver na URL
  useEffect(() => {
    if (trackingId) {
      setTrackingNumber(trackingId)
      trackFreight(trackingId)
    }
  }, [trackingId])

  // Função para obter a descrição do status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          title: "Aguardando Transportador",
          description: "Seu frete está aguardando um transportador aceitar a solicitação.",
          color: "text-amber-500",
          bgColor: "bg-amber-100",
          icon: <Clock className="h-5 w-5" />,
          progress: 25,
        }
      case "assigned":
        return {
          title: "Transportador Designado",
          description: "Um transportador foi designado e está se preparando para a coleta.",
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          icon: <Truck className="h-5 w-5" />,
          progress: 50,
        }
      case "in_transit":
        return {
          title: "Em Trânsito",
          description: "Sua carga está em trânsito para o destino.",
          color: "text-purple-500",
          bgColor: "bg-purple-100",
          icon: <Truck className="h-5 w-5" />,
          progress: 75,
        }
      case "delivered":
        return {
          title: "Entregue",
          description: "Sua carga foi entregue com sucesso no destino.",
          color: "text-green-500",
          bgColor: "bg-green-100",
          icon: <CheckCircle className="h-5 w-5" />,
          progress: 100,
        }
      case "cancelled":
        return {
          title: "Cancelado",
          description: "Este frete foi cancelado.",
          color: "text-red-500",
          bgColor: "bg-red-100",
          icon: <Clock className="h-5 w-5" />,
          progress: 0,
        }
      default:
        return {
          title: "Status Desconhecido",
          description: "Não foi possível determinar o status atual.",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          icon: <Clock className="h-5 w-5" />,
          progress: 0,
        }
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
        <h1 className="text-2xl font-bold mt-4">Rastreamento de Frete</h1>
        <p className="text-muted-foreground">Acompanhe o status da sua carga em tempo real</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Rastrear Frete</CardTitle>
          <CardDescription>Insira o número de rastreamento para acompanhar seu frete</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o número de rastreamento"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && trackFreight(trackingNumber)}
            />
            <Button onClick={() => trackFreight(trackingNumber)} disabled={loading}>
              {loading ? "Buscando..." : "Rastrear"}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {freight && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Frete #{freight.tracking_number}
                  </CardTitle>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusInfo(freight.status).color
                    } ${getStatusInfo(freight.status).bgColor}`}
                  >
                    {getStatusInfo(freight.status).title}
                  </div>
                </div>
                <CardDescription>Número de rastreamento: {freight.tracking_number}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span
                          className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                            getStatusInfo(freight.status).color
                          } ${getStatusInfo(freight.status).bgColor}`}
                        >
                          {getStatusInfo(freight.status).title}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block">
                          {getStatusInfo(freight.status).progress}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${getStatusInfo(freight.status).progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      Origem
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p>{freight.origin_address}</p>
                      <p className="text-sm text-muted-foreground mt-2">Cidade/Província</p>
                      <p>
                        {freight.origin_city}, {freight.origin_state}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      Destino
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p>{freight.destination_address}</p>
                      <p className="text-sm text-muted-foreground mt-2">Cidade/Província</p>
                      <p>
                        {freight.destination_city}, {freight.destination_state}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-primary" />
                      Carga
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <p>{freight.cargo_type}</p>
                      <p className="text-sm text-muted-foreground mt-2">Peso</p>
                      <p>{freight.weight}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      Datas
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Coleta</p>
                      <p>{new Date(freight.pickup_date).toLocaleDateString("pt-BR")}</p>
                      <p className="text-sm text-muted-foreground mt-2">Entrega Prevista</p>
                      <p>{new Date(freight.delivery_date).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <Truck className="h-5 w-5 text-primary" />
                      Transportador
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p>Carlos Transportes</p>
                      <p className="text-sm text-muted-foreground mt-2">Contato</p>
                      <p>+244 923 456 789</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Localização da Carga
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMap ? (
                  <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                    <p>Carregando mapa...</p>
                  </div>
                ) : mapLocations.length < 2 ? (
                  <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                    <p>Não foi possível carregar as localizações no mapa.</p>
                  </div>
                ) : (
                  <MapView
                    locations={mapLocations}
                    showRoute={true}
                    height="400px"
                    vehiclePosition={vehiclePosition || undefined}
                  />
                )}

                {freight.status === "in_transit" && vehiclePosition && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-medium text-blue-700 mb-2">Informações de Rastreamento em Tempo Real</h4>
                    <p>Veículo em trânsito. Localização atualizada em: {new Date().toLocaleTimeString()}</p>
                    <p className="mt-1">
                      Previsão de chegada: {new Date(freight.delivery_date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Rastreamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Frete criado</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(freight.created_at).toLocaleDateString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {freight.status !== "pending" && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Truck className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Transportador designado</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(freight.created_at).toLocaleDateString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {freight.status === "in_transit" && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                          <Truck className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Em trânsito</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Localização atualizada</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {freight.status === "delivered" && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Entregue</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href={`/services/freight/${freight.id}`}>Ver Detalhes Completos</Link>
                </Button>

                {freight.status === "in_transit" && (
                  <Button variant="outline" className="w-full">
                    Contactar Transportador
                  </Button>
                )}

                <Button variant="outline" className="w-full">
                  Compartilhar Rastreamento
                </Button>

                {freight.status === "delivered" && (
                  <Button variant="outline" className="w-full">
                    Confirmar Recebimento
                  </Button>
                )}

                <Button variant="outline" className="w-full">
                  Reportar Problema
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!freight && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhum frete encontrado</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Insira um número de rastreamento válido para visualizar as informações do seu frete.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


export default function TrackingPage() {
  return (
    <Suspense fallback={<div>Carregando autenticação...</div>}>
      <TrackingContent />
    </Suspense>
  )
}