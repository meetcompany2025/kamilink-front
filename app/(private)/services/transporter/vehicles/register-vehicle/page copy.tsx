// "use client"

// import { useRef, useState, useEffect } from "react"
// import Link from "next/link"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { ArrowLeft, CheckCircle, FileText, Truck, Upload, X } from "lucide-react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { VehicleService } from "@/services/vehicleService"
// import { useToast } from "@/components/ui/use-toast"
// import { useAuth } from "@/components/auth-provider"
// import Image from "next/image"

// // ------------------------- SCHEMA COM CORREÇÕES -------------------------
// const formSchema = z.object({
//   type: z.string().min(1, { message: "Tipo de veículo é obrigatório." }),
//   brand: z.string().min(1, { message: "Marca é obrigatória." }),
//   model: z.string().min(1, { message: "Modelo é obrigatório." }),
//   licensePlate: z.string().min(1, { message: "Placa é obrigatória." }),
//   year: z.string().min(1, { message: "Ano é obrigatório." }),
//   loadCapacity: z.string().refine((val) => Number(val) > 0, {
//     message: "Capacidade deve ser maior que 0",
//   }),
//   dimensions: z.string().optional(),
//   features: z.array(z.string()).default([]),
//   description: z.string().optional(),
//   hasDocumentation: z
//     .boolean()
//     .default(false)
//     .refine((val) => val === true, {
//       message: "Você deve confirmar que possui a documentação do veículo.",
//     }),
//   trailerType: z.enum(["N/A", "Reboque", "Semi-Reboque"]),
//   baseProvince: z.enum(["Luanda", "Benguela", "Huíla", "Namibe", "Malanje", "Huambo"]),
// })

// // ------------------------- COMPONENTE PRINCIPAL -------------------------
// export default function RegisterVehiclePage() {
//   const inputRef = useRef<HTMLInputElement | null>(null)

//   // arquivo do veículo
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null)

//   const [isUploading, setIsUploading] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isSuccess, setIsSuccess] = useState(false)

//   const { toast } = useToast()
//   const { user } = useAuth()

//   // form
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       type: "",
//       brand: "",
//       model: "",
//       licensePlate: "",
//       year: "",
//       loadCapacity: "",
//       dimensions: "",
//       features: [],
//       description: "",
//       hasDocumentation: false,
//       trailerType: "N/A",
//       baseProvince: "Luanda",
//     },
//   })

//   const { watch } = form
//   const hasDocumentation = watch("hasDocumentation")

//   // características disponíveis
//   const availableFeatures = [
//     { id: "refrigerated", label: "Refrigerado" },
//     { id: "hydraulic_lift", label: "Plataforma Hidráulica" },
//     { id: "gps", label: "GPS/Rastreador" },
//     { id: "tarp", label: "Lona/Cobertura" },
//     { id: "security_locks", label: "Travas de Segurança" },
//     { id: "loading_ramp", label: "Rampa de Carregamento" },
//   ]

//   // ------------------------- INPUT DE ARQUIVO -------------------------
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files
//     if (!files || files.length === 0) return

//     const file = files[0]
//     setSelectedFile(file)

//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl)
//     }
//     setPreviewUrl(URL.createObjectURL(file))
//   }

//   const removeSelectedFile = () => {
//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl)
//     }
//     setSelectedFile(null)
//     setPreviewUrl(null)
//     if (inputRef.current) inputRef.current.value = ""
//   }

//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl)
//     }
//   }, [previewUrl])

//   const handlePreviewClick = () => {
//     if (!selectedFile) return
//     const url = previewUrl ?? URL.createObjectURL(selectedFile)
//     window.open(url, "_blank")
//   }

//   // ------------------------- UPLOAD -------------------------
//   const uploadVehicleImage = async (vehicleId: string) => {
//     if (!selectedFile) return null

//     try {
//       setIsUploading(true)
//       const uploaded = await VehicleService.uploadVehicleImage(vehicleId, selectedFile, "VEHICLE_IMAGE")
//       setIsUploading(false)
//       return uploaded
//     } catch (err: any) {
//       setIsUploading(false)
//       console.error("Erro no upload da imagem:", err.response?.data || err)
//       throw err
//     }
//   }

