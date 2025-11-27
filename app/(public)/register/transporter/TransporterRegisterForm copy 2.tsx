// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { CheckCircle, AlertCircle, Eye, EyeOff, Upload, X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/components/ui/use-toast"
// import { Progress } from "@/components/ui/progress"
// import { registerTransporter, TransporterDocumentService } from "@/services/transporterService"
// import { useForm } from "react-hook-form"

// // Serviço para upload de documentos (vamos criar)

// // Constantes
// const DOCUMENT_TYPES = [
//   { value: "bi", label: "Bilhete de Identidade (BI)" },
//   { value: "nif", label: "Número de Identificação Fiscal (NIF)" },
// ]

// const PROVINCES = [
//   { value: "luanda", label: "Luanda" },
//   { value: "benguela", label: "Benguela" },
//   { value: "huambo", label: "Huambo" },
//   { value: "cabinda", label: "Cabinda" },
//   { value: "malanje", label: "Malanje" },
//   { value: "huila", label: "Huíla" },
//   { value: "bie", label: "Bié" },
//   { value: "uige", label: "Uíge" },
//   { value: "cunene", label: "Cunene" },
//   { value: "lunda_norte", label: "Lunda Norte" },
//   { value: "lunda_sul", label: "Lunda Sul" },
//   { value: "moxico", label: "Moxico" },
//   { value: "namibe", label: "Namibe" },
//   { value: "zaire", label: "Zaire" },
//   { value: "bengo", label: "Bengo" },
//   { value: "cuando_cubango", label: "Cuando Cubango" },
//   { value: "cuanza_norte", label: "Cuanza Norte" },
//   { value: "cuanza_sul", label: "Cuanza Sul" },
// ]

// // Esquema de validação simplificado
// const transporterFormSchema = z
//   .object({
//     fullName: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
//     email: z.string().email({ message: "Email inválido" }),
//     phone: z.string().min(9, { message: "Telefone inválido" }),
//     documentType: z.string({ required_error: "Selecione o tipo de documento" }),
//     documentNumber: z.string().min(1, { message: "Número de documento é obrigatório" }),
//     provincia: z.string({ required_error: "Selecione a sua província" }),
//     experienceYears: z.coerce.number({ required_error: "Anos de experiência" }).optional(),
//     driverLicense: z.string({ required_error: "Número da carta é obrigatório" }),
//     password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "As senhas não coincidem",
//     path: ["confirmPassword"],
//   })

// type TransporterFormValues = z.infer<typeof transporterFormSchema>

// interface FileWithPreview extends File {
//   preview?: string
// }

// export function TransporterRegisterForm() {
//   const [step, setStep] = useState(1)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [identificationFile, setIdentificationFile] = useState<FileWithPreview | null>(null)
//   const [driverLicenseFile, setDriverLicenseFile] = useState<FileWithPreview | null>(null)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [createdTransporterId, setCreatedTransporterId] = useState<string | null>(null)
  
//   const { toast } = useToast()
//   const router = useRouter()

//   const form = useForm({
//     resolver: zodResolver(transporterFormSchema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       phone: "",
//       documentType: "",
//       documentNumber: "",
//       provincia: "",
//       experienceYears: 0,
//       driverLicense: "",
//       password: "",
//       confirmPassword: "",
//     },
//   })

//   // Função para formatar telefone
//   const formatPhone = (value: string) => {
//     const numbers = value.replace(/\D/g, "")
//     if (numbers.startsWith("244")) {
//       return `+${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)} ${numbers.slice(9, 12)}`
//     }
//     if (numbers.length <= 9) {
//       return `+244 ${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)}`
//     }
//     return value
//   }

//   const onSubmit = async (data: TransporterFormValues) => {
//     setIsSubmitting(true)
//     setUploadProgress(0)

//     try {
//       // 1. Registrar o transportador
//       setUploadProgress(20)
      
//       const response = await registerTransporter({
//         fullName: data.fullName,
//         email: data.email,
//         password: data.password,
//         phone: data.phone.replace(/\D/g, ""),
//         profile: 'TRANSPORTER',
//         documentType: data.documentType,
//         documentNumber: data.documentNumber,
//         provincia: data.provincia,
//         experienceYears: data.experienceYears, 
//         driverLicense: data.driverLicense,
//         availability: true,
//         licensePlate: "" // Campo obrigatório mas não usado mais
//       })

//       console.log("Transportador criado:", response)

//       if (response.transporter?.id) {
//         setCreatedTransporterId(response.transporter.id)
//         setUploadProgress(60)

//         // 2. Upload dos documentos (se houver)
//         if (identificationFile || driverLicenseFile) {
//           setUploadProgress(80)
          
//           await TransporterDocumentService.uploadDocuments(
//             response.transporter.id,
//             identificationFile,
//             driverLicenseFile,
//             data.documentType.toUpperCase() // 'bi' ou 'nif'
//           )
//         }

//         setUploadProgress(100)

