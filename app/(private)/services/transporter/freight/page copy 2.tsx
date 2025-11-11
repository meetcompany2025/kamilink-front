// "use client"

// import { useState, useRef } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { useForm } from "react-hook-form"
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Separator } from "@/components/ui/separator"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
// import {
//   ArrowLeft,
//   MapPin,
//   Package,
//   Truck,
//   Calendar,
//   Upload,
//   Trash2,
//   CheckCircle,
//   FileText,
// } from "lucide-react"
// import LocationPicker from "@/components/LocationPicker"
// import MapView from "@/components/MapView"

// interface FreightFormValues {
//   originAddress: string
//   originCity: string
//   originState: string
//   destinationAddress: string
//   destinationCity: string
//   destinationState: string
//   cargoType: string
//   weight: number
//   quantity: number
//   length: number
//   width: number
//   height: number
//   description: string
//   pickupDate: string
//   deliveryDate: string
//   requiresLoadingHelp: boolean
//   requiresUnloadingHelp: boolean
//   hasInsurance: boolean
//   paymentMethod: string
// }

// export default function FreightRequestPage() {
//   const [currentStep, setCurrentStep] = useState(1)
//   const [activeTab, setActiveTab] = useState<"map" | "manual">("map")
//   const [mapError, setMapError] = useState(false)
//   const [originLocation, setOriginLocation] = useState<any>(null)
//   const [destinationLocation, setDestinationLocation] = useState<any>(null)
//   const [routeInfo, setRouteInfo] = useState<any>(null)
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
//   const [isUploading, setIsUploading] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [freightReference, setFreightReference] = useState("")

//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const form = useForm<FreightFormValues>({
//     defaultValues: {
//       originAddress: "",
//       originCity: "",
//       originState: "",
//       destinationAddress: "",
//       destinationCity: "",
//       destinationState: "",
//       cargoType: "",
//       weight: 0,
//       quantity: 0,
//       length: 0,
//       width: 0,
//       height: 0,
//       description: "",
//       pickupDate: "",
//       deliveryDate: "",
//       requiresLoadingHelp: false,
//       requiresUnloadingHelp: false,
//       hasInsurance: false,
//       paymentMethod: "",
//     },
//   })

//   const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
//   const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

//   const handleOriginSelect = (location: any) => setOriginLocation(location)
//   const handleDestinationSelect = (location: any) => setDestinationLocation(location)
//   const handleMapError = () => setMapError(true)

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files
//     if (!files) return

//     setIsUploading(true)
//     const newFiles = Array.from(files)
//     setUploadedFiles((prev) => [...prev, ...newFiles])
//     setUploadProgress(100)
//     setTimeout(() => setIsUploading(false), 500)
//   }

//   const removeFile = (index: number) => {
//     setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
//   }

//   const onSubmit = (data: FreightFormValues) => {
//     setIsSubmitting(true)
//     setTimeout(() => {
//       setFreightReference("FR-" + Math.floor(Math.random() * 1000000))
//       setCurrentStep(4)
//       setIsSubmitting(false)
//     }, 1000)
//   }

//   return (
//     <div className="container max-w-3xl mx-auto py-10 px-4">
//       <div className="mb-8">
//         <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Voltar para a página inicial
//         </Link>
//         <h1 className="text-2xl font-bold mt-4">Solicitar Frete</h1>
//         <p className="text-muted-foreground">Preencha os dados para solicitar um orçamento de frete</p>
//       </div>

//       {currentStep < 4 && (
//         <div className="mb-8">
//           <div className="flex justify-between">
//             <div className="flex flex-col items-center">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
//               >
//                 <MapPin className="h-5 w-5" />
//               </div>
//               <span className="text-xs mt-2">Endereços</span>
//             </div>
//             <div className="flex-1 flex items-center mx-2">
//               <div className={`h-1 w-full ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
//             </div>
//             <div className="flex flex-col items-center">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
//               >
//                 <Package className="h-5 w-5" />
//               </div>
//               <span className="text-xs mt-2">Carga</span>
//             </div>
//             <div className="flex-1 flex items-center mx-2">
//               <div className={`h-1 w-full ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
//             </div>
//             <div className="flex flex-col items-center">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
//               >
//                 <Truck className="h-5 w-5" />
//               </div>
//               <span className="text-xs mt-2">Finalizar</span>
//             </div>
//           </div>
//         </div>
//       )}

//       <Form {...form}>
//         <form className="space-y-6">
//           {currentStep === 1 && (
//             <div className="space-y-6">
//               {mapError && (
//                 <Alert variant="warning" className="mb-4">
//                   <AlertTitle>Mapa indisponível</AlertTitle>
//                   <AlertDescription>
//                     O serviço de mapas está temporariamente indisponível. Por favor, use o método manual para inserir os
//                     endereços.
//                   </AlertDescription>
//                 </Alert>
//               )}

//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-2">
//                   <TabsTrigger value="map" disabled={mapError}>
//                     Selecionar no Mapa
//                   </TabsTrigger>
//                   <TabsTrigger value="manual">Inserir Manualmente</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="map" className="space-y-6 mt-4">
//                   <LocationPicker
//                     title="Selecione o Local de Origem"
//                     onLocationSelect={handleOriginSelect}
//                     initialLocation={originLocation || undefined}
//                     onMapError={handleMapError}
//                   />
//                   <LocationPicker
//                     title="Selecione o Local de Destino"
//                     onLocationSelect={handleDestinationSelect}
//                     initialLocation={destinationLocation || undefined}
//                     onMapError={handleMapError}
//                   />
//                   {originLocation && destinationLocation && !mapError && (
//                     <Card>
//                       <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                           <Truck className="h-5 w-5 text-primary" />
//                           Rota
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <MapView
//                           locations={[originLocation, destinationLocation]}
//                           showRoute={true}
//                           height="300px"
//                           onMapError={handleMapError}
//                         />
//                         {routeInfo && (
//                           <div className="mt-4 grid grid-cols-2 gap-4">
//                             <div className="bg-muted p-3 rounded-md">
//                               <p className="text-sm font-medium">Distância Estimada</p>
//                               <p className="text-xl font-bold">{routeInfo.distance} km</p>
//                             </div>
//                             <div className="bg-muted p-3 rounded-md">
//                               <p className="text-sm font-medium">Tempo Estimado</p>
//                               <p className="text-xl font-bold">{routeInfo.time} horas</p>
//                             </div>
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>
//                   )}
//                 </TabsContent>

//                 <TabsContent value="manual" className="space-y-6 mt-4">
//                   {/* Conteúdo manual completo que forneci no passo anterior */}
//                   {/* ... código do TabsContent "manual" que você já tem ... */}
//                 </TabsContent>
//               </Tabs>
//             </div>
//           )}

//           {/* Steps 2, 3 e 4 seguem aqui exatamente como seu código original... */}
//           {/* Mantém Cards, Upload, Serviços adicionais, Resumo, Confirmação, Botões */}

//           {currentStep < 4 && (
//             <div className="flex justify-between mt-8">
//               {currentStep > 1 ? (
//                 <Button type="button" variant="outline" onClick={prevStep}>
//                   Voltar
//                 </Button>
//               ) : (
//                 <div></div>
//               )}
//               {currentStep < 3 ? (
//                 <Button type="button" onClick={nextStep}>
//                   Próximo
//                 </Button>
//               ) : (
//                 <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
//                   {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
//                 </Button>
//               )}
//             </div>
//           )}
//         </form>
//       </Form>
//     </div>
//   )
// }
