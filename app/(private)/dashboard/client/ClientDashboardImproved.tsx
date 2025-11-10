"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  MapPin,
  Package,
  Truck,
  AlertTriangle,
  RefreshCw,
  Database,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { getClientDashboard } from "@/services/clientService"
// Remove this import for now since the service file wasn't fully created
// import { dashboardDataService, type DashboardData } from "@/lib/services/dashboard-data"
//import { createClient } from "@/lib/supabase/client"


// Add type definition
type DashboardData = {
  stats: {
    totalFreights: number
    activeFreights: number
    completedFreights: number
    pendingFreights: number
  }
  activeFreights: any[]
  historyFreights: any[]
  pendingFreights: any[]
}

const activeFreights = [
  {
    id: "fgt123456",
    tracking_number: "KL-001234",
    status: "in_transit", // or "assigned" or "pending"
    origin_city: "São Paulo",
    destination_city: "Rio de Janeiro",
    delivery_date: "2025-08-10T00:00:00Z",
  },
  {
    id: "fgt654321",
    tracking_number: "KL-009876",
    status: "assigned",
    origin_city: "Curitiba",
    destination_city: "Porto Alegre",
    delivery_date: "2025-08-12T00:00:00Z",
  },
  {
    id: "fgt112233",
    tracking_number: "KL-061237",
    status: "pending",
    origin_city: "Belo Horizonte",
    destination_city: "Brasília",
    delivery_date: "2025-08-15T00:00:00Z",
  },
]


const historyFreights = [
  {
    id: 'hist-001',
    tracking_number: 'HIST123456',
    status: 'delivered', // ou 'cancelled'
    origin_city: 'São Paulo, SP',
    destination_city: 'Rio de Janeiro, RJ',
    created_at: '2025-07-15T10:30:00Z',
  },
  {
    id: 'hist-002',
    tracking_number: 'HIST654321',
    status: 'cancelled',
    origin_city: 'Curitiba, PR',
    destination_city: 'Porto Alegre, RS',
    created_at: '2025-07-01T15:45:00Z',
  },
]

const pendingFreights = [
  {
    id: 'pend-001',
    tracking_number: 'PEND123456',
    origin_city: 'Belo Horizonte, MG',
    destination_city: 'Salvador, BA',
    pickup_date: '2025-08-10T08:00:00Z',
    freight_offers: [
      { id: 'offer-001', value: 3000 },
      { id: 'offer-002', value: 2850 },
    ],
  },
  {
    id: 'pend-002',
    tracking_number: 'PEND654321',
    origin_city: 'Fortaleza, CE',
    destination_city: 'Recife, PE',
    pickup_date: '2025-08-09T13:00:00Z',
    freight_offers: [],
  },
]



