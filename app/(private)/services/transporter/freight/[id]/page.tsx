"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { FreightRequestService } from "@/services/freightRequestService"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  Truck,
  User,
  FileText,
  CheckCircle,
  AlertTriangle,
  Map,
} from "lucide-react"
import Link from "next/link"
import { MapView, type MapLocation } from "@/components/map/map-view"
import { geocodeAddress } from "@/lib/geo-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { useParams } from "next/navigation"

export default function FreightDetailsPage() {
// export default function FreightDetailsPage({ params }: { params: { id: string } }) {
  const [freight, setFreight] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([])
  const [isLoadingMap, setIsLoadingMap] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [open, setOpen] = useState(false)
  const [showReason, setShowReason] = useState(false)
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  // const { id } = params
  const { id } = useParams() as { id?: string } // id pode vir undefined

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchFreight = async () => {
      try {
        setLoading(true)
        const data = await FreightRequestService.getFreightDetail(id)
        if (!data) {
          toast({
            title: "Erro",
            description: "Frete não encontrado",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }
        setFreight(data)

        // Geocodificar endereços para o mapa
        setIsLoadingMap(true)
        try {
          const originCoords = await geocodeAddress(`${data.origin}`)
          const destinationCoords = await geocodeAddress(`${data.destination}`)

          const locations: MapLocation[] = []
          if (originCoords) {
            locations.push({
              ...originCoords,
              name: "Origem",
              description: data.origin,
              isOrigin: true,
            })
          }
          if (destinationCoords) {
            locations.push({
              ...destinationCoords,
              name: "Destino",
              description: data.destination,
              isDestination: true,
            })
          }
          setMapLocations(locations)
        } catch (error) {
          console.error("Erro ao geocodificar endereços:", error)
          toast({
            title: "Erro no mapa",
            description: "Não foi possível carregar o mapa com as localizações.",
            variant: "destructive",
          })
        } finally {
          setIsLoadingMap(false)
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do frete:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do frete",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFreight()
  }, [user, router, id, toast])


// Iniciar frete
async function handleStart() {
  try {
    const updatedFreight = await FreightRequestService.accept(id)
    // setFreight(updatedFreight)
    router.push("/services/transporter/my-freights");
    toast({
      title: "Sucesso",
      description: "Frete iniciado com sucesso!",
    })
    // Opcional: redirecionar para página de rastreio
    // router.push(`/services/tracking?id=${id}`)
  } catch (error) {
    console.error("Erro ao iniciar frete:", error)
    toast({
      title: "Erro ao iniciar",
      description: "Ocorreu um erro ao iniciar o frete. Tente novamente.",
      variant: "destructive",
    })
  }
}
 
// Finalizar frete
async function handleComplete() {
  try {
    const updatedFreight = await FreightRequestService.finish(id)
     // setFreight(updatedFreight)
    router.push("/services/transporter/my-freights");
    toast({
      title: "Sucesso",
      description: "Frete finalizado com sucesso!",
    })
    // Aqui faz sentido redirecionar para a lista de fretes concluídos
    router.push("/services/transporter/my-freights")
  } catch (error) {
    console.error("Erro ao finalizar frete:", error)
    toast({
      title: "Erro ao finalizar",
      description: "Ocorreu um erro ao finalizar o frete. Tente novamente.",
      variant: "destructive",
    })
  }
}


// Cancelar frete
async function handleCancelFreight() {
  try {
    if (!cancelReason.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o motivo do cancelamento.",
        variant: "destructive",
      })
      return
    }

    const updatedFreight = await FreightRequestService.cancel(id)
     // setFreight(updatedFreight)
    router.push("/services/transporter/my-freights");
    setIsDialogOpen(false)
    toast({
      title: "Frete cancelado",
      description: "O frete foi cancelado com sucesso.",
    })

    // Redirecionar para a lista de fretes do cliente
    router.push("/services/client/my-freights")
  } catch (error) {
    console.error("Erro ao cancelar frete:", error)
    toast({
      title: "Erro ao cancelar",
      description: "Ocorreu um erro ao cancelar o frete. Tente novamente.",
      variant: "destructive",
    })
  }
}

  if (loading || !freight) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Carregando...</h1>
        </div>
      </div>
    )
  }

    const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>
      case "ACCEPTED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Aceite</Badge>
      case "IN_PROGRESS":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Em Andamento</Badge>
      case "COMPLETED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Entregue</Badge>
      case "CANCELED":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Frete #{id}
            </h1>
            <p className="text-muted-foreground">
              Criado em {new Date(freight.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(freight.status)}
          <Button asChild>
            <Link href={`/services/tracking?id=${id}`}>Rastrear</Link>
          </Button>
        </div>
      </div>

      {/* Cancelation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="fixed top-10 left-1/2 -translate-x-1/2 w-full max-w-md bg-background rounded-2xl shadow-2xl border p-6 z-[9999]">
          <DialogHeader>
            <DialogTitle>Cancelar Frete</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">
            Por favor, informe o motivo do cancelamento:
          </p>

          <Textarea
            placeholder="Escreva aqui o motivo..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Voltar</Button>
            <Button variant="destructive" onClick={handleCancelFreight}>Confirmar Cancelamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para mostrar motivo */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Motivo do Cancelamento</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {freight.cancelReason || "Nenhum motivo informado."}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="map">Mapa</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              {/* Detalhes do Frete */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Frete</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium flex items-center gap-2 mb-3">
                        <MapPin className="h-5 w-5 text-primary" />Origem
                      </h3>
                      <p>{freight.origin} - {freight.originState}</p>
                    </div>
                    <div>
                      <h3 className="font-medium flex items-center gap-2 mb-3">
                        <MapPin className="h-5 w-5 text-primary" />Destino
                      </h3>
                      <p>{freight.destination} - {freight.destinationState}</p>
                    </div>
                  </div>

                  <Separator className="my-6" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-medium mb-2"><Package className="h-5 w-5 text-primary" />Carga</h3>
                      <p>Tipo: {freight.cargoType}</p>
                      <p>Peso: {freight.weightKg}</p>
                      <p>Quantidade: {freight.quantity}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2"><Calendar className="h-5 w-5 text-primary" />Datas</h3>
                      <p>Coleta: {new Date(freight.pickupDate).toLocaleDateString("pt-AO")}</p>
                      <p>Entrega: {new Date(freight.deliveryDate).toLocaleDateString("pt-AO")}</p>
                      <p>Preço: {freight.price || 0} KZ</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2"><FileText className="h-5 w-5 text-primary" />Requisitos</h3>
                      <p>Ajuda na carga: {freight.requiresLoadingHelp ? "Sim" : "Não"}</p>
                      <p>Ajuda na descarga: {freight.requiresUnloadingHelp ? "Sim" : "Não"}</p>
                      <p>Seguro: {freight.hasInsurance ? "Sim" : "Não"}</p>
                    </div>
                  </div>

                  {freight.description && (
                    <>
                      <Separator className="my-6" />
                      <p>{freight.description}</p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Histórico */}
              <Card className="mt-6">
                <CardHeader><CardTitle>Histórico de Status</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {/* Status dinâmicos */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Frete criado</p>
                      <p className="text-sm text-muted-foreground">{new Date(freight.createdAt).toLocaleString("pt-AO")}</p>
                    </div>
                  </div>
                  {/* Outros status como em progresso, cancelado, concluído */}
                  {/* {freight.status === "PENDING" && <p>Frete Pendente</p>} */}
                {freight.status === "PENDING" && <p>Frete Pendente</p>}
                {freight.status === "ACCEPTED" && <p>Frete Aceito</p>}
                {freight.status === "IN_PROGRESS" && <p>Em Andamento</p>}
                {freight.status === "COMPLETED" && <p>Frete Concluído</p>}
                {freight.status === "CANCELED" && <p>Frete Cancelado</p>}

                  {/* Repetir lógica conforme status do frete */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />Mapa da Rota
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
                      showRoute
                      height="400px"
                      vehiclePosition={
                        freight.status === "IN_PROGRESS" ? {
                          latitude: (mapLocations[0].latitude + mapLocations[1].latitude) / 2,
                          longitude: (mapLocations[0].longitude + mapLocations[1].longitude) / 2,
                          name: "Veículo em trânsito",
                          description: `Transportando frete #${id}`,
                        } : undefined
                      }
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Cliente, Transportador e Ações */}
        <div className="space-y-6">
          {/* Cliente */}
          <Card>
            <CardHeader><CardTitle>Cliente</CardTitle></CardHeader>
            <CardContent>
              <p>{freight.client.person.fullName}</p>
              <p>Cliente desde {new Date(user.createdAt).toLocaleDateString("pt-AO")}</p>
            </CardContent>
          </Card>

          {/* Transportador */}
          {(freight.status !== "PENDING" && freight.transporterId) && (
            <Card>
              <CardHeader><CardTitle>Transportador</CardTitle></CardHeader>
              <CardContent>
                <p>{"userProfile.person.fullName"}</p>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <Card>
            <CardHeader><CardTitle>Ações</CardTitle></CardHeader>
            <CardContent className="space-y-2">

              {freight.status === "PENDING" && (
                <Button onClick={handleStart} className="w-full">Aceitar Corrida</Button>
              )}
              {freight.status === "ACCEPTED" && (
                <Button onClick={handleStart} className="w-full">Iniciar Corrida</Button>
              )}
              {freight.status === "IN_PROGRESS" && (
                <Button onClick={handleComplete} className="w-full">Fechar Corrida</Button>
              )}
              {(freight.status !== "PENDING" && freight.status !== "COMPLETED") && (
                <Button onClick={() => setIsDialogOpen(true)} variant="destructive" className="w-full">
                  Cancelar Frete
                </Button>
              )}
              {freight.status === "CANCELED" && (
                <Button onClick={() => setShowReason(!showReason)} className="w-full">
                  {showReason ? "Esconder Motivo" : "Ver Motivo do Cancelamento"}
                </Button>
              )}
              {showReason && (
                <div className="mt-2 p-4 rounded-lg border bg-muted text-sm text-muted-foreground">
                  {freight.cancelReason || "Nenhum motivo informado"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
