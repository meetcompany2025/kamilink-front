"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle, FileText, Truck, Upload, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { VehicleService } from "@/services/vehicleService"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"

/**
 * Schema de validação (mantive seu schema original com pequenas adaptações)
 * Observação: validação dos arquivos é feita no submit (aqui apenas form fields textuais)
 */
const formSchema = z.object({
  type: z.string().min(1, { message: "Tipo de veículo é obrigatório." }),
  brand: z.string().min(1, { message: "Marca é obrigatória." }),
  model: z.string().min(1, { message: "Modelo é obrigatório." }),
  licensePlate: z.string().min(1, { message: "Placa é obrigatória." }),
  year: z.string().min(1, { message: "Ano é obrigatório." }),
  loadCapacity: z.string().refine((val) => Number(val) > 0, { message: "Capacidade deve ser maior que 0" }),
  dimensions: z.string().optional(),
  features: z.array(z.string()).default([]),
  description: z.string().optional(),
  hasDocumentation: z.boolean().default(false).refine((val) => val === true, {
    message: "Você deve confirmar que possui a documentação do veículo.",
  }),
  trailerType: z.enum(["N/A", "Reboque", "Semi-Reboque"]),
  baseProvince: z.enum(["Luanda", "Benguela", "Huíla", "Namibe", "Malanje", "Huambo"]),
})

/**
 * Ordem B: documentos (TITLE, INSURANCE, IPO, IVM) primeiro, depois a foto (vehicleImage)
 *
 * COMPORTAMENTO:
 * - O formulário cria primeiro o veículo (POST /vehicles)
 * - Em seguida chama VehicleService.uploadVehicleDocuments(vehicleId, vehicleImage, documents)
 *   que monta FormData exatamente como o Postman:
 *     documents (4x) + vehicleImage + documentTypes JSON string
 *
 * - Todos os 5 inputs são obrigatórios: se faltar qualquer um, o envio é bloqueado no front.
 */

