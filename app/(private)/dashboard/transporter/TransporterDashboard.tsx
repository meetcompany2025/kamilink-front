"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  TruckIcon,
  BarChart3Icon,
  CalendarIcon,
  DollarSignIcon,
  MapPinIcon,
  StarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { getTransporterDashboard } from "@/services/transporterService"
import { Skeleton } from "@/components/ui/skeleton"

// Dados simulados para o dashboard
const statsEx = {
    balance: 245000,
    earnings: {
      current: 120000,
      previous: 95000,
      percentChange: 26.3,
    },
    completedFreights: 18,
    rating: 4.8,
    activeFreights: 3,
  }

  const recentFreights = [
    {
      id: "FR-2023-05-12",
      origin: "Luanda",
      destination: "Benguela",
      date: "12/05/2023",
      value: 45000,
      status: "completed",
    },
    {
      id: "FR-2023-05-15",
      origin: "Huambo",
      destination: "Lubango",
      date: "15/05/2023",
      value: 38000,
      status: "completed",
    },
    {
      id: "FR-2023-05-20",
      origin: "Luanda",
      destination: "Malanje",
      date: "20/05/2023",
      value: 52000,
      status: "in_progress",
    },
  ]

  const upcomingFreights = [
    {
      id: "FR-2023-05-25",
      origin: "Benguela",
      destination: "Namibe",
      date: "25/05/2023",
      value: 48000,
      status: "scheduled",
    },
    {
      id: "FR-2023-05-28",
      origin: "Luanda",
      destination: "Cabinda",
      date: "28/05/2023",
      value: 65000,
      status: "scheduled",
    },
  ]

export default function TransporterDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { user, isLoading: authLoading, userProfile } = useAuth()
  const { toast } = useToast()
  
  console.log(user);