//   // ------------------------- SUBMIT -------------------------
//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     if (!user) {
//       toast({
//         title: "Erro",
//         description: "Você precisa estar logado para cadastrar um veículo.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const vehiclePayload = {
//         ...values,
//         userId: user.id,
//         loadCapacity: Number(values.loadCapacity),
//       }

//       // 1) cria veículo
//       const createdVehicle = await VehicleService.createAuth(vehiclePayload)

//       // 2) faz upload da foto se houver
//       if (selectedFile) {
//         try {
//           await uploadVehicleImage(createdVehicle.id)
//         } catch (err) {
//           toast({
//             title: "Veículo criado (com erro no upload)",
//             description: "Veículo criado, mas falhou o envio da foto. Você pode tentar enviar depois.",
//             variant: "destructive",
//           })
//           setIsSubmitting(false)
//           return
//         }
//       }

//       setIsSuccess(true)
//       toast({
//         title: "Veículo cadastrado",
//         description: "Seu veículo foi cadastrado com sucesso.",
//       })

//       form.reset()
//       removeSelectedFile()
//     } catch (error) {
//       console.error("Erro ao cadastrar veículo:", error)
//       toast({
//         title: "Erro ao cadastrar veículo",
//         description: "Ocorreu um erro ao cadastrar o veículo. Tente novamente.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//       setIsUploading(false)
//     }
//   }

//   // ------------------------- RENDER -------------------------
//   return (
//     <div className="container max-w-3xl mx-auto py-10 px-4">
//       <div className="mb-8">
//         <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Voltar para a página inicial
//         </Link>
//         <h1 className="text-2xl font-bold mt-4">Cadastrar Veículo</h1>
//         <p className="text-muted-foreground">Adicione os veículos da sua frota para começar a transportar</p>
//       </div>

//       <div className="relative h-48 w-full mb-6 rounded-lg overflow-hidden">
//         <Image src="/images/truck-angola-3.png" alt="Registre seu veículo no KamiLink" fill className="object-cover" />
//       </div>

//       {isSuccess ? (
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex flex-col items-center justify-center py-8 text-center">
//               <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
//                 <CheckCircle className="h-8 w-8 text-green-600" />
//               </div>
//               <h2 className="text-2xl font-bold mb-2">Veículo Cadastrado com Sucesso!</h2>
//               <p className="text-muted-foreground mb-6 max-w-md">
//                 Seu veículo foi adicionado à sua frota e estará disponível para fretes assim que a documentação for verificada.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Button variant="outline" onClick={() => setIsSuccess(false)}>
//                   Cadastrar Outro Veículo
//                 </Button>
//                 <Button>
//                   <Link href="/services/transporter/vehicles">Meus Veículos</Link>
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <Form {...form}>
//           <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
//             {/* CARD PRINCIPAL */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Truck className="h-5 w-5 text-primary" />
//                   Informações do Veículo
//                 </CardTitle>
//                 <CardDescription>Preencha os dados do seu veículo de transporte</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* Tipo e Marca */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <FormField control={form.control} name="type" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Tipo de Veículo</FormLabel>
//                       <FormControl>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                           <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="Caminhão">Caminhão</SelectItem>
//                             <SelectItem value="Van">Van</SelectItem>
//                             <SelectItem value="Pickup">Pickup</SelectItem>
//                             <SelectItem value="Caminhão Semi-Reboque">Caminhão Semi-Reboque</SelectItem>
//                             <SelectItem value="Caminhão Refrigerado">Caminhão Refrigerado</SelectItem>
//                             <SelectItem value="Caminhão Tanque">Caminhão Tanque</SelectItem>
//                             <SelectItem value="Caminhão Plataforma">Caminhão Plataforma</SelectItem>
//                             <SelectItem value="Outro">Outro</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />

//                   <FormField control={form.control} name="brand" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Marca</FormLabel>
//                       <FormControl><Input placeholder="Ex: Mercedes-Benz, Volvo, Scania" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                 </div>

//                 {/* Modelo e Ano */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <FormField control={form.control} name="model" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Modelo</FormLabel>
//                       <FormControl><Input placeholder="Ex: Actros, FH 460" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField control={form.control} name="year" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Ano</FormLabel>
//                       <FormControl><Input placeholder="Ex: 2020" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                 </div>

