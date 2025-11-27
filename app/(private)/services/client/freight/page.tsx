"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from 'next/navigation'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  FileText,
  MapPin,
  Package,
  Trash2,
  Truck,
  Upload,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Progress } from "@/components/ui/progress"
//import { uploadFile, validateFile, type FileUploadResult } from "@/lib/supabase/storage"
import { FreightRequestService } from "@/services/freightRequestService"
import { useAuth } from "@/components/auth-provider"
import { LocationPicker } from "@/components/map/location-picker"
import { MapView, type MapLocation } from "@/components/map/map-view"
import { calculateDistance, estimateTravelTime, getRouteInfo } from "@/lib/geo-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PriceEstimate } from "@/components/price-estimate"
import { formatPrice } from "@/lib/price-calculator"
import { useToast } from "@/components/ui/use-toast"
import { GoogleMapsProvider } from "@/components/google-maps-provider"

const formSchema = z.object({
  origin: z.string().min(5, {
    message: "Endereço de origem deve ter pelo menos 5 caracteres.",
  }),
  originState: z.string().min(2, {
    message: "Estado de origem é obrigatório.",
  }),
  destination: z.string().min(5, {
    message: "Endereço de destino deve ter pelo menos 5 caracteres.",
  }),
  destinationState: z.string().min(2, {
    message: "Estado de destino é obrigatório.",
  }),
  cargoType: z.string().min(1, {
    message: "Tipo de carga é obrigatório.",
  }),
  weightKg: z.string().min(1, {
    message: "Peso é obrigatório.",
  }),
  lengthCm: z.string().optional(),
  widthCm: z.string().optional(),
  heightCm: z.string().optional(),
  quantity: z.string().min(1, {
    message: "Quantidade é obrigatória.",
  }),
  description: z.string().optional(),
  pickupDate: z.string().min(1, {
    message: "Data de coleta é obrigatória.",
  }),
  deliveryDate: z.string().min(1, {
    message: "Data de entrega é obrigatória.",
  }),
  requiresLoadingHelp: z.boolean(),
  requiresUnloadingHelp: z.boolean(),
  hasInsurance: z.boolean(),
  paymentMethod: z.enum(["Cartão Multicaixa", "Multicaixa Express", "Transferência Bancária"]),
})

export default function FreightRequestPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [originLocation, setOriginLocation] = useState<MapLocation | null>(null)
  const [destinationLocation, setDestinationLocation] = useState<MapLocation | null>(null)
  const [routeInfo, setRouteInfo] = useState<{ distance: number; time: number } | null>(null)
  const [mapError, setMapError] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("map")
  const [freightReference, setFreightReference] = useState("")
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()


  const openFileSelector = () => {
    fileInputRef.current?.click()
  }

  // Manipular a seleção de arquivos
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const fileList = Array.from(files);
  setSelectedFiles((prev) => [...prev, ...fileList]); // mostra logo na UI
  uploadFiles(fileList);
};

// Enviar os arquivos para a API
const uploadFiles = async (files: File[]) => {
  setIsUploading(true);
  setUploadProgress(0);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // ✅ APENAS adicionar à lista - upload será feito APÓS criar frete
    setUploadedFiles((prev) => [...prev, file]);
    
    // Simular progresso (opcional)
    setUploadProgress(((i + 1) / files.length) * 100);
  }

  setIsUploading(false);
  setUploadProgress(0);
};

