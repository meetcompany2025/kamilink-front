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
import { MapView, type MapLocation } from "@/components/map/transport-map-view"
import { geocodeAddress, generateRoutePoints } from "@/lib/geo-utils"
import { FreightRequestService } from "@/services/freightRequestService"
import { GoogleMapsProvider } from "@/components/google-maps-provider"
import { FreightRequest } from "@/types/freightRequest"

interface Freight {
  id: string
  status: string
  origin: string
  originState: string
  destination: string
  destinationState: string
  cargoType: string
  weightKg: number
  pickupDate: string
  deliveryDate: string
  createdAt: string
}

function TrackingContent() {
  const searchParams = useSearchParams()
  const trackingId = searchParams.get("id") || ""

  const [trackingNumber, setTrackingNumber] = useState(trackingId)
  const [freight, setFreight] = useState<FreightRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([])
  const [vehiclePosition, setVehiclePosition] = useState<MapLocation | null>(null)
  const [isLoadingMap, setIsLoadingMap] = useState(false)
  const { toast } = useToast()

  // Função principal para buscar o frete pelo número de rastreamento
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
      const data = await FreightRequestService.getFreightDetail(trackingNum)
      if (!data) {
        setFreight(null)
        toast({
          title: "Frete não encontrado",
          description: "Verifique o número de rastreamento e tente novamente.",
          variant: "destructive",
        })
        return
      }

      setFreight(data)

      // Preparar mapa
      setIsLoadingMap(true)
      const originCoords = await geocodeAddress(data.origin)
      const destinationCoords = await geocodeAddress(data.destination)

      const locations: MapLocation[] = []
      if (originCoords) locations.push({ ...originCoords, name: "Origem", description: data.origin, isOrigin: true })
      if (destinationCoords) locations.push({ ...destinationCoords, name: "Destino", description: data.destination, isDestination: true })
      setMapLocations(locations)

      // Simular posição do veículo se estiver em trânsito
      if (data.status === "IN_PROGRESS" && originCoords && destinationCoords) {
        const routePoints = generateRoutePoints(
          originCoords.latitude,
          originCoords.longitude,
          destinationCoords.latitude,
          destinationCoords.longitude,
          10
        )
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
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível buscar as informações do frete.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setIsLoadingMap(false)
    }
  }

  // Buscar automaticamente se houver trackingId na URL
  useEffect(() => {
    if (trackingId) {
      setTrackingNumber(trackingId)
      trackFreight(trackingId)
    }
  }, [trackingId])

  // Função para status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING": return { title: "Aguardando Transportador", color: "text-amber-500", bgColor: "bg-amber-100", icon: <Clock className="h-5 w-5" />, progress: 25 }
      case "ACCEPTED": return { title: "Transportador Designado", color: "text-blue-500", bgColor: "bg-blue-100", icon: <Truck className="h-5 w-5" />, progress: 50 }
      case "IN_PROGRESS": return { title: "Em Trânsito", color: "text-purple-500", bgColor: "bg-purple-100", icon: <Truck className="h-5 w-5" />, progress: 75 }
      case "COMPLETED": return { title: "Entregue", color: "text-green-500", bgColor: "bg-green-100", icon: <CheckCircle className="h-5 w-5" />, progress: 100 }
      case "CANCELED": return { title: "Cancelado", color: "text-red-500", bgColor: "bg-red-100", icon: <Clock className="h-5 w-5" />, progress: 0 }
      default: return { title: "Status Desconhecido", color: "text-gray-500", bgColor: "bg-gray-100", icon: <Clock className="h-5 w-5" />, progress: 0 }
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Cabeçalho */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
        </Link>
        <h1 className="text-2xl font-bold mt-4">Rastreamento de Frete</h1>
        <p className="text-muted-foreground">Acompanhe o status da sua carga em tempo real</p>
      </div>

      {/* Input de rastreamento */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Rastrear Frete</CardTitle>
          <CardDescription>Insira o número de rastreamento</CardDescription>
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
              {loading ? "Buscando..." : "Rastrear"} <Search className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultado */}
      {freight ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de frete */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" /> Frete #{freight.id}
                  </CardTitle>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(freight.status).color} ${getStatusInfo(freight.status).bgColor}`}>
                    {getStatusInfo(freight.status).title}
                  </div>
                </div>
                <CardDescription>Número de rastreamento: {freight.id}</CardDescription>
              </CardHeader>
            </Card>

            {/* Mapa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Localização da Carga
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMap ? (
                  <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">Carregando mapa...</div>
                ) : mapLocations.length < 2 ? (
                  <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">Não foi possível carregar as localizações.</div>
                ) : (
                  <MapView locations={mapLocations} showRoute animateVehicle height="500px" />
                )}

                {freight.status === "IN_PROGRESS" && vehiclePosition && (
                  <div className="mt-4 p-4 border-blue-200 rounded-md">
                    <h4 className="font-medium text-blue-700 mb-2">Rastreamento em Tempo Real</h4>
                    <p>Veículo em trânsito. Última atualização: {new Date().toLocaleTimeString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        !loading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum frete encontrado</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Insira um número de rastreamento válido para visualizar as informações do seu frete.
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}

// Página principal exportada
export default function TrackingPage() {
  return (
    <GoogleMapsProvider>
      <Suspense fallback={<div>Carregando autenticação...</div>}>
        <TrackingContent />
      </Suspense>
    </GoogleMapsProvider>
  )
}
