// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { ArrowLeft, ArrowRight, Calendar, Filter, MapPin, Package, Search, Star, Weight } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { FreightRequestService } from "@/services/freightRequestService"
// import { useAuth } from "@/components/auth-provider"
// import router from "next/router"
// import { useToast } from "@/components/ui/use-toast"

// // Dados mockados para demonstração
// const mockFreights = [
//   {
//     id: "FR-001",
//     origin: "Luanda",
//     originProvince: "Luanda",
//     destination: "Benguela",
//     destinationProvince: "Benguela",
//     distance: "540 km",
//     cargoType: "Carga Geral",
//     weight: "1200 kg",
//     dimensions: "300 x 200 x 150 cm",
//     price: "120.000 AOA",
//     pickupDate: "25/03/2023",
//     deliveryDate: "27/03/2023",
//     status: "available",
//     clientRating: 4.8,
//     clientName: "Distribuidora Central Ltda",
//     description: "Carga de produtos eletrônicos embalados em caixas de papelão. Requer cuidado no manuseio.",
//   },
//   {
//     id: "FR-002",
//     origin: "Benguela",
//     originProvince: "Benguela",
//     destination: "Huambo",
//     destinationProvince: "Huambo",
//     distance: "220 km",
//     cargoType: "Perecíveis",
//     weight: "800 kg",
//     dimensions: "250 x 180 x 120 cm",
//     price: "85.000 AOA",
//     pickupDate: "26/03/2023",
//     deliveryDate: "26/03/2023",
//     status: "available",
//     clientRating: 4.5,
//     clientName: "Mercado Fresco S.A.",
//     description: "Carga de frutas e vegetais frescos. Requer transporte refrigerado.",
//   },
//   {
//     id: "FR-003",
//     origin: "Luanda",
//     originProvince: "Luanda",
//     destination: "Lubango",
//     destinationProvince: "Huíla",
//     distance: "1020 km",
//     cargoType: "Máquinas e Equipamentos",
//     weight: "3500 kg",
//     dimensions: "400 x 250 x 200 cm",
//     price: "280.000 AOA",
//     pickupDate: "28/03/2023",
//     deliveryDate: "31/03/2023",
//     status: "available",
//     clientRating: 4.9,
//     clientName: "Construções Modernas Ltda",
//     description: "Equipamentos de construção civil. Requer caminhão com capacidade para carga pesada.",
//   },
//   {
//     id: "FR-004",
//     origin: "Cabinda",
//     originProvince: "Cabinda",
//     destination: "Luanda",
//     destinationProvince: "Luanda",
//     distance: "490 km",
//     cargoType: "Móveis",
//     weight: "950 kg",
//     dimensions: "320 x 220 x 180 cm",
//     price: "110.000 AOA",
//     pickupDate: "27/03/2023",
//     deliveryDate: "29/03/2023",
//     status: "available",
//     clientRating: 4.7,
//     clientName: "Móveis Elegantes S.A.",
//     description: "Conjunto de móveis para escritório. Requer cuidado no manuseio e proteção contra chuva.",
//   },
//   {
//     id: "FR-005",
//     origin: "Malanje",
//     originProvince: "Malanje",
//     destination: "Luena",
//     destinationProvince: "Moxico",
//     distance: "680 km",
//     cargoType: "Carga Geral",
//     weight: "1800 kg",
//     dimensions: "350 x 230 x 170 cm",
//     price: "160.000 AOA",
//     pickupDate: "29/03/2023",
//     deliveryDate: "31/03/2023",
//     status: "available",
//     clientRating: 4.6,
//     clientName: "Distribuidora Oriental",
//     description: "Materiais de construção diversos. Carga não perecível.",
//   },
// ]