export default function RegisterVehiclePage() {
  // referência do input de imagem (preview)
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  // ------------------ estados ------------------
  // foto do veículo (último input)
  // const [vehicleImage, setVehicleImage] = useState<File | null>(null)
  const [vehicleImagePreview, setVehicleImagePreview] = useState<string | null>(null)
  const [vehicleImage, setVehicleImage] = useState<File | null>(null);

const [titleFile, setTitleFile] = useState<File | null>(null);
const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
const [ipoFile, setIpoFile] = useState<File | null>(null);
const [ivmFile, setIvmFile] = useState<File | null>(null);

  // documentos — 4 entradas fixas, indexadas:
  // 0 => TITLE, 1 => INSURANCE, 2 => IPO, 3 => IVM
  const [documents, setDocuments] = useState<Array<File | null>>([null, null, null, null])

  // estados UI
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { toast } = useToast()
  const { user } = useAuth()

  // form (seu schema)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      brand: "",
      model: "",
      licensePlate: "",
      year: "",
      loadCapacity: "",
      dimensions: "",
      features: [],
      description: "",
      hasDocumentation: false,
      trailerType: "N/A",
      baseProvince: "Luanda",
    },
  })

  const { watch } = form
  const hasDocumentation = watch("hasDocumentation")

  const availableFeatures = [
    { id: "refrigerated", label: "Refrigerado" },
    { id: "hydraulic_lift", label: "Plataforma Hidráulica" },
    { id: "gps", label: "GPS/Rastreador" },
    { id: "tarp", label: "Lona/Cobertura" },
    { id: "security_locks", label: "Travas de Segurança" },
    { id: "loading_ramp", label: "Rampa de Carregamento" },
  ]

  // ------------------ manipuladores de arquivos ------------------

  // Documentos: função para trocar o arquivo de um slot (0..3)
  function handleDocumentFileChange(slotIndex: number, file?: File | null) {
    setDocuments((prev) => {
      const next = [...prev]
      next[slotIndex] = file ?? null
      return next
    })
  }

  // Imagem do veículo (último input)
  function handleVehicleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    setVehicleImage(file)

    // cria preview
    if (vehicleImagePreview) URL.revokeObjectURL(vehicleImagePreview)
    setVehicleImagePreview(URL.createObjectURL(file))
  }

  function removeVehicleImage() {
    if (vehicleImagePreview) URL.revokeObjectURL(vehicleImagePreview)
    setVehicleImage(null)
    setVehicleImagePreview(null)
    if (imageInputRef.current) imageInputRef.current.value = ""
  }

  useEffect(() => {
    return () => {
      if (vehicleImagePreview) URL.revokeObjectURL(vehicleImagePreview)
    }
  }, [vehicleImagePreview])

  // ------------------ função de envio ao backend ------------------
  // cria veículo (chama service) e depois faz upload dos 5 arquivos no endpoint /uploads/vehicle-documents/:vehicleId/upload
  async function submitAndUpload(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado.", variant: "destructive" })
      return
    }

    // valida arquivos localmente (os 4 documentos + imagem são obrigatórios)
    const missingDocs: string[] = []
    const docTypes = ["TITLE", "INSURANCE", "IPO", "IVM"]
    for (let i = 0; i < 4; i++) {
      if (!documents[i]) missingDocs.push(docTypes[i])
    }
    if (!vehicleImage) missingDocs.push("VEHICLE_IMAGE")

    if (missingDocs.length > 0) {
      toast({
        title: "Arquivos faltando",
        description: `Os seguintes arquivos são obrigatórios: ${missingDocs.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 1) cria o veículo
      const vehiclePayload = {
        ...values,
        userId: user.id,
        loadCapacity: Number(values.loadCapacity),
      }

      const createdVehicle = await VehicleService.createAuth(vehiclePayload)

      // 2) monta o array de documentos no formato esperado pelo VehicleService.uploadVehicleDocuments
      // cada item: { file: File, documentType: string }
      const docsForUpload = [
        { file: documents[0] as File, documentType: "TITLE" },
        { file: documents[1] as File, documentType: "INSURANCE" },
        { file: documents[2] as File, documentType: "IPO" },
        { file: documents[3] as File, documentType: "IVM" },
      ]

      // 3) faz upload (VehicleService.uploadVehicleDocuments faz a chamada para /uploads/vehicle-documents/:vehicleId/upload)
      setIsUploading(true)
      await VehicleService.uploadVehicleDocuments(createdVehicle.id, vehicleImage as File, docsForUpload)
      setIsUploading(false)

      // sucesso
      setIsSuccess(true)
      toast({ title: "Veículo cadastrado", description: "Veículo e documentos enviados com sucesso." })

      // reset
      form.reset()
      removeVehicleImage()
      setDocuments([null, null, null, null])
    } catch (err: any) {
      console.error("Erro ao criar/upload:", err)
      toast({
        title: "Erro",
        description: err?.response?.data?.message || "Erro ao criar veículo ou enviar arquivos.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setIsSubmitting(false)
    }
  }

    // ------------------ RENDER (JSX) ------------------
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
                Seu veículo foi adicionado à sua frota e os documentos foram enviados para verificação.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={() => setIsSuccess(false)}>Cadastrar Outro Veículo</Button>
                <Button>
                  <Link href="/services/transporter/vehicles">Meus Veículos</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(submitAndUpload)}>
            {/* CARD PRINCIPAL: informações do veículo (mantive layout básico) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Informações do Veículo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Veículo</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
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
                  )} />

                  <FormField control={form.control} name="brand" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl><Input placeholder="Ex: Mercedes-Benz, Volvo, Scania" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="model" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl><Input placeholder="Ex: Actros, FH 460" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="year" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl><Input placeholder="Ex: 2020" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="licensePlate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa</FormLabel>
                      <FormControl><Input placeholder="Ex: ABC-1234" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="loadCapacity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade de Carga</FormLabel>
                      <FormControl><Input type="number" placeholder="Ex: 12000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* UPLOADS — ORDEM B: 4 DOCUMENTOS (PDF) primeiro, depois a image */}
            <Card>
              <CardHeader>
                <CardTitle>Documentos do Veículo (obrigatórios)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Document 0 - TITLE */}
                <div className="flex items-center gap-3">
                  <div className="w-8"><FileText className="h-6 w-6 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Título do Veículo (PDF) *</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleDocumentFileChange(0, e.target.files?.[0] ?? null)}
                      className="mt-1"
                    />
                    {documents[0] && <div className="text-xs text-muted-foreground mt-1 truncate">{documents[0]!.name}</div>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDocumentFileChange(0, null)}><X className="h-4 w-4" /></Button>
                </div>

                {/* Document 1 - INSURANCE */}
                <div className="flex items-center gap-3">
                  <div className="w-8"><FileText className="h-6 w-6 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Seguro Obrigatório (PDF) *</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleDocumentFileChange(1, e.target.files?.[0] ?? null)}
                      className="mt-1"
                    />
                    {documents[1] && <div className="text-xs text-muted-foreground mt-1 truncate">{documents[1]!.name}</div>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDocumentFileChange(1, null)}><X className="h-4 w-4" /></Button>
                </div>

                {/* Document 2 - IPO */}
                <div className="flex items-center gap-3">
                  <div className="w-8"><FileText className="h-6 w-6 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Inspeção Periódica (IPO) (PDF) *</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleDocumentFileChange(2, e.target.files?.[0] ?? null)}
                      className="mt-1"
                    />
                    {documents[2] && <div className="text-xs text-muted-foreground mt-1 truncate">{documents[2]!.name}</div>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDocumentFileChange(2, null)}><X className="h-4 w-4" /></Button>
                </div>

                {/* Document 3 - IVM */}
                <div className="flex items-center gap-3">
                  <div className="w-8"><FileText className="h-6 w-6 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium">IVM / Imposto (PDF) *</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleDocumentFileChange(3, e.target.files?.[0] ?? null)}
                      className="mt-1"
                    />
                    {documents[3] && <div className="text-xs text-muted-foreground mt-1 truncate">{documents[3]!.name}</div>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDocumentFileChange(3, null)}><X className="h-4 w-4" /></Button>
                </div>

                <Separator />

                {/* Vehicle image (último) */}
                <div className="flex items-center gap-3">
                  <div className="w-8"><Upload className="h-6 w-6 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Foto do Veículo (JPG/PNG) *</label>
                    <div className="mt-1 flex items-center gap-3">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleVehicleImageChange}
                      />
                      {vehicleImage && <div className="text-xs text-muted-foreground truncate">{vehicleImage.name}</div>}
                      {vehicleImagePreview && <img src={vehicleImagePreview} alt="preview" className="h-12 w-20 object-cover rounded" />}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeVehicleImage}><X className="h-4 w-4" /></Button>
                </div>

                {/* Confirm documentation (checkbox) */}
                <div className="mt-2">
                  <FormField control={form.control} name="hasDocumentation" render={({ field }) => (
                    <FormItem className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div>
                        <FormLabel className="text-sm">Confirmo que possuo toda a documentação necessária e a envio agora.</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            {/* submit */}
            <div className="flex justify-end">
              <Button type="submit" disabled={!hasDocumentation || isSubmitting || isUploading}>
                {isSubmitting ? "Cadastrando veículo..." : isUploading ? "Enviando arquivos..." : "Cadastrar Veículo"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
