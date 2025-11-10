"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CheckCircle, AlertCircle, Eye, EyeOff, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { UserService } from "../../../services/userService"
import { Progress } from "@/components/ui/progress"
import { UserProfile } from '../../../types/user';
import { VehicleService } from "@/services/vehicleService"
import { registerTransporter } from "@/services/transporterService"

// Constantes
const VEHICLE_TYPES = [
  { value: "camioneta", label: "Camioneta (até 3.5T)" },
  { value: "truck", label: "Truck (até 10T)" },
  { value: "truck_grande", label: "Truck Grande (até 30T)" },
  { value: "bitruck", label: "Bitruck" },
  { value: "carreta", label: "Carreta" },
]

const TRAILER_TYPES = [
  { value: "bau", label: "Baú" },
  { value: "sider", label: "Sider" },
  { value: "graneleiro", label: "Graneleiro" },
  { value: "tanque", label: "Tanque" },
  { value: "frigorifico", label: "Frigorífico" },
  { value: "cegonha", label: "Cegonha" },
  { value: "porta_container", label: "Porta Container" },
]

const DOCUMENT_TYPES = [
  { value: "bi", label: "Bilhete de Identidade (BI)" },
  { value: "nif", label: "Número de Identificação Fiscal (NIF)" },
  { value: "passaporte", label: "Passaporte" },
]

const PROVINCES = [
  { value: "luanda", label: "Luanda" },
  { value: "benguela", label: "Benguela" },
  { value: "huambo", label: "Huambo" },
  { value: "cabinda", label: "Cabinda" },
  { value: "malanje", label: "Malanje" },
  { value: "huila", label: "Huíla" },
  { value: "bie", label: "Bié" },
  { value: "uige", label: "Uíge" },
  { value: "cunene", label: "Cunene" },
  { value: "lunda_norte", label: "Lunda Norte" },
  { value: "lunda_sul", label: "Lunda Sul" },
  { value: "moxico", label: "Moxico" },
  { value: "namibe", label: "Namibe" },
  { value: "zaire", label: "Zaire" },
  { value: "bengo", label: "Bengo" },
  { value: "cuando_cubango", label: "Cuando Cubango" },
  { value: "cuanza_norte", label: "Cuanza Norte" },
  { value: "cuanza_sul", label: "Cuanza Sul" },
]