export default function ClientDashboardImproved() {
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { user, isLoading: authLoading, userProfile } = useAuth()
  const { toast } = useToast()

  const fetchDashboardData = async (showToast = false) => {
    if (!user?.id) {
      console.log("⚠️ No user ID available for data fetch")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // console.log("🔄 Fetching dashboard data for user:", user.id)


      // Fetch dashboard data
      const data = await getClientDashboard();
      // console.log("Dashboard", data);
      setDashboardData(data)

      if (showToast) {
        toast({
          title: "Data refreshed",
          description: "Dashboard data has been updated successfully.",
        })
      }

      //console.log("✅ Dashboard data loaded successfully:", data)
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error)
      setError(error.message)

      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    fetchDashboardData(true)
  }

  useEffect(() => {
    if (user?.id && !authLoading) {
      fetchDashboardData()
    }
  }, [])

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full" />
        </div>
        <div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  )

  // Error display
  const ErrorDisplay = () => (
    <div className="container mx-auto py-10 px-4">
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Dashboard</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{error}</p>
          <div className="flex gap-2">
            <Button onClick={handleRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry ({retryCount})
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/diagnostics">
                <Database className="h-4 w-4 mr-2" />
                Run Diagnostics
              </Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Show debug information in development */}
      
    </div>
  )

  // Authentication check
  if (authLoading) {
    return <LoadingSkeleton />
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Autenticação Necessária</AlertTitle>
          <AlertDescription>
            <Link href="/login" className="font-medium underline underline-offset-4">
              Faça o login
            </Link>{" "}
            para acessar o seu dashboard.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorDisplay />
  }

  /*if (!dashboardData) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            No dashboard data could be loaded. This might be because you haven't created any freight requests yet.
            <div className="mt-4">
              <Button asChild>
                <Link href="/services/freight">Create Your First Freight Request</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }*/

  // Use userProfile data if available, otherwise fall back to user data
  const displayName = userProfile?.person.fullName || "User"
  const { client, stats, freights, lastUpdated } = dashboardData?.client

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Bem vindo, {displayName}</h1>
          <p className="text-muted-foreground">Dashboard do Cliente</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => fetchDashboardData(true)} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Recarregar
          </Button>
          <Button asChild>
            <Link href="/services/client/freight">
              Solicitar Fretes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total de Fretes</p>
                <p className="text-2xl font-bold">{stats.totalFreights}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Fretes Ativos</p>
                <p className="text-2xl font-bold">{stats.activeFreights}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Pedidos Concluidos</p>
                <p className="text-2xl font-bold">{stats.completedFreights}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Ofertas Pendentes</p>
                <p className="text-2xl font-bold">{stats.pendingFreights}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Status Indicator */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Dados carregados com sucesso</span>
              <Badge variant="secondary">{stats.totalFreights} fretes</Badge>
            </div>
            <div className="text-xs text-muted-foreground">Ultima atualização: {new Date(lastUpdated).toLocaleDateString("pt-AO")}</div>
          </div>
        </CardContent>
      </Card>

      {/* Freight Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Fretes Activos ({freights.active.length})</TabsTrigger>
          <TabsTrigger value="history">Historico ({freights.history.length})</TabsTrigger>
          
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-4">
            {console.log(freights.active.length)}
            {!freights.active.length ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sem Fretes Disponíveis</h3>
                  <p className="text-muted-foreground mb-4">
                    
                    Não possui pedidos de fretes activos no momento
                  </p>
                  <Button asChild>
                    <Link href="/services/client/freight">Solicitar Fretes</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              freights.active.map((freight) => (
                <Card key={freight.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            {freight.id}
                          </h3>
                          <Badge variant="outline">
                            {freight.status === "IN_PROGRESS"
                              ? "Em Andmanento"
                              : freight.status === "ACCEPTED"
                                ? "Atribuido"
                                : "Pendente"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {freight.origin} → {freight.destination}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Entrega: {new Date(freight.deliveryDate).toLocaleDateString("pt-AO")}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button asChild size="sm">
                          <Link href={`/services/client/tracking?id=${freight.id}`}>Rastrear</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {freights.history.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sem Historico Disponível</h3>
                  <p className="text-muted-foreground">You don't have any completed or cancelled freights yet.</p>
                </CardContent>
              </Card>
            ) : (
              freights.history.map((freight) => (
                <Card key={freight.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            {freight.id}
                          </h3>
                          <Badge variant={freight.status === "COMPLETED" ? "default" : "destructive"}>
                            {freight.status === "COMPLETED" ? "Completo" : "Cancelado"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {freight.origin} → {freight.destination}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Concluido aos: {new Date(freight.createdAt).toLocaleDateString("pt-AO")}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>


        {/*<TabsContent value="pending">
          <div className="space-y-4">
            {pendingFreights.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Pending Offers</h3>
                  <p className="text-muted-foreground">You don't have any freight requests with pending offers.</p>
                </CardContent>
              </Card>
            ) : (
              pendingFreights.map((freight) => (
                <Card key={freight.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            {freight.tracking_number || `FR-${freight.id.slice(0, 6)}`}
                          </h3>
                          <Badge variant="outline">{freight.freight_offers?.length || 0} Offers</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {freight.origin_city} → {freight.destination_city}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Pickup: {new Date(freight.pickup_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button asChild size="sm">
                          <Link href={`/services/freight/${freight.id}/offers`}>View Offers</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>*/}
        
      </Tabs>
    </div>
  )
}
