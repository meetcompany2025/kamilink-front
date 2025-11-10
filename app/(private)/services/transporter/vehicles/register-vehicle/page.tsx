"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle, FileText, Truck, Upload, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { VehicleService } from "@/services/vehicleService"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"


const formSchema = z.object({
  type: z.string().min(1, {
    message: "Tipo de veículo é obrigatório.",
  }),
  brand: z.string().min(1, {
    message: "Marca é obrigatória.",
  }),
  model: z.string().min(1, {
    message: "Modelo é obrigatório.",
  }),
  licensePlate: z.string().min(1, {
    message: "Placa é obrigatória.",
  }),
  year: z.string().min(1, {
    message: "Ano é obrigatório.",
  }),
  loadCapacity: z.number().min(1, {
    message: "Capacidade é obrigatória.",
  }),
  dimensions: z.string().optional(),
  features: z.array(z.string()).default([]),
  description: z.string().optional(),
  hasDocumentation: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "Você deve confirmar que possui a documentação do veículo.",
    }),
  trailerType: z.string(),
  baseProvince: z.string(),
})

export default function RegisterVehiclePage() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileList = Array.from(files)
    setUploadedFiles((prev) => [...prev, ...fileList])
    uploadFiles(fileList)
  }

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true)
    setUploadProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append("file", file)

      try {
        console.log("Chega aqui")
        // Simulação: Aguarde 1s
        await new Promise((res) => setTimeout(res, 1000))

        // Se tivesse API:
        /*
        await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
            setUploadProgress(percent)
          },
        })
        */

        // Marca como enviado
        setUploadedFiles((prev) => [...prev, file])
      } catch (err) {
        console.error("Erro ao enviar arquivo:", file.name, err)
      }
    }

    setIsUploading(false)
    setUploadProgress(0)
  }

  const removeFile = (index: number) => {
    const updated = [...uploadedFiles]
    updated.splice(index, 1)
    setUploadedFiles(updated)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      brand: "",
      model: "",
      licensePlate: "",
      year: "",
      loadCapacity: 0,
      dimensions: "",
      features: [],
      description: "",
      hasDocumentation: false,
      trailerType: "N/A",
      baseProvince: "Luanda",
    },
  })
  
  const { watch, handleSubmit, formState } = form;
  
  const hasDocumentation = watch("hasDocumentation");
  
   async function onSubmit(values: z.infer<typeof formSchema>) {
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para solicitar um frete.",
          variant: "destructive",
        })
        return
      }
  
      setIsSubmitting(true)
  
      try {
        
        // Adiciona os arquivos enviados e coordenadas aos dados do frete
        const vehiclesData = {
          ...values,
          userId: user.id
        }
  
  
        console.log(vehiclesData)
  
        // Envia a solicitação de frete para o Supabase
        await VehicleService.createAuth(vehiclesData);
  
        setIsSuccess(true);
   
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

  const availableFeatures = [
    { id: "refrigerated", label: "Refrigerado" },
    { id: "hydraulic_lift", label: "Plataforma Hidráulica" },
    { id: "gps", label: "GPS/Rastreador" },
    { id: "tarp", label: "Lona/Cobertura" },
    { id: "security_locks", label: "Travas de Segurança" },
    { id: "loading_ramp", label: "Rampa de Carregamento" },
  ]

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
        <h1 className="text-2xl font-bold mt-4">Cadastrar Veículo</h1>
        <p className="text-muted-foreground">Adicione os veículos da sua frota para começar a transportar</p>
      </div>

      <div className="relative h-48 w-full mb-6 rounded-lg overflow-hidden">
        <Image src="/images/truck-angola-3.png" alt="Registre seu veículo no KamiLink" fill className="object-cover" />
      </div>

      {isSuccess ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Veículo Cadastrado com Sucesso!</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Seu veículo foi adicionado à sua frota e estará disponível para fretes assim que a documentação for
                verificada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" onClick={() => setIsSuccess(false)}>
                  Cadastrar Outro Veículo
                </Button>
                <Button asChild>
                  <Link href="/services/transporter/vehicles">Meus Veículos</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Informações do Veículo
                </CardTitle>
                <CardDescription>Preencha os dados do seu veículo de transporte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Veículo</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Caminhão">Caminhão</SelectItem>
                              <SelectItem value="Van">Van</SelectItem>
                              <SelectItem value="Pickup">Pickup</SelectItem>
                              <SelectItem value="Caminhão Semi-Reboque">Caminhão Semi-Reboque</SelectItem>
                              <SelectItem value="Caminhão Refrigerado">Caminhão Refrigerado</SelectItem>
                              <SelectItem value="Caminhão Tanque">Caminhão Tanque</SelectItem>
                              <SelectItem value="Caminhão Plataforma">Caminhão Plataforma</SelectItem>
                              <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Mercedes-Benz, Volvo, Scania" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Actros, FH 460" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 2020" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="licensePlate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placa</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: ABC-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="loadCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacidade de Carga</FormLabel>
                        <FormControl>
                          <Input type="number"
          placeholder="Ex: 12000 kg"
          value={field.value}  onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensões (C x L x A)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 12m x 2.5m x 3m" {...field} />
                      </FormControl>
                      <FormDescription>Comprimento x Largura x Altura</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-3">
                  <label className="text-sm font-medium">Características do Veículo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableFeatures.map((feature) => (
                      <FormField
                        key={feature.id}
                        control={form.control}
                        name="features"
                        render={({ field }) => {
                          return (
                            <FormItem key={feature.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(feature.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, feature.id])
                                      : field.onChange(field.value?.filter((value) => value !== feature.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{feature.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição Adicional</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva detalhes adicionais sobre o veículo"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
      {/* Área de upload */}
      <div
        className="flex items-center justify-center p-4 border-2 border-dashed rounded-md border-muted-foreground/20 cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Arraste fotos do veículo ou clique para fazer upload</p>
          <p className="text-xs text-muted-foreground">Suporta JPG, PNG (máx. 10MB)</p>
          <Button type="button" variant="outline" size="sm">
            Selecionar Arquivos
          </Button>
        </div>
        {/* Hidden input */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          ref={inputRef}
          className="hidden"
        />
      </div>

      {/* Lista de arquivos enviados */}
      {uploadedFiles.length > 0 && (
        <>
          <Separator className="my-4" />
          <div>
            <h3 className="text-sm font-medium mb-2">Arquivos Anexados</h3>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-muted p-2 rounded-md relative"
                >
                  {file.type.startsWith("image/") ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                  ) : (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-xs max-w-[100px] truncate">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-1 text-xs text-muted-foreground"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>

                <FormField
                  control={form.control}
                  name="hasDocumentation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Confirmo que possuo toda a documentação necessária do veículo e estou ciente que precisarei
                          enviá-la para verificação.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={!hasDocumentation || isSubmitting}>
                {isSubmitting ? "Enviando..." : "Cadastrar Veículo"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
