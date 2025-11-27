"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Control } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle, Loader2, Upload, AlertTriangle, MapPin, Calendar, IdCard, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { UserService } from "@/services/userService"
import api from "@/services/api"
import { ImageService } from "@/services/imageService"

// Esquemas de validação atualizados para o backend real
const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(9, {
    message: "Telefone deve ter pelo menos 9 dígitos.",
  }),
  documentNumber: z.string().min(1, {
    message: "Número do documento é obrigatório.",
  }),
  provincia: z.string().min(1, {
    message: "Província é obrigatória.",
  }),
  experienceYears: z.coerce.number().min(0).optional(),
  driverLicense: z.string().optional(),
})

const addressFormSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
})

const securityFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Senha atual é obrigatória.",
    }),
    newPassword: z.string().min(8, {
      message: "Nova senha deve ter pelo menos 8 caracteres.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirmar senha deve ter pelo menos 8 caracteres.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })

// Tipos baseados no backend real - ATUALIZADA
interface UserProfileData {
  id: string
  email: string
  profile: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
  person?: {
    id: string
    fullName: string
    documentNumber: string
    phone?: string
    provincia: string
    userId: string
    createdAt: string
    updatedAt: string
  }
  client?: {
    id: string
    userId: string
    accountType: string
    companyName?: string | null
    nif?: string | null
    createdAt: string
    updatedAt: string
  }
  transporter?: {
    id: string
    userId: string
    experienceYears?: number
    licensePlate: string
    driverLicense: string
    availability: boolean
    createdAt: string
    updatedAt: string
  }
  images?: Array<{
    id: string
    type: string
    documentType: string | null
    documentTypeTransporter: string | null
    path: string
    filename: string
    userId: string
    vehicleId: string | null
    freightId: string | null
    createdAt: string
    updatedAt: string
  }>
}

// Províncias de Angola
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

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [userData, setUserData] = useState<UserProfileData | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const { user, refreshProfile } = useAuth()
  const { toast } = useToast()

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Forms atualizados para o backend real
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      documentNumber: "",
      provincia: "",
      experienceYears: 0,
      driverLicense: "",
    },
  })

  const addressForm = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
    },
  })

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Buscar dados reais do backend
  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) {
        setIsLoadingData(false)
        return
      }

      try {
        setIsLoadingData(true)
        console.log("Buscando dados do usuário do backend:", user.id)

        // Buscar dados completos do usuário
        const userProfile = await UserService.findById(user.id)
        console.log("Dados recebidos do backend:", userProfile)

        setUserData(userProfile)

        // Preencher formulário com dados reais
        if (userProfile) {
          profileForm.reset({
            fullName: userProfile.person?.fullName || "",
            email: userProfile.email || "",
            phone: userProfile.person?.phone || "",
            documentNumber: userProfile.person?.documentNumber || "",
            provincia: userProfile.person?.provincia || "",
            experienceYears: userProfile.transporter?.experienceYears || 0,
            driverLicense: userProfile.transporter?.driverLicense || "",
          })

          // Preencher dados de endereço (estáticos por enquanto)
          addressForm.reset({
            address: "",
            city: userProfile.person?.provincia || "", // Usar província como cidade
            state: userProfile.person?.provincia || "",
            postalCode: "",
          })
        }

      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os dados do perfil.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchUserData()
  }, [user])

  // Submit do perfil - atualizar dados no backend
  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Aqui você precisará criar um endpoint de update no backend
      // Por enquanto, vamos apenas simular
      console.log("Atualizando perfil com:", values)
      
      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Atualizar estado local
      setUserData(prev => prev ? {
        ...prev,
        email: values.email,
        person: {
          ...prev.person!,
          fullName: values.fullName,
          phone: values.phone,
          documentNumber: values.documentNumber,
          provincia: values.provincia,
        },
        transporter: prev.transporter ? {
          ...prev.transporter,
          experienceYears: values.experienceYears,
          driverLicense: values.driverLicense || "",
        } : undefined
      } : null)

      setIsSuccess(true)
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      })

      setTimeout(() => setIsSuccess(false), 3000)

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // No componente, adicione estas funções de helper:
const getProfileImageUrl = (): string | null => {
  if (!userData?.images) return null
  const profileImage = userData.images.find(img => img.type === 'PROFILE_IMAGE')
  return profileImage 
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${profileImage.id}/view`
    : null
}

const getIdentificationImageUrl = (): string | null => {
  if (!userData?.images || userData.profile !== 'TRANSPORTER') return null
  const identificationImage = userData.images.find(img => 
    img.documentTypeTransporter === 'BI' || img.documentTypeTransporter === 'NIF'
  )
  return identificationImage 
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${identificationImage.id}/view`
    : null
}

