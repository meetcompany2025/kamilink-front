"use client"
// export const dynamic = "force-dynamic"
// export const revalidate = 0

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

import { FreightRequestService } from "@/services/freightRequestService"
import { geocodeAddress } from "@/lib/geo-utils"
import { MapView, type MapLocation } from "@/components/map/map-view"

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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog" // usa seu wrapper consistente
import { FreightRequest } from "@/types/freightRequest"

// Importa o tipo real do seu projeto — ajuste o path se necessário


type FreightStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED"

export function FreightDetailsContent() {
  const router = useRouter()
  const { id } = useParams() as { id?: string } // id pode vir undefined
  const { toast } = useToast()
  const { user, userProfile, isLoading: authLoading } = useAuth()

  const [freight, setFreight] = useState<FreightRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([])
  const [isLoadingMap, setIsLoadingMap] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [openReasonDialog, setOpenReasonDialog] = useState(false)
  const [showReasonInline, setShowReasonInline] = useState(false)
  const [mapError, setMapError] = useState(false)

  // helper seguro para formatar datas (evita new Date(undefined) crash)
  const safeFormatDate = (value?: string | Date | null, locale = "pt-AO", opts?: Intl.DateTimeFormatOptions) => {
    if (!value) return "-"
    try {
      const d = typeof value === "string" ? new Date(value) : value
      if (Number.isNaN(d.getTime())) return "-"
      return d.toLocaleDateString(locale, opts)
    } catch {
      return "-"
    }
  }

  // badge helper (mantém sua UI)
  const getStatusBadge = (status?: FreightStatus | string | null) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pendente
          </Badge>
        )
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Atribuído
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Em Trânsito
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Entregue
          </Badge>
        )
      case "CANCELED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">{String(status ?? "-")}</Badge>
    }
  }

  // buscar detalhes do frete
  const fetchFreight = useCallback(async () => {
    // proteção: só buscar se id existir
    if (!id) {
      toast?.({
        title: "Erro",
        description: "ID do frete ausente na rota.",
        variant: "destructive",
      })
      router.replace("/dashboard")
      return
    }

    try {
      setLoading(true)
      const data = await FreightRequestService.getFreightDetail(id)

      if (!data) {
        toast?.({
          title: "Erro",
          description: "Frete não encontrado.",
          variant: "destructive",
        })
        router.replace("/dashboard")
        return
      }

      setFreight(data)

      // Geocodifica com fallback silencioso
      try {
        setIsLoadingMap(true)
        setMapError(false)

        const originCoords = await geocodeAddress(data.origin).catch((e) => {
          console.warn("geocode origin failed", e)
          return null
        })
        const destinationCoords = await geocodeAddress(data.destination).catch((e) => {
          console.warn("geocode destination failed", e)
          return null
        })

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

        if (!originCoords || !destinationCoords) {
          // marca erro no mapa para habilitar fallback UI
          setMapError(true)
        }
      } catch (err) {
        console.error("Erro ao geocodificar:", err)
        setMapError(true)
      } finally {
        setIsLoadingMap(false)
      }
    } catch (err) {
      console.error("Erro ao carregar frete:", err)
      toast?.({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do frete.",
        variant: "destructive",
      })
      router.replace("/dashboard")
    } finally {
      setLoading(false)
    }
  }, [id, router, toast])

  // aguarda auth carregar — evita buscar antes do contexto pronto
  useEffect(() => {
    if (authLoading) return
    // se não autenticado, redireciona
    if (!user) {
      toast?.({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      })
      router.replace("/login")
      return
    }
    // busca frete quando tudo pronto
    fetchFreight()
  }, [authLoading, user, fetchFreight, router, toast])

  // cancelar frete
  const handleCancelFreight = async () => {
    if (!id) return

    if (!cancelReason.trim()) {
      toast?.({
        title: "Erro",
        description: "Por favor, informe o motivo do cancelamento.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDialogOpen(false)
      // mostra loading local (opcional)
      await FreightRequestService.cancel(id)
      toast?.({
        title: "Frete cancelado",
        description: "Seu frete foi cancelado com sucesso.",
      })
      // atualiza estado local - refetch para garantir sincronia com backend
      await fetchFreight()
      // redireciona para lista de fretes do cliente (opcional)
      router.replace("/services/client/my-freights")
    } catch (err) {
      console.error("Erro ao cancelar frete:", err)
      toast?.({
        title: "Erro ao cancelar",
        description: "Ocorreu um erro ao cancelar. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Loading skeleton
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

        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="h-6 bg-muted animate-pulse rounded">&nbsp;</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Render final (freight carregado)
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
              Criado em {safeFormatDate(freight.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(freight.status)}
          <Button asChild>
            <Link href={`/services/client/tracking?id=${id}`}>Rastrear</Link>
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancelFreight}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reason dialog (read-only) */}
      <Dialog open={openReasonDialog} onOpenChange={setOpenReasonDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Motivo do Cancelamento</DialogTitle>
          </DialogHeader>

          {/* <p className="text-sm text-muted-foreground whitespace-pre-line">
            {freight.cancelationReason ?? "Nenhum motivo informado."}
          </p> */}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenReasonDialog(false)}>
              Fechar
            </Button>
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
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Frete</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium flex items-center gap-2 mb-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        Origem
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Endereço</p>
                        <p>{freight.origin ?? "-"}</p>
                        <p className="text-sm text-muted-foreground mt-2">Cidade/Província</p>
                        <p>{freight.originState ?? "-"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium flex items-center gap-2 mb-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        Destino
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Endereço</p>
                        <p>{freight.destination ?? "-"}</p>
                        <p className="text-sm text-muted-foreground mt-2">Cidade/Província</p>
                        <p>{freight.destinationState ?? "-"}</p>
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
                        <p>{freight.cargoType ?? "-"}</p>
                        <p className="text-sm text-muted-foreground mt-2">Peso</p>
                        <p>{freight.weightKg ?? "-"}</p>
                        <p className="text-sm text-muted-foreground mt-2">Quantidade</p>
                        <p>{freight.quantity ?? "-"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium flex items-center gap-2 mb-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        Datas
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Coleta</p>
                        <p>{safeFormatDate(freight.pickupDate)}</p>
                        <p className="text-sm text-muted-foreground mt-2">Entrega</p>
                        <p>{safeFormatDate(freight.deliveryDate)}</p>
                        <p className="text-sm text-muted-foreground mt-2">Preço</p>
                        <p>{typeof freight.price === "number" ? `${freight.price} KZ` : "-"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-primary" />
                        Requisitos
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full ${freight.requiresLoadingHelp ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <p>Ajuda na carga</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full ${freight.requiresUnloadingHelp ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <p>Ajuda na descarga</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full ${freight.hasInsurance ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <p>Seguro</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {freight.description && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="font-medium mb-3">Descrição</h3>
                        <p className="text-muted-foreground">{freight.description}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Histórico de Status</CardTitle>
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
                          {safeFormatDate(freight.createdAt, "pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>

                    {(freight.status !== "PENDING" && (freight as any).assignedTransporterId) && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <Truck className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Frete atribuído a transportador</p>
                          <p className="text-sm text-muted-foreground">
                            {safeFormatDate(freight.pickupDate ?? freight.createdAt, "pt-AO", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {freight.status === "IN_PROGRESS" && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                          <Truck className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Frete em trânsito</p>
                          <p className="text-sm text-muted-foreground">
                            {safeFormatDate(new Date(), "pt-AO", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    )}

                    {freight.status === "COMPLETED" && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Frete entregue</p>
                          <p className="text-sm text-muted-foreground">
                            {safeFormatDate(new Date(), "pt-AO", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    )}

                    {freight.status === "CANCELED" && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Frete cancelado</p>
                          {/* <p className="text-sm text-muted-foreground">
                            {safeFormatDate(freight.canceledAt)}
                          </p> */}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    Mapa da Rota
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingMap ? (
                    <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                      <p>Carregando mapa...</p>
                    </div>
                  ) : mapError || mapLocations.length < 2 ? (
                    <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                      <p>Não foi possível carregar as localizações no mapa.</p>
                    </div>
                  ) : (
                    <MapView
                      locations={mapLocations}
                      showRoute
                      height="400px"
                      vehiclePosition={
                        freight.status === "IN_PROGRESS" && mapLocations.length >= 2
                          ? {
                              latitude: (mapLocations[0].latitude + mapLocations[1].latitude) / 2,
                              longitude: (mapLocations[0].longitude + mapLocations[1].longitude) / 2,
                              name: "Veículo em trânsito",
                              description: `Transportando frete #${id}`,
                            }
                          : undefined
                      }
                    />
                  )}

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Distância Estimada</h4>
                      <p className="text-xl">{freight.estimatedDistance ?? "-" } km</p>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Tempo Estimado</h4>
                      <p className="text-xl">{freight.estimatedTime ?? "-"} horas</p>
                    </div>
                  </div>

                  {freight.status === "IN_PROGRESS" && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="text-sm font-medium text-blue-700 mb-1">Informações de Rastreamento</h4>
                      <p className="text-sm">
                        Veículo em trânsito. Previsão de chegada: {safeFormatDate(freight.deliveryDate)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{userProfile?.person?.fullName ?? user?.name ?? "-"}</p>
                  <p className="text-sm text-muted-foreground">
                    Cliente desde {safeFormatDate(user?.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span>{userProfile?.email ?? user?.email ?? "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Telefone</span>
                  <span>{userProfile?.person?.phone ?? user?.phone ?? "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Empresa</span>
                  <span>{userProfile?.client?.companyName ?? "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {(freight.status !== "PENDING" && (freight as any).assignedTransporterId) && (
            <Card>
              <CardHeader>
                <CardTitle>Transportador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{(freight as any).transporterName ?? "-"}</p>
                    <p className="text-sm text-muted-foreground">
                      Transportador desde {safeFormatDate((freight as any).transporterCreatedAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span>{(freight as any).transporterEmail ?? "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Telefone</span>
                    <span>{(freight as any).transporterPhone ?? "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avaliação</span>
                    <span className="flex items-center">
                      4.8
                      <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {freight.status === "PENDING" && (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/services/client/freight/edit/${id}`)}
                  >
                    Editar Frete
                  </Button>

                  <Button onClick={() => setIsDialogOpen(true)} variant="destructive" className="w-full">
                    Cancelar Frete
                  </Button>
                </>
              )}

              {freight.status === "ACCEPTED" && (
                <>
                  <Button className="w-full">Ver Detalhes do Contrato</Button>
                  <Button variant="outline" className="w-full">Contactar Transportador</Button>
                  <Button variant="destructive" className="w-full">Reportar Problema</Button>
                </>
              )}

              {freight.status === "IN_PROGRESS" && (
                <>
                  <Button className="w-full" asChild>
                    <Link href={`/services/client/tracking?id=${id}`}>Rastrear Frete</Link>
                  </Button>
                  <Button variant="outline" className="w-full">Contactar Transportador</Button>
                  <Button variant="destructive" className="w-full">Reportar Problema</Button>
                </>
              )}

              {freight.status === "COMPLETED" && (
                <>
                  <Button className="w-full">Avaliar Transportador</Button>
                  <Button variant="outline" className="w-full">Ver Recibo</Button>
                  <Button variant="outline" className="w-full">Solicitar Novo Frete</Button>
                </>
              )}

              {freight.status === "CANCELED" && (
                <>
                  <Button className="w-full">Criar Novo Frete</Button>
                  {/* <Button variant="outline" className="w-full" onClick={() => setShowReasonInline(!showReason)}>
                    {showReasonInline ? "Esconder Motivo" : "Ver Motivo do Cancelamento"}
                  </Button> */}

                  {showReasonInline && (
                    <div className="mt-2 p-4 rounded-lg border bg-muted text-sm text-muted-foreground">
                      Nenhum motivo informado
                      {/* {freight.cancelationReason ?? "Nenhum motivo informado"} */}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/**
 * Export default page wrapper — mantém um small wrapper para possível proteção (ProtectedRoute)
 * Se no futuro quiser trocar por Server Component para SSR, dá pra extrair a fetch para server.
 */
export default function FreightDetailsPage() {
  return <FreightDetailsContent />
}