// export default function FindFreightPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedOrigin, setSelectedOrigin] = useState("")
//   const [selectedDestination, setSelectedDestination] = useState("")
//   const [selectedCargoType, setSelectedCargoType] = useState("")
//   const [minWeight, setMinWeight] = useState(0)
//   const [maxWeight, setMaxWeight] = useState(5000)
//   const [onlyVerifiedClients, setOnlyVerifiedClients] = useState(false)
//   const [filteredFreights, setFilteredFreights] = useState(mockFreights)
//   const [selectedFreight, setSelectedFreight] = useState<null | (typeof mockFreights)[0]>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const { user } = useAuth()
//   const { toast } = useToast()


//   useEffect(() => {
//       const fetchFreights = async () => {
//         try {
//           console.log(user.id)
//           const res = await FreightRequestService.findAvailable()
  
//           //if (!res.ok) throw new Error("Erro ao buscar fretes")
//           console.log(res);
//           setFilteredFreights(res)
//         } catch (err) {
//           console.error(err)
//         } finally {
//           setIsLoading(false)
//         }
//       }
  
//       if (user) fetchFreights()
//     }, [user])
  
//   const handleSearch = () => {
//     // Lógica de filtragem
//     const filtered = mockFreights.filter((freight) => {
//       // Filtro por termo de busca
//       if (
//         searchTerm &&
//         !freight.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         !freight.origin.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         !freight.destination.toLowerCase().includes(searchTerm.toLowerCase())
//       ) {
//         return false
//       }

//       // Filtro por origem
//       if (selectedOrigin && freight.originProvince !== selectedOrigin) {
//         return false
//       }

//       // Filtro por destino
//       if (selectedDestination && freight.destinationProvince !== selectedDestination) {
//         return false
//       }

//       // Filtro por tipo de carga
//       if (selectedCargoType && freight.cargoType !== selectedCargoType) {
//         return false
//       }

//       // Filtro por peso
//       const freightWeight = Number.parseInt(freight.weight.replace(/\D/g, ""))
//       if (freightWeight < minWeight || freightWeight > maxWeight) {
//         return false
//       }

//       // Filtro por clientes verificados
//       if (onlyVerifiedClients && freight.clientRating < 4.5) {
//         return false
//       }

//       return true
//     })

//     setFilteredFreights(filtered)
//   }

//   const handleFreightSelect = (freight: (typeof mockFreights)[0]) => {
//     setSelectedFreight(freight)
//   }


//   async function handleApply() {

//         try {
  
//         // Envia a solicitação de frete para o Supabase com motivo
//         await FreightRequestService.accept(selectedFreight.id);

//         alert(`Proposta enviada para o frete ${selectedFreight?.id}. O cliente será notificado.`)
  
//         router.push("/services/transporter/my-freights");

//       } catch (error) {
        
//         toast({
//           title: "Erro ao aceitar",
//           description: "Ocorreu um erro ao cancelar o seu pedido. Por favor, tente novamente.",
//           variant: "destructive",
//         });
//       }
//     }