const getDriverLicenseImageUrl = (): string | null => {
  if (!userData?.images || userData.profile !== 'TRANSPORTER') return null
  const driverLicenseImage = userData.images.find(img => 
    img.documentTypeTransporter === 'DRIVER_LICENSE'
  )
  return driverLicenseImage 
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${driverLicenseImage.id}/view`
    : null
}

// Função para verificar se documento existe (mesmo sem URL carregada)
const hasIdentificationDocument = (): boolean => {
  return !!userData?.images?.some(img => 
    img.documentTypeTransporter === 'BI' || img.documentTypeTransporter === 'NIF'
  )
}

const hasDriverLicenseDocument = (): boolean => {
  return !!userData?.images?.some(img => 
    img.documentTypeTransporter === 'DRIVER_LICENSE'
  )
}

// Handler para upload de foto de perfil - SIMPLIFICADO
async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0]
  if (!file || !user?.id) return

  // Validações básicas
  if (!file.type.startsWith('image/')) {
    toast({
      title: "Erro",
      description: "Apenas imagens são permitidas para foto de perfil.",
      variant: "destructive",
    })
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: "Erro",
      description: "A imagem deve ter no máximo 5MB.",
      variant: "destructive",
    })
    return
  }

  setIsUploadingPhoto(true)

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'PROFILE_IMAGE')
    formData.append('userId', user.id)

    // Fazer upload
    // await api.post('/uploads', formData, { noJson: true })
     await ImageService.uploadProfileImage(file)

    toast({
      title: "Sucesso",
      description: "Foto de perfil atualizada com sucesso!",
    })

    // Recarregar dados para mostrar a nova imagem
    const updatedProfile = await UserService.findById(user.id)
    setUserData(updatedProfile)

  } catch (error) {
    console.error("Erro ao fazer upload da foto:", error)
    toast({
      title: "Erro",
      description: "Não foi possível atualizar a foto de perfil.",
      variant: "destructive",
    })
  } finally {
    setIsUploadingPhoto(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }
}

const hasProfileImage = (): boolean => {
  return !!userData?.images?.some(img => img.type === 'PROFILE_IMAGE')
}

  // Handlers para outros forms (mantidos como estavam)
  async function onAddressSubmit(values: z.infer<typeof addressFormSchema>) {
    // Implementação similar - manter endereço no frontend por enquanto
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSuccess(true)
      toast({ title: "Sucesso", description: "Endereço atualizado com sucesso!" })
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao atualizar endereço.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  async function onSecuritySubmit(values: z.infer<typeof securityFormSchema>) {
    // Implementação de segurança - manter como estava
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      securityForm.reset()
      setIsSuccess(true)
      toast({ title: "Sucesso", description: "Senha atualizada com sucesso!" })
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao atualizar senha.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // Gerar iniciais para avatar
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getProfileType = () => {
    if (!userData) return "Usuário"
    return userData.profile === "TRANSPORTER" ? "Transportador" : "Cliente"
  }

  if (isLoadingData) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando dados do perfil...</span>
        </div>
      </div>
    )
  }
    return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o painel
        </Link>
        <h1 className="text-2xl font-bold mt-4">Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar com informações reais */}
        <div className="md:w-1/3">
          <Card>
            <CardContent className="p-6">
             <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage 
                    src={getProfileImageUrl() || ""} 
                    alt={`Foto de ${userData?.person?.fullName || 'usuário'}`}
                    onError={(e) => {
                      // Fallback para initials se a imagem não carregar
                      (e.target as HTMLImageElement).style.display = "none"
                    }} 
                  />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(userData?.person?.fullName || "Usuário")}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-bold text-center">
                  {userData?.person?.fullName || "Usuário"}
                </h3>
                
                <div className="flex items-center gap-2 mt-1 mb-3">
                  <Badge variant={userData?.isActive ? "default" : "secondary"}>
                    {userData?.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                  <Badge variant="outline">
                    {getProfileType()}
                  </Badge>
                </div>

                <div className="w-full space-y-3">
                  {/* Informações reais do backend */}
                  {/* <div className="flex items-start gap-3 text-sm">
                    <IdCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Documento</div>
                      <div>{userData?.person?.documentNumber || "Não informado"}</div>
                    </div>
                  </div> */}
                   {userData?.profile === "TRANSPORTER" && (
          <div className="w-full mt-4 pt-4 border-t">
            <h4 className="font-medium text-sm mb-3">Documentos</h4>
            
            <div className="space-y-3">
              {/* BI/NIF */}
              {(getIdentificationImageUrl() || hasIdentificationDocument()) && (
                <div className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <IdCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {userData.images?.find(img => 
                        img.documentTypeTransporter === 'BI' || img.documentTypeTransporter === 'NIF'
                      )?.documentTypeTransporter === 'BI' ? 'Bilhete de Identidade' : 'NIF'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getIdentificationImageUrl() ? 'Documento carregado' : 'Documento enviado'}
                    </div>
                  </div>
                  {getIdentificationImageUrl() && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="flex-shrink-0"
                    >
                      <a href={getIdentificationImageUrl()!} target="_blank" rel="noopener noreferrer">
                        Visualizar
                      </a>
                    </Button>
                  )}
                </div>
              )}

              {/* Carta de Condução */}
              {(getDriverLicenseImageUrl() || hasDriverLicenseDocument()) && (
                <div className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">Carta de Condução</div>
                    <div className="text-xs text-muted-foreground">
                      {getDriverLicenseImageUrl() ? 'Documento carregado' : 'Documento enviado'}
                    </div>
                  </div>
                  {getDriverLicenseImageUrl() && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="flex-shrink-0"
                    >
                      <a href={getDriverLicenseImageUrl()!} target="_blank" rel="noopener noreferrer">
                        Visualizar
                      </a>
                    </Button>
                  )}
                </div>
              )}

                {/* Mensagem se não há documentos */}
                {!hasIdentificationDocument() && !hasDriverLicenseDocument() && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Nenhum documento enviado ainda
                  </div>
                )}
              </div>
            </div>
          )}

                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Localização</div>
                      <div>{userData?.person?.provincia ? `${userData.person.provincia}, Angola` : "Não informado"}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Membro desde</div>
                      <div>
                        {userData?.createdAt
                          ? new Date(userData.createdAt).toLocaleDateString("pt-AO", {
                              year: "numeric",
                              month: "long",
                            })
                          : "Não informado"}
                      </div>
                    </div>
                  </div>

                  {/* Informações específicas do transportador */}
                  {/* {userData?.transporter && (
                    <>
                      <div className="pt-2 border-t">
                        <div className="flex items-start gap-3 text-sm">
                          <div>
                            <div className="text-muted-foreground">Carta de Condução</div>
                            <div>{userData.transporter.driverLicense || "Não informado"}</div>
                          </div>
                        </div>
                      </div>

                      {userData.transporter.experienceYears && (
                        <div className="flex items-start gap-3 text-sm">
                          <div>
                            <div className="text-muted-foreground">Experiência</div>
                            <div>{userData.transporter.experienceYears} anos</div>
                          </div>
                        </div>
                      )}
                    </>
                  )} */}
                </div>

                {/* Upload de foto (manter funcionalidade) */}
               <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
             <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {getProfileImageUrl() ? "Alterar Foto" : "Adicionar Foto"}
                  </>
                )}
              </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <div className="md:w-2/3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              {/* <TabsTrigger value="address">Endereço</TabsTrigger> */}
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>Atualize suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                      disabled
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                        disabled
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                        disabled
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                        disabled
                          control={profileForm.control}
                          name="documentNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nº do BI</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                        disabled
                          control={profileForm.control}
                          name="provincia"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Província</FormLabel>
                              <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Campos específicos para transportadores */}
                      {userData?.profile === "TRANSPORTER" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                          disabled
                            control={profileForm.control}
                            name="driverLicense"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Carta de Condução</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                          disabled
                            control={profileForm.control}
                            name="experienceYears"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Anos de Experiência</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" min="0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          
                        </div>
                      )}

                      {/* endereço */}
                      

                      <div className="flex justify-end">
                        {isSuccess && (
                          <div className="flex items-center text-green-600 mr-4">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span>Salvo com sucesso!</span>
                          </div>
                        )}
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            "Salvar Alterações"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Os outros tabs (address e security) mantêm a mesma estrutura */}
            <TabsContent value="address">
              {/* Manter implementação existente */}
               {/* <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                  <CardDescription>Atualize seu endereço</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                      <FormField
                        control={addressForm.control}
                        name="address"
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
                          control={addressForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cidade</FormLabel>
                              <FormControl>
                                <Input placeholder="Cidade" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addressForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Província</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="BG">Bengo</SelectItem>
                                    <SelectItem value="BL">Benguela</SelectItem>
                                    <SelectItem value="BI">Bié</SelectItem>
                                    <SelectItem value="CA">Cabinda</SelectItem>
                                    <SelectItem value="CC">Cuando Cubango</SelectItem>
                                    <SelectItem value="CN">Cuanza Norte</SelectItem>
                                    <SelectItem value="CS">Cuanza Sul</SelectItem>
                                    <SelectItem value="CU">Cunene</SelectItem>
                                    <SelectItem value="HM">Huambo</SelectItem>
                                    <SelectItem value="HL">Huíla</SelectItem>
                                    <SelectItem value="LN">Luanda</SelectItem>
                                    <SelectItem value="LNO">Lunda Norte</SelectItem>
                                    <SelectItem value="LSU">Lunda Sul</SelectItem>
                                    <SelectItem value="ML">Malanje</SelectItem>
                                    <SelectItem value="MX">Moxico</SelectItem>
                                    <SelectItem value="NM">Namibe</SelectItem>
                                    <SelectItem value="UG">Uíge</SelectItem>
                                    <SelectItem value="ZA">Zaire</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={addressForm.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código Postal</FormLabel>
                            <FormControl>
                              <Input placeholder="Código Postal" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        {isSuccess && (
                          <div className="flex items-center text-green-600 mr-4">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span>Salvo com sucesso!</span>
                          </div>
                        )}
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            "Salvar Alterações"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card> */}
            </TabsContent>

            <TabsContent value="security">
              {/* Manter implementação existente */}
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Atualize sua senha</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                      <FormField
                        disabled
                        control={securityForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha Atual</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled
                        control={securityForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                              A senha deve ter pelo menos 8 caracteres e incluir letras e números.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled
                        control={securityForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        {isSuccess && (
                          <div className="flex items-center text-green-600 mr-4">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span>Senha alterada com sucesso!</span>
                          </div>
                        )}
                        <Button type="submit" disabled>
                        {/* <Button type="submit" disabled={isLoading}> */}
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Alterando...
                            </>
                          ) : (
                            "Alterar Senha"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}