//         toast({
//           title: "Cadastro realizado com sucesso!",
//           description: "Seus documentos foram enviados para verificação.",
//         })

//         // Redirecionar para página de confirmação
//         setTimeout(() => {
//           router.push("/register/confirmation")
//         }, 2000)
//       }
//     } catch (error: any) {
//       console.error("Erro ao cadastrar:", error)
//       toast({
//         title: "Erro ao cadastrar",
//         description: error.message || "Ocorreu um erro ao processar seu cadastro. Tente novamente.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//       setUploadProgress(0)
//     }
//   }

//     const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "identification" | "driverLicense") => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0] as FileWithPreview

//       if (file.type.startsWith("image/") || file.type === "application/pdf") {
//         if (file.type.startsWith("image/")) {
//           file.preview = URL.createObjectURL(file)
//         }

//         if (type === "identification") {
//           if (identificationFile?.preview) {
//             URL.revokeObjectURL(identificationFile.preview)
//           }
//           setIdentificationFile(file)
//         } else if (type === "driverLicense") {
//           if (driverLicenseFile?.preview) {
//             URL.revokeObjectURL(driverLicenseFile.preview)
//           }
//           setDriverLicenseFile(file)
//         }
//       } else {
//         toast({
//           title: "Formato inválido",
//           description: "Apenas PDF e imagens são aceitos.",
//           variant: "destructive",
//         })
//       }
//     }
//   }

//   const removeFile = (type: "identification" | "driverLicense") => {
//     if (type === "identification" && identificationFile?.preview) {
//       URL.revokeObjectURL(identificationFile.preview)
//       setIdentificationFile(null)
//     } else if (type === "driverLicense" && driverLicenseFile?.preview) {
//       URL.revokeObjectURL(driverLicenseFile.preview)
//       setDriverLicenseFile(null)
//     }
//   }

//   const nextStep = async () => {
//     const fieldsToValidate =
//       step === 1
//         ? ["fullName", "email", "phone", "documentType", "documentNumber", "provincia", "driverLicense"]
//         : ["password", "confirmPassword"]

//     const isValid = await form.trigger(fieldsToValidate as any)
//     if (isValid) setStep(step + 1)
//   }

//   const prevStep = () => setStep(step - 1)