//   return (
//     <div className="container mx-auto py-10 px-4">
//       <div className="mb-8">
//         <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Voltar para a página inicial
//         </Link>
//         <h1 className="text-2xl font-bold mt-4">Encontrar Fretes</h1>
//         <p className="text-muted-foreground">Encontre oportunidades de frete disponíveis para sua frota</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Filtros */}
//         <div className="lg:col-span-1">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Filter className="h-5 w-5 text-primary" />
//                 Filtros
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Buscar</label>
//                 <div className="flex gap-2">
//                   <Input
//                     placeholder="ID, origem ou destino"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   <Button onClick={handleSearch} size="icon">
//                     <Search className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Origem</label>
//                 <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Selecione a província" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todas</SelectItem>
//                     <SelectItem value="Luanda">Luanda</SelectItem>
//                     <SelectItem value="Benguela">Benguela</SelectItem>
//                     <SelectItem value="Huambo">Huambo</SelectItem>
//                     <SelectItem value="Cabinda">Cabinda</SelectItem>
//                     <SelectItem value="Huíla">Huíla</SelectItem>
//                     <SelectItem value="Malanje">Malanje</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Destino</label>
//                 <Select value={selectedDestination} onValueChange={setSelectedDestination}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Selecione a província" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todas</SelectItem>
//                     <SelectItem value="Luanda">Luanda</SelectItem>
//                     <SelectItem value="Benguela">Benguela</SelectItem>
//                     <SelectItem value="Huambo">Huambo</SelectItem>
//                     <SelectItem value="Huíla">Huíla</SelectItem>
//                     <SelectItem value="Moxico">Moxico</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Tipo de Carga</label>
//                 <Select value={selectedCargoType} onValueChange={setSelectedCargoType}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Selecione o tipo" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todos</SelectItem>
//                     <SelectItem value="Carga Geral">Carga Geral</SelectItem>
//                     <SelectItem value="Perecíveis">Perecíveis</SelectItem>
//                     <SelectItem value="Máquinas e Equipamentos">Máquinas e Equipamentos</SelectItem>
//                     <SelectItem value="Móveis">Móveis</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <label className="text-sm font-medium">Peso da Carga</label>
//                   <span className="text-xs text-muted-foreground">
//                     {minWeight} - {maxWeight} kg
//                   </span>
//                 </div>
//                 <Slider
//                   defaultValue={[minWeight, maxWeight]}
//                   max={5000}
//                   step={100}
//                   onValueChange={(values) => {
//                     setMinWeight(values[0])
//                     setMaxWeight(values[1])
//                   }}
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Switch id="verified-clients" checked={onlyVerifiedClients} onCheckedChange={setOnlyVerifiedClients} />
//                 <label htmlFor="verified-clients" className="text-sm font-medium">
//                   Apenas clientes verificados
//                 </label>
//               </div>

//               <Button onClick={handleSearch} className="w-full">
//                 Aplicar Filtros
//               </Button>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Lista de Fretes */}
//         <div className="lg:col-span-2">
//           {selectedFreight ? (
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle className="flex items-center gap-2">
//                       <Package className="h-5 w-5 text-primary" />
//                       Detalhes do Frete {selectedFreight.id}
//                     </CardTitle>
//                     <CardDescription>
//                       {selectedFreight.origin} → {selectedFreight.destination}
//                     </CardDescription>
//                   </div>
//                   <Button variant="ghost" size="sm" onClick={() => setSelectedFreight(null)}>
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Voltar
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <h3 className="text-sm font-medium mb-2">Origem</h3>
//                     <div className="flex items-start gap-2">
//                       <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
//                       <div>
//                         <p className="font-medium">{selectedFreight.origin}</p>
//                         <p className="text-sm text-muted-foreground">{selectedFreight.originProvince}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-medium mb-2">Destino</h3>
//                     <div className="flex items-start gap-2">
//                       <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
//                       <div>
//                         <p className="font-medium">{selectedFreight.destination}</p>
//                         <p className="text-sm text-muted-foreground">{selectedFreight.destinationProvince}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div>
//                     <p className="text-xs text-muted-foreground">Tipo de Carga</p>
//                     <p className="font-medium">{selectedFreight.cargoType}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Peso</p>
//                     <p className="font-medium">{selectedFreight.weight}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Dimensões</p>
//                     <p className="font-medium">{selectedFreight.dimensions}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Distância</p>
//                     <p className="font-medium">{selectedFreight.distance}</p>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <p className="text-xs text-muted-foreground">Data de Coleta</p>
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4 text-muted-foreground" />
//                       <p className="font-medium">{selectedFreight.pickupDate}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Data de Entrega</p>
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4 text-muted-foreground" />
//                       <p className="font-medium">{selectedFreight.deliveryDate}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Valor Oferecido</p>
//                     <p className="font-medium text-green-600">{selectedFreight.price}</p>
//                   </div>
//                 </div>