//                 {/* Placa e Capacidade */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <FormField control={form.control} name="licensePlate" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Placa</FormLabel>
//                       <FormControl><Input placeholder="Ex: ABC-1234" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField control={form.control} name="loadCapacity" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Capacidade de Carga</FormLabel>
//                       <FormControl>
//                         <Input type="number" placeholder="Ex: 12000" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                 </div>

//                 {/* Dimensões */}
//                 <FormField control={form.control} name="dimensions" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Dimensões (C x L x A)</FormLabel>
//                     <FormControl><Input placeholder="Ex: 12m x 2.5m x 3m" {...field} /></FormControl>
//                     <FormDescription>Comprimento x Largura x Altura</FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )} />

//                 <Separator />

//                 {/* Características */}
//                 <div className="space-y-3">
//                   <label className="text-sm font-medium">Características do Veículo</label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {availableFeatures.map((feature) => (
//                       <FormField key={feature.id} control={form.control} name="features" render={({ field }) => (
//                         <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                           <FormControl>
//                             <Checkbox
//                               checked={field.value?.includes(feature.id)}
//                               onCheckedChange={(checked) => {
//                                 return checked
//                                   ? field.onChange([...(field.value ?? []), feature.id])
//                                   : field.onChange((field.value ?? []).filter((value) => value !== feature.id))
//                               }}
//                             />
//                           </FormControl>
//                           <FormLabel className="font-normal">{feature.label}</FormLabel>
//                         </FormItem>
//                       )} />
//                     ))}
//                   </div>
//                 </div>

//                 {/* Descrição */}
//                 <FormField control={form.control} name="description" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Descrição Adicional</FormLabel>
//                     <FormControl><Textarea placeholder="Descreva detalhes adicionais sobre o veículo" className="resize-none" {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )} />

//                 {/* Upload */}
//                 <div>
//                   <div
//                     className="flex items-center justify-center p-4 border-2 border-dashed rounded-md border-muted-foreground/20 cursor-pointer"
//                     onClick={() => inputRef.current?.click()}
//                   >
//                     <div className="flex flex-col items-center gap-2 text-center">
//                       <Upload className="h-8 w-8 text-muted-foreground" />
//                       <p className="text-sm font-medium">Arraste uma foto do veículo ou clique para selecionar</p>
//                       <p className="text-xs text-muted-foreground">Suporta JPG, PNG (máx. 10MB)</p>
//                       <Button type="button" variant="outline" size="sm">Selecionar Arquivo</Button>
//                     </div>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       ref={inputRef}
//                       className="hidden"
//                     />
//                   </div>

//                   {selectedFile && (
//                     <>
//                       <Separator className="my-4" />
//                       <div className="flex items-center gap-3">
//                         <div className="w-14 h-14 rounded overflow-hidden flex items-center justify-center bg-muted">
//                           {previewUrl ? (
//                             <img src={previewUrl} alt={selectedFile.name} className="object-cover w-14 h-14" />
//                           ) : (
//                             <FileText className="h-5 w-5 text-muted-foreground" />
//                           )}
//                         </div>
//                         <div className="flex-1">
//                           <div className="text-sm font-medium truncate">{selectedFile.name}</div>
//                           <div className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
//                         </div>
//                         <div className="flex gap-2">
//                           <Button variant="outline" size="sm" onClick={handlePreviewClick}>Visualizar</Button>
//                           <Button variant="ghost" size="sm" onClick={removeSelectedFile}><X className="h-4 w-4" /></Button>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* Documentação */}
//                 <FormField control={form.control} name="hasDocumentation" render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                     <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
//                     <div className="space-y-1 leading-none">
//                       <FormLabel>
//                         Confirmo que possuo toda a documentação necessária do veículo e estou ciente que precisarei enviá-la para verificação.
//                       </FormLabel>
//                       <FormMessage />
//                     </div>
//                   </FormItem>
//                 )} />

//               </CardContent>
//             </Card>

//             <div className="flex justify-end">
//               <Button type="submit" disabled={!hasDocumentation || isSubmitting || isUploading}>
//                 {isSubmitting ? "Cadastrando veículo..." : isUploading ? "Enviando foto..." : "Cadastrar Veículo"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       )}
//     </div>
//   )
// }
