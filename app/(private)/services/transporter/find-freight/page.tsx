"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { ArrowLeft, ArrowRight, Calendar, Filter, MapPin, Package, Search, Star, Weight } from "lucide-react"
import { FreightRequestService } from "@/services/freightRequestService"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Mock apenas para fallback (caso a API falhe)
const mockFreights = []

export default function FindFreightPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrigin, setSelectedOrigin] = useState("")
  const [selectedDestination, setSelectedDestination] = useState("")
  const [selectedCargoType, setSelectedCargoType] = useState("")
  const [minWeight, setMinWeight] = useState(0)
  const [maxWeight, setMaxWeight] = useState(5000)
  const [onlyVerifiedClients, setOnlyVerifiedClients] = useState(false)
  const [filteredFreights, setFilteredFreights] = useState<typeof mockFreights>([])
  const [isLoading, setIsLoading] = useState(true)

  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // 🔹 Carrega fretes disponíveis
  useEffect(() => {
    const fetchFreights = async () => {
      try {
        setIsLoading(true)
        if (!user) return
        const res = await FreightRequestService.findAvailable()
        setFilteredFreights(res?.length ? res : mockFreights)
      } catch (err) {
        console.error(err)
        toast({
          title: "Erro ao carregar fretes",
          description: "Não foi possível buscar os fretes. Tente novamente.",
          variant: "destructive",
        })
        setFilteredFreights(mockFreights)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFreights()
  }, [user, toast])

  // 🔹 Filtra fretes
  const handleSearch = () => {
    const filtered = (filteredFreights || []).filter((freight: any) => {
      if (
        searchTerm &&
        !freight.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !freight.origin.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !freight.destination.toLowerCase().includes(searchTerm.toLowerCase())
      ) return false

      if (selectedOrigin && selectedOrigin !== "all" && freight.originState !== selectedOrigin) return false
      if (selectedDestination && selectedDestination !== "all" && freight.destinationState !== selectedDestination) return false
      if (selectedCargoType && selectedCargoType !== "all" && freight.cargoType !== selectedCargoType) return false

      const freightWeight = parseInt(freight.weightKg || "0")
      if (freightWeight < minWeight || freightWeight > maxWeight) return false
      if (onlyVerifiedClients && freight.clientRating < 4.5) return false

      return true
    })
    setFilteredFreights(filtered)
  }

  if (isLoading) return <p className="text-center py-20">Carregando fretes...</p>

  return (
    <div className="container mx-auto py-10 px-4">
      {/* 🔹 Cabeçalho */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
        <h1 className="text-2xl font-bold mt-4">Encontrar Fretes</h1>
        <p className="text-muted-foreground">Encontre oportunidades de frete disponíveis para sua frota</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🔹 Filtros */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Campo de busca */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="ID, origem ou destino"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button onClick={handleSearch} size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Origem e Destino */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Origem</label>
                <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Luanda">Luanda</SelectItem>
                    <SelectItem value="Benguela">Benguela</SelectItem>
                    <SelectItem value="Huambo">Huambo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Destino</label>
                <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Luanda">Luanda</SelectItem>
                    <SelectItem value="Benguela">Benguela</SelectItem>
                    <SelectItem value="Huambo">Huambo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo e peso */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Carga</label>
                <Select value={selectedCargoType} onValueChange={setSelectedCargoType}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Carga Geral">Carga Geral</SelectItem>
                    <SelectItem value="Perecíveis">Perecíveis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Peso da Carga</label>
                  <span className="text-xs text-muted-foreground">{minWeight} - {maxWeight} kg</span>
                </div>
                <Slider
                  defaultValue={[minWeight, maxWeight]}
                  max={5000}
                  step={100}
                  onValueChange={(values) => {
                    setMinWeight(values[0])
                    setMaxWeight(values[1])
                  }}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="verified-clients" checked={onlyVerifiedClients} onCheckedChange={setOnlyVerifiedClients} />
                <label htmlFor="verified-clients" className="text-sm font-medium">
                  Apenas clientes verificados
                </label>
              </div>

              <Button onClick={handleSearch} className="w-full">Aplicar Filtros</Button>
            </CardContent>
          </Card>
        </div>

        {/* 🔹 Lista de Fretes */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Fretes Disponíveis ({filteredFreights.length})</h2>
            <Tabs defaultValue="all" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="nearby">Próximos</TabsTrigger>
                <TabsTrigger value="recommended">Recomendados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredFreights.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhum frete encontrado</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFreights.map((freight: any) => (
                <Card key={freight.id} className="hover:shadow-md">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-5 w-5 text-primary" />
                        <span className="font-bold">{freight.origin} → {freight.destination}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {freight.cargoType} • {freight.weightKg} kg
                      </p>
                    </div>

                    {/* 🔸 Redireciona para página de detalhes dinâmica */}
                    <Button asChild>
                      <Link href={`/services/transporter/freight/${freight.id}`}>
                        Ver Detalhes <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