//   // Verificar se todos os documentos obrigatórios estão preenchidos
//   const allDocumentsUploaded = identificationFile && driverLicenseFile

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold">Cadastro de Transportador</CardTitle>
//         <CardDescription>
//           Preencha os dados abaixo para se cadastrar como transportador na plataforma KamiLink
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {isSubmitting && (
//           <div className="mb-6">
//             <div className="flex justify-between text-sm mb-2">
//               <span>Processando cadastro...</span>
//               <span>{uploadProgress}%</span>
//             </div>
//             <Progress value={uploadProgress} className="w-full" />
//           </div>
//         )}

//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <div className="mb-6">
//             <div className="flex justify-between mb-2">
//               <div className={`flex items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
//                     step >= 1 ? "bg-primary text-primary-foreground" : "bg-primary/10"
//                   }`}
//                 >
//                   <span className="font-medium">1</span>
//                 </div>
//                 <span>Dados Pessoais</span>
//               </div>
//               <div className="border-t border-border w-16 self-center mx-2"></div>
//               <div className={`flex items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
//                     step >= 2 ? "bg-primary text-primary-foreground" : "bg-primary/10"
//                   }`}
//                 >
//                   <span className="font-medium">2</span>
//                 </div>
//                 <span>Documentos</span>
//               </div>
//             </div>
//           </div>

//           {step === 1 && (
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="fullName">Nome Completo</Label>
//                 <Input id="fullName" placeholder="Digite seu nome completo" {...form.register("fullName")} />
//                 {form.formState.errors.fullName && (
//                   <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" type="email" placeholder="seu.email@exemplo.com" {...form.register("email")} />
//                 {form.formState.errors.email && (
//                   <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="phone">Telefone</Label>
//                 <Input
//                   id="phone"
//                   placeholder="+244 9XX XXX XXX"
//                   {...form.register("phone")}
//                   onChange={(e) => {
//                     const formatted = formatPhone(e.target.value)
//                     form.setValue("phone", formatted)
//                   }}
//                 />
//                 {form.formState.errors.phone && (
//                   <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="documentType">Tipo de Documento</Label>
//                   <Select
//                     onValueChange={(value) => form.setValue("documentType", value)}
//                     defaultValue={form.getValues("documentType")}
//                   >
//                     <SelectTrigger id="documentType">
//                       <SelectValue placeholder="Selecione o tipo de documento" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {DOCUMENT_TYPES.map((type) => (
//                         <SelectItem key={type.value} value={type.value}>
//                           {type.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {form.formState.errors.documentType && (
//                     <p className="text-sm text-destructive">{form.formState.errors.documentType.message}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="documentNumber">Nº do Documento</Label>
//                   <Input
//                     id="documentNumber"
//                     placeholder={form.watch("documentType") === "bi" ? "123456789LA123" : "999999999"}
//                     {...form.register("documentNumber")}
//                   />
//                   {form.formState.errors.documentNumber && (
//                     <p className="text-sm text-destructive">{form.formState.errors.documentNumber.message}</p>
//                   )}
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="driverLicense">Nº da Carta de Condução</Label>
//                   <Input
//                     id="driverLicense"
//                     placeholder="LD-657809"
//                     {...form.register("driverLicense")}
//                   />
//                   {form.formState.errors.driverLicense && (
//                     <p className="text-sm text-destructive">{form.formState.errors.driverLicense.message}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="experienceYears">Anos de Experiência</Label>
//                   <Input
//                     id="experienceYears"
//                     type="number"
//                     min="0"
//                     placeholder="5"
//                     {...form.register("experienceYears")}
//                   />
//                   {form.formState.errors.experienceYears && (
//                     <p className="text-sm text-destructive">{form.formState.errors.experienceYears.message}</p>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="provincia">Província</Label>
//                 <Select
//                   onValueChange={(value) => form.setValue("provincia", value)}
//                   defaultValue={form.getValues("provincia")}
//                 >
//                   <SelectTrigger id="provincia">
//                     <SelectValue placeholder="Selecione a província" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {PROVINCES.map((province) => (
//                       <SelectItem key={province.value} value={province.value}>
//                         {province.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {form.formState.errors.provincia && (
//                   <p className="text-sm text-destructive">{form.formState.errors.provincia.message}</p>
//                 )}
//               </div>
//             </div>
//           )}
//                     {step === 2 && (
//             <div className="space-y-6">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="identificationFile">
//                     Documento de Identificação ({form.watch("documentType") === "bi" ? "BI" : "NIF"}) *
//                   </Label>
//                   <div className="border border-input rounded-md p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Upload className="h-4 w-4" />
//                       <Input
//                         id="identificationFile"
//                         type="file"
//                         accept=".pdf,.jpg,.jpeg,.png"
//                         onChange={(e) => handleFileUpload(e, "identification")}
//                         className="border-0 p-0"
//                       />
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       {form.watch("documentType") === "bi" ? "Bilhete de Identidade" : "NIF"}. Formatos: PDF, JPG, PNG. Máx: 5MB
//                     </p>
//                     {identificationFile && (
//                       <div className="mt-2">
//                         <div className="flex items-center justify-between p-2 bg-muted rounded">
//                           <div className="flex items-center gap-2">
//                             <CheckCircle className="h-4 w-4 text-green-500" />
//                             <span className="text-sm">{identificationFile.name}</span>
//                           </div>
//                           <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("identification")}>
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="driverLicenseFile">Carta de Condução *</Label>
//                   <div className="border border-input rounded-md p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Upload className="h-4 w-4" />
//                       <Input
//                         id="driverLicenseFile"
//                         type="file"
//                         accept=".pdf,.jpg,.jpeg,.png"
//                         onChange={(e) => handleFileUpload(e, "driverLicense")}
//                         className="border-0 p-0"
//                       />
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Carta de condução válida. Formatos: PDF, JPG, PNG. Máx: 5MB
//                     </p>
//                     {driverLicenseFile && (
//                       <div className="mt-2">
//                         <div className="flex items-center justify-between p-2 bg-muted rounded">
//                           <div className="flex items-center gap-2">
//                             <CheckCircle className="h-4 w-4 text-green-500" />
//                             <span className="text-sm">{driverLicenseFile.name}</span>
//                           </div>
//                           <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("driverLicense")}>
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="password">Senha</Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="********"
//                       {...form.register("password")}
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                   {form.formState.errors.password && (
//                     <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
//                   )}
//                   <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword">Confirmar Senha</Label>
//                   <div className="relative">
//                     <Input
//                       id="confirmPassword"
//                       type={showConfirmPassword ? "text" : "password"}
//                       placeholder="********"
//                       {...form.register("confirmPassword")}
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     >
//                       {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                   {form.formState.errors.confirmPassword && (
//                     <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
//                   )}
//                 </div>
//               </div>

//               <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-950">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Documentos obrigatórios</h3>
//                     <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
//                       <p>
//                         Para completar seu cadastro, é necessário enviar {form.watch("documentType") === "bi" ? "o BI" : "o NIF"} e a Carta de Condução.
//                         Seus documentos serão verificados pela nossa equipe.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex justify-between mt-6">
//             {step > 1 ? (
//               <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
//                 Voltar
//               </Button>
//             ) : (
//               <div></div>
//             )}

//             {step < 2 ? (
//               <Button type="button" onClick={nextStep} disabled={isSubmitting}>
//                 Próximo
//               </Button>
//             ) : (
//               <Button 
//                 type="button" 
//                 onClick={form.handleSubmit(onSubmit)} 
//                 disabled={isSubmitting || !allDocumentsUploaded}
//               >
//                 {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
//               </Button>
//             )}
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }