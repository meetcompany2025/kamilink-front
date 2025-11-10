"use client"

import { useState } from "react"
import Link from "next/link"
import {
  TruckIcon,
  UsersIcon,
  UserCogIcon,
  ClipboardListIcon,
  DollarSignIcon,
  BarChart3Icon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AdministrativeDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock de dados globais — no real usar fetch do backend
  const stats = {
    totalVehicles: 125,
    totalTransporters: 58,
    totalClients: 210,
    totalFreights: 342,
    activeFreights: 12,
    revenueMonth: 1500000,
    revenueChange: 8.5,
  }

  const recentRegistrations = [
    { id: 1, type: "Transportador", name: "Carlos Alberto", date: "10/08/2025" },
    { id: 2, type: "Cliente", name: "Maria Silva", date: "09/08/2025" },
    { id: 3, type: "Veículo", name: "Scania R450 - LD-45-89-BC", date: "08/08/2025" },
  ]

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral da plataforma e dados agregados de operações.
          </p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/admin/manage">
            <UserCogIcon className="mr-2 h-4 w-4" />
            Gerir Plataforma
          </Link>
        </Button>
      </div>

      {/* KPIs principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Veículos Registados</CardTitle>
            <TruckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transportadores</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransporters}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.revenueMonth.toLocaleString("pt-AO")} KZ</div>
            <p className={`text-xs mt-1 ${stats.revenueChange > 0 ? "text-green-500" : "text-red-500"}`}>
              {stats.revenueChange > 0 ? "+" : ""}{stats.revenueChange}% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      
      {/* Tabs */}
<Tabs defaultValue="overview" className="mb-8" onValueChange={(value) => setActiveTab(value)}>
  <TabsList>
    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
    <TabsTrigger value="registrations">Últimos Registos</TabsTrigger>
    <TabsTrigger value="freights">Fretes</TabsTrigger>
  </TabsList>

  {/* --- VISÃO GERAL --- */}
  <TabsContent value="overview" className="mt-6 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Resumo das ações recentes na plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground">Fretes concluídos este mês</p>
            <p className="text-2xl font-bold">85</p>
          </div>
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground">Novos usuários</p>
            <p className="text-2xl font-bold">27</p>
          </div>
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground">Receita acumulada</p>
            <p className="text-2xl font-bold">2.340.000 KZ</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Taxa de Crescimento</CardTitle>
        <CardDescription>Crescimento de registros comparado ao mês anterior</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={68} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">68% da meta mensal atingida</p>
      </CardContent>
    </Card>
  </TabsContent>

  {/* --- REGISTOS --- */}
  <TabsContent value="registrations" className="mt-6">
    <Card>
      <CardHeader>
        <CardTitle>Últimos Registos</CardTitle>
        <CardDescription>Novos transportadores, clientes e veículos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentRegistrations.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.type} — {item.date}
              </p>
            </div>
            <Badge variant={item.type === "Transportador" ? "default" : item.type === "Cliente" ? "secondary" : "outline"}>
              {item.type}
            </Badge>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Ver todos os registos
        </Button>
      </CardFooter>
    </Card>
  </TabsContent>

  {/* --- FRETES --- */}
  <TabsContent value="freights" className="mt-6 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Resumo de Fretes</CardTitle>
        <CardDescription>Visão geral dos fretes na plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground">Total de fretes</p>
            <p className="text-2xl font-bold">{stats.totalFreights}</p>
          </div>
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground">Fretes ativos</p>
            <p className="text-2xl font-bold">{stats.activeFreights}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Fretes Recentes</CardTitle>
        <CardDescription>Últimos fretes criados ou atualizados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { id: 1, route: "Luanda → Benguela", status: "Concluído", date: "10/08/2025" },
          { id: 2, route: "Huambo → Lubango", status: "Em andamento", date: "09/08/2025" },
          { id: 3, route: "Namibe → Luanda", status: "Cancelado", date: "08/08/2025" },
        ].map((freight) => (
          <div key={freight.id} className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">{freight.route}</p>
              <p className="text-xs text-muted-foreground">{freight.date}</p>
            </div>
            <Badge
              variant={
                freight.status === "Concluído"
                  ? "default"
                  : freight.status === "Em andamento"
                  ? "secondary"
                  : "destructive"
              }
            >
              {freight.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>

    </div>
  )
}