//                 <div className="bg-muted p-4 rounded-lg">
//                   <h3 className="font-medium mb-2">Descrição da Carga</h3>
//                   <p className="text-sm">{selectedFreight.description}</p>
//                 </div>

//                 <div className="bg-muted p-4 rounded-lg">
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="font-medium">Informações do Cliente</h3>
//                     <div className="flex items-center gap-1">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span className="font-medium">{selectedFreight.clientRating}</span>
//                     </div>
//                   </div>
//                   <p className="text-sm">{selectedFreight.clientName}</p>
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-between">
//                 <Button variant="outline" onClick={() => setSelectedFreight(null)}>
//                   Voltar
//                 </Button>
//                 <Button onClick={handleApply}>Candidatar-se a este Frete</Button>
//               </CardFooter>
//             </Card>
//           ) : (
//             <>
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Fretes Disponíveis ({filteredFreights.length})</h2>
//                 <Tabs defaultValue="all" className="w-[400px]">
//                   <TabsList>
//                     <TabsTrigger value="all">Todos</TabsTrigger>
//                     <TabsTrigger value="nearby">Próximos</TabsTrigger>
//                     <TabsTrigger value="recommended">Recomendados</TabsTrigger>
//                   </TabsList>
//                 </Tabs>
//               </div>

//               {filteredFreights.length === 0 ? (
//                 <Card>
//                   <CardContent className="flex flex-col items-center justify-center py-12">
//                     <Package className="h-12 w-12 text-muted-foreground mb-4" />
//                     <h3 className="text-xl font-medium mb-2">Nenhum frete encontrado</h3>
//                     <p className="text-muted-foreground text-center max-w-md mb-6">
//                       Não encontramos fretes que correspondam aos seus filtros. Tente ajustar os critérios de busca.
//                     </p>
//                     <Button
//                       onClick={() => {
//                         setSearchTerm("")
//                         setSelectedOrigin("")
//                         setSelectedDestination("")
//                         setSelectedCargoType("")
//                         setMinWeight(0)
//                         setMaxWeight(5000)
//                         setOnlyVerifiedClients(false)
//                         setFilteredFreights(mockFreights)
//                       }}
//                     >
//                       Limpar Filtros
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <div className="space-y-4">
//                   {filteredFreights.map((freight) => (
//                     <Card
//                       key={freight.id}
//                       className="hover:shadow-md transition-shadow cursor-pointer"
//                       onClick={() => handleFreightSelect(freight)}
//                     >
//                       <CardContent className="p-6">
//                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between mb-2">
//                               <h3 className="font-bold text-lg flex items-center gap-2">
//                                 <Package className="h-5 w-5 text-primary" />
//                                 {freight.id}
//                               </h3>
//                               <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                                 {freight.price}
//                               </Badge>
//                             </div>
//                             <div className="flex items-center gap-2 mb-4">
//                               <div className="flex items-center gap-1 text-sm">
//                                 <MapPin className="h-4 w-4 text-muted-foreground" />
//                                 <span>{freight.origin}</span>
//                               </div>
//                               <ArrowRight className="h-4 w-4 text-muted-foreground" />
//                               <div className="flex items-center gap-1 text-sm">
//                                 <MapPin className="h-4 w-4 text-muted-foreground" />
//                                 <span>{freight.destination}</span>
//                               </div>
//                               <span className="text-xs text-muted-foreground">({freight.distance})</span>
//                             </div>
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                               <div className="flex items-center gap-1">
//                                 <Weight className="h-4 w-4 text-muted-foreground" />
//                                 <span>{freight.weight}</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Package className="h-4 w-4 text-muted-foreground" />
//                                 <span>{freight.cargoType}</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Calendar className="h-4 w-4 text-muted-foreground" />
//                                 <span>Coleta: {freight.pickupDate}</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Star className="h-4 w-4 text-yellow-400" />
//                                 <span>{freight.clientRating}</span>
//                               </div>
//                             </div>
//                           </div>
//                           <Button className="md:self-center">Ver Detalhes</Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