// Remover um arquivo
const removeFile = (index: number) => {
  const updated = [...uploadedFiles];
  updated.splice(index, 1);
  setUploadedFiles(updated);
};

  // Quando ocorrer um erro no mapa, mudar para a aba manual
  useEffect(() => {
    if (mapError) {
      setActiveTab("manual")
    }
  }, [mapError])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      originState: "",
      destination: "",
      destinationState: "",
      cargoType: "",
      weightKg: "",
      lengthCm: "0",
      widthCm: "0",
      heightCm: "0",
      quantity: "1",
      description: "",
      pickupDate: "",
      deliveryDate: "",
      requiresLoadingHelp: false,
      requiresUnloadingHelp: false,
      hasInsurance: false,
      paymentMethod: "Cartão Multicaixa",
    },
  })

  // Atualizar informações da rota quando origem e destino forem selecionados

  // -------

  const updateRouteInfo = () => {
  console.log("🔍 updateRouteInfo() executada!");
  console.log("📍 Origem:", originLocation);
  console.log("📍 Destino:", destinationLocation);

  if (originLocation && destinationLocation) {
    const distance = calculateDistance(
      Number(originLocation.latitude),
      Number(originLocation.longitude),
      Number(destinationLocation.latitude),
      Number(destinationLocation.longitude)
    );
    const time = estimateTravelTime(distance);
    

    console.log("✅ Distância calculada:", distance);
    console.log("✅ Tempo estimado:", time);

    setRouteInfo({ distance, time });
  } else {
    console.warn("⚠️ Localização incompleta, routeInfo será null");
    setRouteInfo(null);
  }
};

  // const updateRouteInfo = () => {
  //   console.log('Estão inteiros, certo?');
  //   if (originLocation && destinationLocation) {
  //     const distance = calculateDistance(
  //       originLocation.latitude,
  //       originLocation.longitude,
  //       destinationLocation.latitude,
  //       destinationLocation.longitude,
  //     )
  //     const time = estimateTravelTime(distance)
  //     setRouteInfo({ distance, time })
  //   } else {
  //     setRouteInfo(null)
  //   }
  // }

    // const updateRouteInfo = async () => {
    //   console.log("Chegou nas rotas");
    //   console.log(originLocation)
    //   console.log(destinationLocation)

    //   if (originLocation && destinationLocation) {
    //     const info = await getRouteInfo(
    //     {lat:originLocation.latitude,
    //     lng: originLocation.longitude},
    //     {lat:destinationLocation.latitude,
    //     lng:destinationLocation.longitude},)
    //     console.log("Rotas: ", info)
    //     setRouteInfo(info)
    //   } else {
    //     setRouteInfo(null)
    //   }
    // }

  // Manipuladores para seleção de localização
  const handleOriginSelect = (location: MapLocation) => {
    setOriginLocation({ ...location, isOrigin: true })

    // Extrair cidade e estado do nome do local (em uma implementação real, isso seria mais preciso)
    const parts = location.name?.split(",") || []
    if (parts.length >= 2) {
      form.setValue("originState", parts[1].trim())
    }

    form.setValue("origin", location.name || "")

    // updateRouteInfo()
  }

  
  const handleDestinationSelect = (location: MapLocation) => {
    setDestinationLocation({ ...location, isDestination: true })

    // Extrair cidade e estado do nome do local
    const parts = location.name?.split(",") || []
    if (parts.length >= 2) {
      form.setValue("destinationState", parts[1].trim())
    }

    form.setValue("destination", location.name || "")

    updateRouteInfo()
  }
  
  const handleMapError = () => {
    setMapError(true)
    toast({
      title: "Erro no mapa",
      description: "Não foi possível carregar o mapa. Por favor, use o método manual para inserir endereços.",
      variant: "destructive",
    })
  }


  const nextStep = () => {

    if (currentStep === 1 && activeTab === "map") {
      form.trigger([
        "origin",
        "originState",
        "destination",
        "destinationState",
      ])

      setActiveTab("manual")

      window.scrollTo(0, 0)

    }else if (currentStep === 1 && activeTab === "manual") {

      form.trigger([
        "origin",
        "originState",
        "destination",
        "destinationState",
      ])

      const originErrors =
        form.formState.errors.origin || form.formState.errors.originState

      const destinationErrors =
        form.formState.errors.destination ||
        form.formState.errors.destinationState

      if (!originErrors && !destinationErrors) {
        setCurrentStep(2)
        window.scrollTo(0, 0)
      }
    } else if (currentStep === 2) {
      form.trigger(["cargoType", "weightKg", "quantity", "pickupDate", "deliveryDate"])

      const cargoErrors =
        form.formState.errors.cargoType || form.formState.errors.weightKg || form.formState.errors.quantity

      const dateErrors = form.formState.errors.pickupDate || form.formState.errors.deliveryDate

      console.log(cargoErrors, " ", dateErrors);

      if (!cargoErrors && !dateErrors) {
        setCurrentStep(3)
        window.scrollTo(0, 0)
      }
    } 
    else if (currentStep === 3) {
      setCurrentStep(4)
      window.scrollTo(0, 0)   
    } 
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para solicitar um frete.",
        variant: "destructive",
      })
      return
    }

    // console.log("CHEGOU");
    setIsSubmitting(true)
    // console.log("Valores do formulário:", routeInfo);

    try {
      // alert('Cliquei')
      // console.log('Cliquei em fretes')
      const generatedReference = `KL-${Math.floor(Math.random() * 1000000)}`;
      setFreightReference(generatedReference)

      // 1️⃣ Calcular rota na hora
        const distance = calculateDistance(
            originLocation.latitude,
            originLocation.longitude,
            destinationLocation.latitude,
            destinationLocation.longitude
          )
        const time = estimateTravelTime(distance)
        console.log("Valor da referência" + freightReference);
      
      // Adiciona os arquivos enviados e coordenadas aos dados do frete
      const freightData = {
        ...values,
        id: generatedReference,
        attachments: "" /*uploadedFiles.map((file) => file.url)*/,
        originCoordinates: originLocation ? `${originLocation.latitude},${originLocation.longitude}` : "",
        destinationCoordinates: destinationLocation
          ? `${destinationLocation.latitude},${destinationLocation.longitude}`: "",
        estimatedDistance: distance,
        estimatedTime: time,
        price: estimatedPrice
      }

      console.log(freightData)

      // Envia a solicitação de frete para o Supabase
      const createdFreight = await FreightRequestService.create(freightData);

       // ✅ 4️⃣ NOVO: Upload da imagem do frete (se houver)
    if (uploadedFiles.length > 0) {
      console.log("📸 Fazendo upload da imagem do frete...");
      
      // Para cada arquivo enviado, fazer upload vinculado ao frete
      for (const file of uploadedFiles) {
        try {
          await FreightRequestService.uploadFreightImage(createdFreight.id, file);
          console.log(`✅ Imagem ${file.name} enviada para o frete ${createdFreight.id}`);
        } catch (uploadError) {
          console.error(`❌ Erro ao enviar imagem ${file.name}:`, uploadError);
          // Continuar mesmo se uma imagem falhar
        }
      }
    }

      // Avança para a etapa de confirmação
      setCurrentStep(5)
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error)
      toast({
        title: "Erro ao enviar solicitação",
        description: "Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /*
  // Função para lidar com o upload de arquivos
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Processa cada arquivo selecionado
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Valida o arquivo
        const validation = validateFile(file)
        if (!validation.valid) {
          toast({
            title: "Arquivo inválido",
            description: validation.message,
            variant: "destructive",
          })
          continue
        }

        // Atualiza o progresso
        setUploadProgress(Math.round((i / files.length) * 50))

        // Faz o upload do arquivo
        const result = await uploadFile(file)

        // Atualiza o progresso
        setUploadProgress(Math.round((i / files.length) * 100))

        // Adiciona o arquivo à lista de arquivos enviados
        setUploadedFiles((prev) => [...prev, result])
      }

      toast({
        title: "Upload concluído",
        description: `${files.length} arquivo(s) enviado(s) com sucesso.`,
      })
    } catch (error) {
      console.error("Erro no upload:", error)
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao enviar os arquivos. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)

      // Limpa o input de arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Função para remover um arquivo enviado
  const removeFile = async (index: number) => {
    try {
      const fileToRemove = uploadedFiles[index]

      // Remove o arquivo do Supabase Storage
      // Nota: Estamos extraindo apenas o caminho do arquivo da URL completa
      const path = fileToRemove.path

      // Atualiza a lista de arquivos enviados
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index))

      toast({
        title: "Arquivo removido",
        description: "O arquivo foi removido com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao remover arquivo:", error)
      toast({
        title: "Erro ao remover arquivo",
        description: "Ocorreu um erro ao remover o arquivo. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função para abrir o seletor de arquivos
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Função para renderizar a prévia do arquivo
  const renderFilePreview = (file: FileUploadResult) => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative w-16 h-16 rounded overflow-hidden">
          <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
        </div>
      )
    } else if (file.type === "application/pdf") {
      return (
        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
      )
    } else {
      return (
        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
      )
    }
  }*/

  return (
  <GoogleMapsProvider>
    
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
        <h1 className="text-2xl font-bold mt-4">Solicitar Frete</h1>
        <p className="text-muted-foreground">Preencha os dados para solicitar um orçamento de frete</p>
      </div>

      {currentStep < 4 && (
        <div className="mb-8">
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xs mt-2">Endereços</span>
            </div>
            <div className="flex-1 flex items-center mx-2">
              <div className={`h-1 w-full ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                <Package className="h-5 w-5" />
              </div>
              <span className="text-xs mt-2">Carga</span>
            </div>
            <div className="flex-1 flex items-center mx-2">
              <div className={`h-1 w-full ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-xs mt-2">Finalizar</span>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              {mapError && (
                <Alert variant="warning" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Mapa indisponível</AlertTitle>
                  <AlertDescription>
                    O serviço de mapas está temporariamente indisponível. Por favor, use o método manual para inserir os
                    endereços.
                  </AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="map" disabled={mapError}>
                    Selecionar no Mapa
                  </TabsTrigger>
                  <TabsTrigger value="manual">Inserir Manualmente</TabsTrigger>
                </TabsList>

                <TabsContent value="map" className="space-y-6 mt-4">
                  <LocationPicker
                    title="Selecione o Local de Origem"
                    onLocationSelect={handleOriginSelect}
                    initialLocation={originLocation || undefined}
                    onMapError={handleMapError}
                  />

                  <LocationPicker
                    title="Selecione o Local de Destino"
                    onLocationSelect={handleDestinationSelect}
                    initialLocation={destinationLocation || undefined}
                    onMapError={handleMapError}
                  />

                  {originLocation && destinationLocation && !mapError && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary" />
                          Rota
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <MapView
                          locations={[originLocation, destinationLocation]}
                          showRoute={true}
                          height="300px"
                          onMapError={handleMapError}
                        />

                        {routeInfo && (
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-muted p-3 rounded-md">
                              <p className="text-sm font-medium">Distância Estimada</p>
                              <p className="text-xl font-bold">{routeInfo.distance} km</p>
                            </div>
                            <div className="bg-muted p-3 rounded-md">
                              <p className="text-sm font-medium">Tempo Estimado</p>
                              <p className="text-xl font-bold">{routeInfo.time} horas</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="manual" className="space-y-6 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Endereço de Origem
                      </CardTitle>
                      <CardDescription>Informe o local de coleta da carga</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input placeholder="Rua, número, complemento" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="originState"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Provincia</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Bengo">Bengo</SelectItem>
                                    <SelectItem value="Benguela">Benguela</SelectItem>
                                    <SelectItem value="Bié">Bié</SelectItem>
                                    <SelectItem value="Cabinda">Cabinda</SelectItem>
                                    <SelectItem value="Cuando Cubango">Cuando Cubango</SelectItem>
                                    <SelectItem value="Kwanza Norte">Kwanza Norte</SelectItem>
                                    <SelectItem value="Kwanza Sul">Kwanza Sul</SelectItem>
                                    <SelectItem value="Cunene">Cunene</SelectItem>
                                    <SelectItem value="Huambo">Huambo</SelectItem>
                                    <SelectItem value="Huíla">Huíla</SelectItem>
                                    <SelectItem value="Luanda">Luanda</SelectItem>
                                    <SelectItem value="Lunda Nprte">Lunda Norte</SelectItem>
                                    <SelectItem value="Lunda Sul">Lunda Sul</SelectItem>
                                    <SelectItem value="Malanje">Malanje</SelectItem>
                                    <SelectItem value="Moxico">Moxico</SelectItem>
                                    <SelectItem value="Namibe">Namibe</SelectItem>
                                    <SelectItem value="Uíge">Uíge</SelectItem>
                                    <SelectItem value="Zaire">Zaire</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Endereço de Destino
                      </CardTitle>
                      <CardDescription>Informe o local de entrega da carga</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input placeholder="Rua, número, complemento" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="destinationState"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Província</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Bengo">Bengo</SelectItem>
                                    <SelectItem value="Benguela">Benguela</SelectItem>
                                    <SelectItem value="Bié">Bié</SelectItem>
                                    <SelectItem value="Cabinda">Cabinda</SelectItem>
                                    <SelectItem value="Cuando Cubango">Cuando Cubango</SelectItem>
                                    <SelectItem value="Kwanza Norte">Kwanza Norte</SelectItem>
                                    <SelectItem value="Kwanza Sul">Kwanza Sul</SelectItem>
                                    <SelectItem value="Cunene">Cunene</SelectItem>
                                    <SelectItem value="Huambo">Huambo</SelectItem>
                                    <SelectItem value="Huíla">Huíla</SelectItem>
                                    <SelectItem value="Luanda">Luanda</SelectItem>
                                    <SelectItem value="Lunda Nprte">Lunda Norte</SelectItem>
                                    <SelectItem value="Lunda Sul">Lunda Sul</SelectItem>
                                    <SelectItem value="Malanje">Malanje</SelectItem>
                                    <SelectItem value="Moxico">Moxico</SelectItem>
                                    <SelectItem value="Namibe">Namibe</SelectItem>
                                    <SelectItem value="Uíge">Uíge</SelectItem>
                                    <SelectItem value="Zaire">Zaire</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Informações da Carga
                  </CardTitle>
                  <CardDescription>Informe os detalhes da carga a ser transportada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cargoType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Carga</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de carga" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Carga Geral">Carga Geral</SelectItem>
                              <SelectItem value="Carga Frágil">Carga Frágil</SelectItem>
                              <SelectItem value="Perecíveis">Perecíveis</SelectItem>
                              <SelectItem value="Produtos Perigosos">Produtos Perigosos</SelectItem>
                              <SelectItem value="Veículos">Veículos</SelectItem>
                              <SelectItem value="Maquínas e Equipamentos">Máquinas e Equipamentos</SelectItem>
                              <SelectItem value="Móveis">Móveis</SelectItem>
                              <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="weightKg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peso (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Ex: 500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Ex: 10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="lengthCm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comprimento (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Ex: 100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="widthCm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Largura (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Ex: 50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="heightCm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Altura (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Ex: 30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição da Carga</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva detalhes adicionais sobre a carga"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-2">Fotos da Carga</label>

    {/* Input de arquivo oculto */}
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileUpload}
      className="hidden"
      multiple
      accept="image/jpeg,image/png,image/webp,application/pdf"
    />

    {/* Área de upload */}
    <div
      className="flex items-center justify-center p-4 border-2 border-dashed rounded-md border-muted-foreground/20 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="flex flex-col items-center gap-2">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">Arraste fotos da carga ou clique para fazer upload</p>
        <p className="text-xs text-muted-foreground">Suporta JPG, PNG ou PDF (máx. 10MB)</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
        >
          Selecionar Arquivos
        </Button>
      </div>
    </div>

    {/* Barra de progresso */}
    {isUploading && (
      <div className="mt-4">
        <p className="text-sm mb-1">Enviando arquivos...</p>
        <Progress value={uploadProgress} className="h-2" />
      </div>
    )}

    {/* Lista de arquivos enviados */}
    {uploadedFiles.length > 0 && (
      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium">Arquivos enviados ({uploadedFiles.length})</p>
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div className="flex items-center gap-3">
                {/* renderFilePreview(file) se necessário */}
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
      </div>

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Datas e Serviços Adicionais
                  </CardTitle>
                  <CardDescription>Informe as datas de coleta e entrega e serviços adicionais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pickupDate"
                      render={({ field }) => {
                        const formattedDate = field.value
                          ? new Date(field.value).toLocaleDateString("pt-AO")
                          : "";

                        return (
                          <FormItem>
                            <FormLabel>Data de Coleta</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            {formattedDate && (
                              <p className="text-sm text-gray-500 mt-1">
                                Selecionado: {formattedDate}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryDate"
                      render={({ field }) => {
                        const formattedDate = field.value
                          ? new Date(field.value).toLocaleDateString("pt-AO")
                          : "";

                        return (
                          <FormItem>
                            <FormLabel>Data de Entrega</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            {formattedDate && (
                              <p className="text-sm text-gray-500 mt-1">
                                Selecionado: {formattedDate}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Serviços Adicionais</h3>

                    <FormField
                      control={form.control}
                      name="requiresLoadingHelp"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Auxílio para carregamento</FormLabel>
                            <FormDescription>
                              O transportador ajudará a carregar a mercadoria no veículo
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requiresUnloadingHelp"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Auxílio para descarregamento</FormLabel>
                            <FormDescription>
                              O transportador ajudará a descarregar a mercadoria no destino
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                      />

                    <FormField
                      control={form.control}
                      name="hasInsurance"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Seguro de carga</FormLabel>
                            <FormDescription>Adicionar seguro para a carga durante o transporte</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            // No seu JSX, adicione o componente de estimativa:
            <PriceEstimate
              distance={routeInfo?.distance || 1}
              cargoType={form.getValues().cargoType}
              weight={parseFloat(form.getValues().weightKg)}
              hasInsurance={form.getValues().hasInsurance}
              requiresLoadingHelp={form.getValues().requiresLoadingHelp}
              requiresUnloadingHelp={form.getValues().requiresUnloadingHelp}
              onPriceCalculated={(price) => setEstimatedPrice(price)}
            />)
          }

          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Resumo da Solicitação
                  </CardTitle>
                  <CardDescription>Confira os dados da sua solicitação de frete</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Origem</h3>
                      <p className="text-sm">{form.getValues().origin}</p>
                      <p className="text-sm">
                        {form.getValues().originState}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Destino</h3>
                      <p className="text-sm">{form.getValues().destination}</p>
                      <p className="text-sm">
                        {form.getValues().destinationState}
                      </p>
                    </div>
                  </div>

                  {originLocation && destinationLocation && !mapError && (
                    <>
                      <div className="mt-4">
                        <MapView
                          locations={[originLocation, destinationLocation]}
                          showRoute={true}
                          height="200px"
                          onMapError={handleMapError}
                        />
                      </div>

                      {routeInfo && (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="bg-muted p-2 rounded-md">
                            <p className="text-xs text-muted-foreground">Distância Estimada</p>
                            <p className="text-sm font-medium">{routeInfo.distance} km</p>
                          </div>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="text-xs text-muted-foreground">Tempo Estimado</p>
                            <p className="text-sm font-medium">{routeInfo.time} horas</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Informações da Carga</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Tipo de Carga</p>
                        <p className="text-sm">
                          {form.getValues().cargoType === "Caraga Geral"
                            ? "Carga Geral"
                            : form.getValues().cargoType === "Carga Frágil"
                              ? "Carga Frágil"
                              : form.getValues().cargoType === "Perecíveis"
                                ? "Perecíveis"
                                : form.getValues().cargoType === "Produtos Perigosos"
                                  ? "Produtos Perigosos"
                                  : form.getValues().cargoType === "Veículos"
                                    ? "Veículos"
                                    : form.getValues().cargoType === "Máquinas e Equipamentos"
                                      ? "Máquinas e Equipamentos"
                                      : form.getValues().cargoType === "Móveis"
                                        ? "Móveis"
                                        : "Outros"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Peso</p>
                        <p className="text-sm">{form.getValues().weightKg} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Quantidade</p>
                        <p className="text-sm">{form.getValues().quantity} unidades</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Comprimento</p>
                        <p className="text-sm">
                          {form.getValues().lengthCm || "-"} cm
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Largura</p>
                        <p className="text-sm">
                          {form.getValues().widthCm || "-"} cm
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Altura</p>
                        <p className="text-sm">
                          {form.getValues().heightCm || "-"} cm
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Datas</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Data de Coleta</p>
                        <p className="text-sm">
                          {form.getValues().pickupDate
                            ? new Date(form.getValues().pickupDate).toLocaleDateString("pt-AO")
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Data de Entrega</p>
                        <p className="text-sm">
                          {form.getValues().deliveryDate
                            ? new Date(form.getValues().deliveryDate).toLocaleDateString("pt-AO")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Serviços Adicionais</h3>
                    <ul className="text-sm space-y-1">
                      {form.getValues().requiresLoadingHelp && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Auxílio para carregamento
                        </li>
                      )}
                      {form.getValues().requiresUnloadingHelp && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Auxílio para descarregamento
                        </li>
                      )}
                      {form.getValues().hasInsurance && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Seguro de carga
                        </li>
                      )}
                      {!form.getValues().requiresLoadingHelp &&
                        !form.getValues().requiresUnloadingHelp &&
                        !form.getValues().hasInsurance && (
                          <li className="text-muted-foreground">Nenhum serviço adicional selecionado</li>
                        )}
                    </ul>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium mb-2">Arquivos Anexados</h3>
                        <div className="flex flex-wrap gap-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                              {file.type.startsWith("image/") ? (
                                <Image
                                  src={file.url || "/placeholder.svg"}
                                  alt={file.name}
                                  width={40}
                                  height={40}
                                  className="rounded object-cover"
                                />
                              ) : (
                                <FileText className="h-5 w-5 text-muted-foreground" />
                              )}
                              <span className="text-xs">
                                {file.name.length > 15 ? file.name.substring(0, 15) + "..." : file.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Preço Estimado</h3>
                    <p className="text-lg font-bold text-primary">{formatPrice(estimatedPrice)}</p>
                  </div>

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Forma de Pagamento</CardTitle>
                  <CardDescription>Escolha como deseja pagar pelo frete</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Cartão Multicaixa" />
                              </FormControl>
                              <FormLabel className="font-normal">Cartão Multicaixa</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Multicaixa Express" />
                              </FormControl>
                              <FormLabel className="font-normal">Multicaixa Express</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Transferência Bancária" />
                              </FormControl>
                              <FormLabel className="font-normal">Transferência Bancária</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Solicitação Enviada com Sucesso!</h2>
              <p className="text-muted-foreground mb-6">
                Sua solicitação de frete foi enviada e transportadores qualificados já estão sendo notificados.
              </p>
              <div className="max-w-md mx-auto bg-muted p-4 rounded-lg mb-6">
                <p className="font-medium">Número de Rastreamento:</p>
                <p className="text-xl font-bold">{freightReference}</p>
              </div>
              <p className="mb-6">
                Você receberá propostas de transportadores em breve. Fique atento ao seu e-mail e ao painel de controle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/dashboard/client">Ir para o Painel</Link>
                </Button>
                <Button asChild>
                  <Link href="/services/client/my-freights">Ver Fretes</Link>
                </Button>
              </div>
            </div>
          )}

          {currentStep < 5 && (
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Próximo
                </Button>
              ) : (
                
                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={false}>
                  {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              )}
            </div>
          )}
        </form>
      </Form>
    </div>
    </GoogleMapsProvider>
  )
}