// Esquema de validação
const transporterFormSchema = z
  .object({
    fullName: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    phone: z.string().min(9, { message: "Telefone inválido" }),
    documentType: z.string({ required_error: "Selecione o tipo de documento" }),
    documentNumber: z.string().min(1, { message: "Número de documento é obrigatório" }),
    vehicleType: z.string({ required_error: "Selecione o tipo de veículo" }),
    licensePlate: z.string().min(1, { message: "Matrícula é obrigatória" }),
    loadCapacity: z.coerce.number().min(500, { message: "Capacidade mínima de 500kg" }),
    baseProvince: z.string({ required_error: "Selecione a província base" }),
    provincia: z.string({ required_error: "Selecione a sua província" }),
    experienceYears: z.coerce.number({ required_error: "Anos de experiência" }).optional(),
    driverLicense: z.string({ required_error: "Número da carta é obrigatório" }),
    password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string(),
    trailerType: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type TransporterFormValues = z.infer<typeof transporterFormSchema>

interface FileWithPreview extends File {
  preview?: string
}

export function TransporterRegisterForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documentFiles, setDocumentFiles] = useState<FileWithPreview[]>([])
  const [vehicleFiles, setVehicleFiles] = useState<FileWithPreview[]>([])
  const [profilePhoto, setProfilePhoto] = useState<FileWithPreview | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<TransporterFormValues>({
    resolver: zodResolver(transporterFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      documentType: "",
      documentNumber: "",
      vehicleType: "",
      licensePlate: "",
      loadCapacity: 500,
      baseProvince: "",
      password: "",
      confirmPassword: "",
      trailerType: "",
      provincia: "",
      experienceYears: 0,
      driverLicense: "",
      brand: "",
      model: ""
    },
  })

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.startsWith("244")) {
      return `+${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)} ${numbers.slice(9, 12)}`
    }
    if (numbers.length <= 9) {
      return `+244 ${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)}`
    }
    return value
  }

  // Função para formatar matrícula
  const formatLicensePlate = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`
    if (cleaned.length <= 6) return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4)}`
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`
  }

  const onSubmit = async (data: TransporterFormValues) => {
    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      // 1. Verificar se o email já existe
      /*const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", data.email)
        .maybeSingle()

      if (checkError && checkError.code !== "PGRST116") {
        throw new Error("Erro ao verificar email existente")
      }

      if (existingUser) {
        throw new Error("Este email já está em uso. Por favor, use outro email.")
      }

      setUploadProgress(20)
*/

      console.log("Olha", {
        fullName: data.fullName,
          email: data.email,
          password: data.password,
          phone: data.phone.replace(/\D/g, ""),
          profile: 'TRANSPORTER',
          documentType: data.documentType,
          documentNumber: data.documentNumber,
          provincia: data.provincia,
          experienceYears: data.experienceYears, 
          driverLicense: data.driverLicense,
          availability: true
          //isVerified: false,
      });

      // 2. Criar usuário no Supabase Auth
      const response = await registerTransporter({
        fullName: data.fullName,
          email: data.email,
          password: data.password,
          phone: data.phone.replace(/\D/g, ""),
          profile: 'TRANSPORTER',
          documentType: data.documentType,
          documentNumber: data.documentNumber,
          provincia: data.provincia,
          experienceYears: data.experienceYears, 
          driverLicense: data.driverLicense,
          availability: true,
          licensePlate: data.licensePlate
          //isVerified: false,
      })

      

      //if (authError) throw authError

      setUploadProgress(40)

      console.log("Mostrar os dados: ", response)

      // 3. Criar perfil de transportador
      if (response.user.id) {
        const vehicle = await VehicleService.create({
          brand: data.brand,
          model: data.model,
          type: data.vehicleType,
          trailerType: data.trailerType,
          licensePlate: data.licensePlate,
          loadCapacity: data.loadCapacity,
          baseProvince: data.baseProvince,
          userId: response.user.id
          //status: "pending_verification",
        })

        //if (profileError) throw profileError

        setUploadProgress(60)

       

        // 5. Upload de documentos (se houver)
        if (documentFiles.length > 0 || vehicleFiles.length > 0 || profilePhoto) {
          const uploadPromises = []

          // Upload de documentos pessoais
          for (const file of documentFiles) {
            const fileName = `${Date.now()}-${file.name}`
            /*uploadPromises.push(
              supabase.storage.from("documents").upload(`${authData.user.id}/personal/${fileName}`, file),
            )*/
          }

          // Upload de documentos do veículo
          for (const file of vehicleFiles) {
            const fileName = `${Date.now()}-${file.name}`
            /*uploadPromises.push(
              supabase.storage.from("documents").upload(`${authData.user.id}/vehicle/${fileName}`, file),
            )*/
          }

          // Upload da foto de perfil
          if (profilePhoto) {
            const fileName = `${Date.now()}-profile.${profilePhoto.name.split(".").pop()}`
            /*uploadPromises.push(
              supabase.storage.from("profiles").upload(`${authData.user.id}/${fileName}`, profilePhoto),
            )*/
          }

          //await Promise.all(uploadPromises)
        }

        setUploadProgress(100)

        toast({
          title: "Cadastro realizado com sucesso!",
          //description: "Verifique seu email para confirmar sua conta.",
        })

        // Redirecionar para página de confirmação
        setTimeout(() => {
          router.push("/register/confirmation")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error)
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Ocorreu um erro ao processar seu cadastro. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "document" | "vehicle" | "profile") => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as FileWithPreview[]

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          file.preview = URL.createObjectURL(file)
        }
      })

      if (type === "document") {
        setDocumentFiles(files)
      } else if (type === "vehicle") {
        setVehicleFiles(files)
      } else if (type === "profile" && files[0]) {
        setProfilePhoto(files[0])
      }
    }
  }

  const removeFile = (index: number, type: "document" | "vehicle") => {
    if (type === "document") {
      const newFiles = [...documentFiles]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      setDocumentFiles(newFiles)
    } else if (type === "vehicle") {
      const newFiles = [...vehicleFiles]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      setVehicleFiles(newFiles)
    }
  }

  const removeProfilePhoto = () => {
    if (profilePhoto?.preview) {
      URL.revokeObjectURL(profilePhoto.preview)
    }
    setProfilePhoto(null)
  }

  const nextStep = async () => {
    const fieldsToValidate =
      step === 1
        ? ["fullName", "email", "phone", "documentType", "documentNumber"]
        : ["vehicleType", "licensePlate", "loadCapacity", "baseProvince", "password", "confirmPassword"]

    const isValid = await form.trigger(fieldsToValidate as any)
    if (isValid) setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  const needsTrailer = ["truck", "truck_grande", "bitruck", "carreta"].includes(form.watch("vehicleType"))

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Cadastro de Transportador</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para se cadastrar como transportador na plataforma KamiLink
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitting && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Processando cadastro...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <div className={`flex items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    step >= 1 ? "bg-primary text-primary-foreground" : "bg-primary/10"
                  }`}
                >
                  <span className="font-medium">1</span>
                </div>
                <span>Dados Pessoais</span>
              </div>
              <div className="border-t border-border w-16 self-center mx-2"></div>
              <div className={`flex items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    step >= 2 ? "bg-primary text-primary-foreground" : "bg-primary/10"
                  }`}
                >
                  <span className="font-medium">2</span>
                </div>
                <span>Dados do Veículo</span>
              </div>
              <div className="border-t border-border w-16 self-center mx-2"></div>
              <div className={`flex items-center ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    step >= 3 ? "bg-primary text-primary-foreground" : "bg-primary/10"
                  }`}
                >
                  <span className="font-medium">3</span>
                </div>
                <span>Documentos</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input id="fullName" placeholder="Digite seu nome completo" {...form.register("fullName")} />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu.email@exemplo.com" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="+244 9XX XXX XXX"
                  {...form.register("phone")}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value)
                    form.setValue("phone", formatted)
                  }}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Tipo de Documento</Label>
                  <Select
                    onValueChange={(value) => form.setValue("documentType", value)}
                    defaultValue={form.getValues("documentType")}
                  >
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.documentType && (
                    <p className="text-sm text-destructive">{form.formState.errors.documentType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentNumber">Nº do Documento</Label>
                  <Input
                    id="documentNumber"
                    placeholder={form.watch("documentType") === "bi" ? "123456789LA123" : "999999999"}
                    {...form.register("documentNumber")}
                  />
                  {form.formState.errors.documentNumber && (
                    <p className="text-sm text-destructive">{form.formState.errors.documentNumber.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverLicense">Nº da Carta de Condução</Label>
                  <Input
                    id="driverLicense"
                    placeholder={"LD-657809"}
                    {...form.register("driverLicense")}
                  />
                  {form.formState.errors.driverLicense && (
                    <p className="text-sm text-destructive">{form.formState.errors.driverLicense.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Anos de Experiência</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    placeholder={"5"}
                    {...form.register("experienceYears")}
                  />
                  {form.formState.errors.experienceYears && (
                    <p className="text-sm text-destructive">{form.formState.errors.experienceYears.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provincia">Província Base</Label>
                <Select
                  onValueChange={(value) => form.setValue("provincia", value)}
                  defaultValue={form.getValues("provincia")}
                >
                  <SelectTrigger id="provincia">
                    <SelectValue placeholder="Selecione a província" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((province) => (
                      <SelectItem key={province.value} value={province.value}>
                        {province.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.baseProvince && (
                  <p className="text-sm text-destructive">{form.formState.errors.baseProvince.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca do Veículo</Label>
                  <Input
                    id="brand"
                    placeholder={"Toyota, Hyunda, Suzuki..."}
                    {...form.register("brand")}
                  />
                  {form.formState.errors.brand && (
                    <p className="text-sm text-destructive">{form.formState.errors.brand.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modelo do Veículo</Label>
                  <Input
                    id="model"
                    placeholder={"i10, Santa Fé..."}
                    {...form.register("model")}
                  />
                  {form.formState.errors.model && (
                    <p className="text-sm text-destructive">{form.formState.errors.model.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleType">Tipo de Veículo</Label>
                <Select
                  onValueChange={(value) => form.setValue("vehicleType", value)}
                  defaultValue={form.getValues("vehicleType")}
                >
                  <SelectTrigger id="vehicleType">
                    <SelectValue placeholder="Selecione o tipo de veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.vehicleType && (
                  <p className="text-sm text-destructive">{form.formState.errors.vehicleType.message}</p>
                )}
              </div>

              {needsTrailer && (
                <div className="space-y-2">
                  <Label htmlFor="trailerType">Tipo de Reboque</Label>
                  <Select
                    onValueChange={(value) => form.setValue("trailerType", value)}
                    defaultValue={form.getValues("trailerType")}
                  >
                    <SelectTrigger id="trailerType">
                      <SelectValue placeholder="Selecione o tipo de reboque" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRAILER_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="licensePlate">Matrícula</Label>
                <Input
                  id="licensePlate"
                  placeholder="LD-01-23-AB"
                  {...form.register("licensePlate")}
                  onChange={(e) => {
                    const formatted = formatLicensePlate(e.target.value)
                    form.setValue("licensePlate", formatted)
                  }}
                />
                {form.formState.errors.licensePlate && (
                  <p className="text-sm text-destructive">{form.formState.errors.licensePlate.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Formato: LD-01-23-AB</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loadCapacity">Capacidade de Carga (kg)</Label>
                <Input
                  id="loadCapacity"
                  type="number"
                  min="500"
                  placeholder="Capacidade em kg"
                  {...form.register("loadCapacity", { valueAsNumber: true })}
                />
                {form.formState.errors.loadCapacity && (
                  <p className="text-sm text-destructive">{form.formState.errors.loadCapacity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseProvince">Província Base</Label>
                <Select
                  onValueChange={(value) => form.setValue("baseProvince", value)}
                  defaultValue={form.getValues("baseProvince")}
                >
                  <SelectTrigger id="baseProvince">
                    <SelectValue placeholder="Selecione a província base" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((province) => (
                      <SelectItem key={province.value} value={province.value}>
                        {province.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.baseProvince && (
                  <p className="text-sm text-destructive">{form.formState.errors.baseProvince.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      {...form.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      {...form.register("confirmPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documentFiles">Documentos Pessoais (BI, NIF)</Label>
                  <div className="border border-input rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="h-4 w-4" />
                      <Input
                        id="documentFiles"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, "document")}
                        className="border-0 p-0"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: PDF, JPG, PNG. Tamanho máximo: 5MB por arquivo.
                    </p>
                    {documentFiles.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm font-medium">Arquivos selecionados:</p>
                        {documentFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index, "document")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleFiles">Documentos do Veículo</Label>
                  <div className="border border-input rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="h-4 w-4" />
                      <Input
                        id="vehicleFiles"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, "vehicle")}
                        className="border-0 p-0"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Documentos do veículo, certificados, etc. Formatos aceitos: PDF, JPG, PNG.
                    </p>
                    {vehicleFiles.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm font-medium">Arquivos selecionados:</p>
                        {vehicleFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index, "vehicle")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profilePhoto">Foto do Perfil</Label>
                  <div className="border border-input rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="h-4 w-4" />
                      <Input
                        id="profilePhoto"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, "profile")}
                        className="border-0 p-0"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Sua foto para o perfil. Formatos aceitos: JPG, PNG.</p>
                    {profilePhoto && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{profilePhoto.name}</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={removeProfilePhoto}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-950">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Verificação de documentos</h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                      <p>
                        Seus documentos serão verificados pela nossa equipe antes da aprovação final da sua conta. Este
                        processo pode levar até 48 horas úteis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                Voltar
              </Button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <Button type="button" onClick={nextStep} disabled={isSubmitting}>
                Próximo
              </Button>
            ) : (
              <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