useEffect(() => {

      if (user?.id && !authLoading) {
        fetchDashboardData()
      }

    }, [user?.id, !authLoading])

  const fetchDashboardData = async (showToast = false) => {
      if (!user?.id) {
        console.log("⚠️ No user ID available for data fetch")
        return
      }

      console.log("Entrou no fetch")
  
      try {
        setIsLoading(true)
        setError(null)
  
        console.log("🔄 Fetching dashboard data for user:", user.id)
  
  
        // Fetch dashboard data
        const data = await getTransporterDashboard();
        console.log("Dashboard", data);
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
  
  if (authLoading) {
    return <LoadingSkeleton />
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Em Andamento</Badge>
      case "ACCEPTED":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Atribuido</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case "IN_PROGRESS":
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case "ACCEPTED":
        return <CalendarIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircleIcon className="h-5 w-5 text-gray-500" />
    }
  }

    const displayName = userProfile?.person.fullName || "User"
      const { transporter, stats, freights, vehicles } = dashboardData?.transporter


  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Olá, {displayName}</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle. Aqui você pode gerenciar seus fretes e finanças.
          </p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/services/transporter/find-freight">
            <TruckIcon className="mr-2 h-4 w-4" />
            Encontrar Fretes
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsEx.balance.toLocaleString("pt-AO")} KZ</div>
            <p className="text-xs text-muted-foreground mt-1">Disponível para saque</p>
            <Button variant="outline" size="sm" className="mt-3 w-full">
              Solicitar Saque
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganhos do Mês</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsEx.earnings.current.toLocaleString("pt-AO")} KZ</div>
            <div className="flex items-center mt-1">
              {statsEx.earnings.percentChange > 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <p className={`text-xs ${statsEx.earnings.percentChange > 0 ? "text-green-500" : "text-red-500"}`}>
                {statsEx.earnings.percentChange}% em relação ao mês anterior
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fretes Concluídos</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedFreights}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de fretes concluídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação</CardTitle>
            <StarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsEx.rating}/5.0</div>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.floor(statsEx.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8" onValueChange={(value) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="active">Fretes Ativos ({stats.activeFreights})</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos Fretes ({stats.upcomingFreights})</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Fretes Recentes</CardTitle>
                <CardDescription>Seus últimos fretes realizados e em andamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {freights.recent.map((freight) => (
                    <div key={freight.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-start space-x-4">
                        {getStatusIcon(freight.status)}
                        <div>
                          <p className="font-medium">
                            {freight.origin} → {freight.destination}
                          </p>
                          <p className="text-sm text-muted-foreground">ID: {freight.id}</p>
                          <p className="text-sm text-muted-foreground">Data de Levantamento: {freight.pickupDate}</p>
                          <p className="text-sm text-muted-foreground">Data de Entrega: {freight.deliveryDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{freight.price} KZ</p>
                        {getStatusBadge(freight.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/services/transporter/my-freights">Ver Todos os Fretes</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Carregamentos</CardTitle>
                <CardDescription>Carregamentos previstos para os próximos dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {freights.upcoming.map((freight) => (
                    <div key={freight.id} className="border-b pb-4">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium">{freight.id}</p>
                        <p className="font-bold">{freight.price} KZ</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Previsão para Levantamento: {freight.pickupDate}</p>
                      <div className="mt-2">
                        <Progress value={70} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">70% concluído</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/services/transporter/financial">Ver Financeiro</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Veículos Registrados</CardTitle>
                <CardDescription>Gerencie seus veículos e documentação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        <TruckIcon className="h-10 w-10 text-primary" />
                        <div>
                          <p className="font-medium">{vehicle.brand + vehicle.model}</p>
                          <p className="text-sm text-muted-foreground">Matrícula: {vehicle.licensePlate}</p>
                          <Badge className="mt-1 bg-green-500 hover:bg-green-600">{vehicle.status}</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </div>
                  ))}
                  {/*<div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <TruckIcon className="h-10 w-10 text-primary" />
                      <div>
                        <p className="font-medium">Scania R450</p>
                        <p className="text-sm text-muted-foreground">Matrícula: LD-78-90-CD</p>
                        <Badge className="mt-1 bg-yellow-500 hover:bg-yellow-600">Manutenção</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </div>*/}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/services/transporter/vehicles/register-vehicle">Adicionar Veículo</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fretes Próximos de Você</CardTitle>
                <CardDescription>Fretes disponíveis na sua região</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 text-red-500 mr-2" />
                        <p className="font-medium">Luanda → Malanje</p>
                      </div>
                      <p className="font-bold">58.000 KZ</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Distância: 380 km</p>
                    <p className="text-sm text-muted-foreground">Carga: Materiais de construção (2.5 ton)</p>
                    <Button size="sm" className="mt-2">
                      Ver Detalhes
                    </Button>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 text-red-500 mr-2" />
                        <p className="font-medium">Luanda → Benguela</p>
                      </div>
                      <p className="font-bold">75.000 KZ</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Distância: 540 km</p>
                    <p className="text-sm text-muted-foreground">Carga: Alimentos (3 ton)</p>
                    <Button size="sm" className="mt-2">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/services/find-freight">Ver Mais Fretes</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Fretes Ativos</CardTitle>
              <CardDescription>Fretes que você está transportando atualmente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {freights.recent
                  .filter((freight) => (freight.status === "IN_PROGRESS" || freight.status === "ACCEPTED"))
                  .map((freight) => (
                    <div key={freight.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold">
                            {freight.origin} → {freight.destination}
                          </h3>
                          <p className="text-sm text-muted-foreground">ID: {freight.id}</p>
                        </div>
                        <div className="mt-2 md:mt-0 text-right">
                          <p className="font-bold text-lg">{freight.price} KZ</p>
                          {getStatusBadge(freight.status)}
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium mb-2">Detalhes da Carga</h4>
                          <p className="text-sm">Tipo: {freight.cargoType}</p>
                          <p className="text-sm">Peso: {freight.weightKg} Kg</p>
                          <p className="text-sm">Dimensões: {freight.lenghtCm + freight.heightCm + freight.widthCm}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Progresso</h4>
                          <Progress value={65} className="h-2 mb-2" />
                          <p className="text-sm">65% concluído</p>
                          <p className="text-sm">Previsão de entrega: {freight.deliveryDate}</p>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="outline">Atualizar Status</Button>
                        <Button>Ver Detalhes</Button>
                      </div>
                    </div>
                  ))}

                {freights.recent.filter((freight) => (freight.status === "IN_PROGRESS" || freight.status === "ACCEPTED")).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Você não possui fretes ativos no momento.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/services/find-freight">Encontrar Fretes</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Fretes</CardTitle>
              <CardDescription>Fretes agendados para os próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {freights.upcoming.map((freight) => (
                  <div key={freight.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">
                          {freight.origin} → {freight.destination}
                        </h3>
                        <p className="text-sm text-muted-foreground">ID: {freight.id}</p>
                      </div>
                      <div className="mt-2 md:mt-0 text-right">
                        <p className="font-bold text-lg">{freight.price} KZ</p>
                        {getStatusBadge(freight.status)}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">Detalhes da Carga</h4>
                         <p className="text-sm">Tipo: {freight.cargoType}</p>
                          <p className="text-sm">Peso: {freight.weightKg} Kg</p>
                          <p className="text-sm">Dimensões: {freight.lenghtCm + freight.heightCm + freight.widthCm}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Programação</h4>
                        <p className="text-sm">Data de coleta: {freight.pickupDate}</p>
                        <p className="text-sm">Horário: N/A</p>
                        <p className="text-sm">Endereço: {freight.origin}</p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="outline">Reagendar</Button>
                      <Button>Ver Detalhes</Button>
                    </div>
                  </div>
                ))}

                {freights.upcoming.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Você não possui fretes agendados no momento.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/services/find-freight">Encontrar Fretes</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Fretes</CardTitle>
              <CardDescription>Todos os fretes que você já realizou</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {freights.history
                  .filter((freight) => (freight.status === "COMPLETED" || freight.status === "CANCELED"))
                  .map((freight) => (
                    <div key={freight.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-start space-x-4">
                        {getStatusIcon(freight.status)}
                        <div>
                          <p className="font-medium">
                            {freight.origin} → {freight.destination}
                          </p>
                          <p className="text-sm text-muted-foreground">ID: {freight.id}</p>
                          <p className="text-sm text-muted-foreground">Data de Levantamento: {freight.pickupDate}</p>
                          <p className="text-sm text-muted-foreground">Data de Entrega: {freight.deliveryDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{freight.price} KZ</p>
                        {getStatusBadge(freight.status)}
                        <Button variant="ghost" size="sm" className="mt-1">
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}

                {recentFreights.filter((freight) => freight.status === "COMPLETED").length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Você ainda não realizou nenhum frete.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/services/find-freight">Encontrar Fretes</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/services/my-freights">Ver Histórico Completo</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
