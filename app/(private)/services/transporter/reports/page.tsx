"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BarChart, Calendar, Download, FileText, TrendingUp, Truck } from "lucide-react"

export default function ReportsPage() {
  const [period, setPeriod] = useState("month")

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para serviços
        </Link>
        <h1 className="text-2xl font-bold mt-4">Relatórios e Estatísticas</h1>
        <p className="text-muted-foreground">Visualize dados e métricas sobre suas operações na plataforma</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-semibold">Visão Geral</h2>
          <p className="text-muted-foreground">Resumo das suas atividades na plataforma</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Fretes Realizados</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+12%</span>
              <span className="text-muted-foreground ml-1">vs. período anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Valor Total</p>
                <p className="text-2xl font-bold">AOA 1.2M</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+8%</span>
              <span className="text-muted-foreground ml-1">vs. período anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Distância Total</p>
                <p className="text-2xl font-bold">15,420 km</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+15%</span>
              <span className="text-muted-foreground ml-1">vs. período anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Taxa de Pontualidade</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+2%</span>
              <span className="text-muted-foreground ml-1">vs. período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fretes por Província</CardTitle>
                <CardDescription>Distribuição de fretes por província de destino</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">Gráfico de Fretes por Província</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fretes por Tipo de Carga</CardTitle>
                <CardDescription>Distribuição de fretes por tipo de carga transportada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">Gráfico de Fretes por Tipo de Carga</p>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendência de Fretes</CardTitle>
                <CardDescription>Evolução do número de fretes ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">Gráfico de Tendência de Fretes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="financial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita por Mês</CardTitle>
                <CardDescription>Evolução da receita mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">Gráfico de Receita Mensal</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Valor Médio por Frete</CardTitle>
                <CardDescription>Evolução do valor médio dos fretes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">Gráfico de Valor Médio</p>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Detalhamento Financeiro</CardTitle>
                <CardDescription>Detalhamento dos valores por frete</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 font-medium border-b">
                    <div>ID do Frete</div>
                    <div>Data</div>
                    <div>Origem - Destino</div>
                    <div>Tipo de Carga</div>
                    <div className="text-right">Valor</div>
                  </div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-5 p-4 border-b last:border-0">
                      <div>FR-00{i}</div>
                      <div>10/0{i}/2023</div>
                      <div>Luanda - Benguela</div>
                      <div>Carga Geral</div>
                      <div className="text-right">AOA {(i * 50000).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Pontualidade</CardTitle>
                <CardDescription>Percentual de entregas realizadas no prazo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">Gráfico de Taxa de Pontualidade</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Avaliações Recebidas</CardTitle>
                <CardDescription>Distribuição das avaliações recebidas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">Gráfico de Avaliações</p>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Desempenho por Rota</CardTitle>
                <CardDescription>Análise de desempenho por rota</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 font-medium border-b">
                    <div>Rota</div>
                    <div>Distância Média</div>
                    <div>Tempo Médio</div>
                    <div>Pontualidade</div>
                    <div>Avaliação Média</div>
                  </div>
                  {[
                    { route: "Luanda - Benguela", distance: "540 km", time: "8h", punctuality: "97%", rating: "4.8" },
                    { route: "Luanda - Huambo", distance: "600 km", time: "9h", punctuality: "95%", rating: "4.7" },
                    { route: "Benguela - Lubango", distance: "350 km", time: "5h", punctuality: "98%", rating: "4.9" },
                    { route: "Luanda - Malanje", distance: "380 km", time: "6h", punctuality: "96%", rating: "4.6" },
                    { route: "Benguela - Namibe", distance: "280 km", time: "4h", punctuality: "99%", rating: "4.8" },
                  ].map((item, i) => (
                    <div key={i} className="grid grid-cols-5 p-4 border-b last:border-0">
                      <div>{item.route}</div>
                      <div>{item.distance}</div>
                      <div>{item.time}</div>
                      <div>{item.punctuality}</div>
                      <div>{item.rating}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
