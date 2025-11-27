// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import Link from "next/link"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ArrowLeft, CheckCircle, Loader2, Upload, AlertTriangle } from "lucide-react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useAuth } from "@/components/auth-provider"
// import { useToast } from "@/components/ui/use-toast"

// const profileFormSchema = z.object({
//   name: z.string().min(2, {
//     message: "Nome deve ter pelo menos 2 caracteres.",
//   }),
//   email: z.string().email({
//     message: "Email inválido.",
//   }),
//   phone: z.string().min(10, {
//     message: "Telefone deve ter pelo menos 10 dígitos.",
//   }),
//   companyName: z.string().optional(),
//   taxId: z.string().optional(),
//   bio: z.string().optional(),
// })

// const addressFormSchema = z.object({
//   address: z.string().min(5, {
//     message: "Endereço deve ter pelo menos 5 caracteres.",
//   }),
//   city: z.string().min(2, {
//     message: "Cidade é obrigatória.",
//   }),
//   state: z.string().min(2, {
//     message: "Província é obrigatória.",
//   }),
//   postalCode: z.string().optional(),
// })

// const securityFormSchema = z
//   .object({
//     currentPassword: z.string().min(1, {
//       message: "Senha atual é obrigatória.",
//     }),
//     newPassword: z.string().min(8, {
//       message: "Nova senha deve ter pelo menos 8 caracteres.",
//     }),
//     confirmPassword: z.string().min(8, {
//       message: "Confirmar senha deve ter pelo menos 8 caracteres.",
//     }),
//   })
//   .refine((data) => data.newPassword === data.confirmPassword, {
//     message: "As senhas não coincidem.",
//     path: ["confirmPassword"],
//   })

// export default function ProfilePage() {
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSuccess, setIsSuccess] = useState(false)
//   const [userData, setUserData] = useState<any>(null)
//   const [userAddress, setUserAddress] = useState<any>(null)
//   const [isLoadingData, setIsLoadingData] = useState(true)
//   const [availableColumns, setAvailableColumns] = useState<string[]>([])
//   const [schemaWarnings, setSchemaWarnings] = useState<string[]>([])
//   const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
//   const [photoUrl, setPhotoUrl] = useState<string | null>(null)
//   const { user, userProfile, refreshProfile } = useAuth()
//   const { toast } = useToast()

//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const profileForm = useForm<z.infer<typeof profileFormSchema>>({
//     resolver: zodResolver(profileFormSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//       companyName: "",
//       taxId: "",
//       bio: "",
//     },
//   })

//   const addressForm = useForm<z.infer<typeof addressFormSchema>>({
//     resolver: zodResolver(addressFormSchema),
//     defaultValues: {
//       address: "",
//       city: "",
//       state: "",
//       postalCode: "",
//     },
//   })

//   const securityForm = useForm<z.infer<typeof securityFormSchema>>({
//     resolver: zodResolver(securityFormSchema),
//     defaultValues: {
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     },
//   })


//   // Fetch user data from Supabase
//   useEffect(() => {
//     async function fetchUserData() {
//       if (!user) {
//         setIsLoadingData(false)
//         return
//       }

//       try {
//         setIsLoadingData(true)
//         console.log("Buscando dados do usuário:", user.id)

//         // Usar o perfil do contexto de autenticação se disponível
//         if (userProfile) {
//           console.log("Usando perfil do contexto de autenticação:", userProfile)
//           setUserData(userProfile)

//           // Set photo URL if available
//           if (userProfile.avatarUrl) {
//             setPhotoUrl(userProfile.avatarUrl)
//           }

//           // Set form values dinamicamente
//           const formData: any = {
//             name: userProfile.person.fullName || "",
//             email: user.email || "",
//             phone: user.phone || "",
//           }

//           // Adiciona campos opcionais apenas se existirem na tabela
//           if (availableColumns.includes("company_name")) {
//             formData.companyName = userProfile.companyName || ""
//           }
//           if (availableColumns.includes("tax_id")) {
//             formData.taxId = userProfile.tax_id || ""
//           }
//           if (availableColumns.includes("bio")) {
//             formData.bio = userProfile.bio || ""
//           }

//           profileForm.reset(formData)
//         } 

//         // Fetch user address if available
//         /*if (userData?.address_id) {
//           const { data: addressData, error: addressError } = await supabase
//             .from("addresses")
//             .select("*")
//             .eq("id", userData.address_id)
//             .single()

//           if (!addressError && addressData) {
//             setUserAddress(addressData)

//             addressForm.reset({
//               address: addressData.street_address || "",
//               city: addressData.city || "",
//               state: addressData.state || "",
//               postalCode: addressData.postal_code || "",
//             })
//           }
//         }*/
//       } catch (error) {
//         console.error("Erro ao buscar dados do usuário:", error)
//         toast({
//           title: "Erro",
//           description: "Ocorreu um erro ao carregar os dados do perfil.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoadingData(false)
//       }
//     }

//       fetchUserData()
//     }, [user, userProfile])

//   async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
//     const file = event.target.files?.[0]
//     if (!file || !user) return

//     // Validate file
//     const validation = ""//validateFile(file)
//     if (!validation.valid) {
//       toast({
//         title: "Erro",
//         description: validation.message,
//         variant: "destructive",
//       })
//       return
//     }

//     setIsUploadingPhoto(true)

//     try {
//       // Upload file to Supabase Storage
//       const uploadResult = ""/*await uploadFile(file, "avatars", "profile-photos")*/

//       // Update user profile with new avatar URL
//       const updateData: Record<string, any> = {
//         avatar_url: uploadResult.url,
//         updated_at: new Date().toISOString(),
//       }

//       //await dynamicDB.dynamicUpdate("users", updateData, { id: user.id })

//       // Update local state
//       setPhotoUrl(uploadResult.url)
//       setUserData({
//         ...userData,
//         avatar_url: uploadResult.url,
//       })

//       toast({
//         title: "Sucesso",
//         description: "Foto de perfil atualizada com sucesso!",
//       })

//       // Refresh user data in auth context
//       if (refreshProfile) {
//         await refreshProfile()
//       }
//     } catch (error) {
//       console.error("Erro ao fazer upload da foto:", error)
//       toast({
//         title: "Erro",
//         description: "Não foi possível atualizar a foto de perfil.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsUploadingPhoto(false)
//       // Reset file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ""
//       }
//     }
//   }

//   async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
//     if (!user) {
//       toast({
//         title: "Erro",
//         description: "Usuário não autenticado.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsLoading(true)
//     console.log("Atualizando perfil com valores:", values)

//     try {
//       // Prepara dados dinamicamente baseado nas colunas disponíveis
//       const updateData: Record<string, any> = {
//         name: values.name,
//         email: values.email,
//         phone: values.phone,
//         updated_at: new Date().toISOString(),
//       }

//       // Adiciona campos opcionais apenas se existirem na tabela
//       if (availableColumns.includes("company_name") && values.companyName) {
//         updateData.company_name = values.companyName
//       }
//       if (availableColumns.includes("tax_id") && values.taxId) {
//         updateData.tax_id = values.taxId
//       }
//       if (availableColumns.includes("bio") && values.bio) {
//         updateData.bio = values.bio
//       }

//       console.log("Dados a serem atualizados:", updateData)

//       // Verifica se o usuário existe

//       // Show success message
//       setIsSuccess(true)
//       toast({
//         title: "Sucesso",
//         description: "Perfil atualizado com sucesso!",
//       })

//       // Refresh user data in auth context
//       if (refreshProfile) {
//         await refreshProfile()
//       }

//       setTimeout(() => {
//         setIsSuccess(false)
//       }, 3000)
//     } catch (error) {
//       console.error("Erro ao atualizar perfil:", error)
//       toast({
//         title: "Erro",
//         description: `Ocorreu um erro ao atualizar o perfil: ${error.message}`,
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   async function onAddressSubmit(values: z.infer<typeof addressFormSchema>) {
//     if (!user) return

//     setIsLoading(true)
//     console.log("Atualizando endereço com valores:", values)

//     try {
//       const addressData = {
//         user_id: user.id,
//         street_address: values.address,
//         city: values.city,
//         state: values.state,
//         postal_code: values.postalCode,
//         updated_at: new Date().toISOString(),
//       }

//       let addressId = userData?.address_id

//       // Show success message
//       setIsSuccess(true)
//       toast({
//         title: "Sucesso",
//         description: "Endereço atualizado com sucesso!",
//       })

//       setTimeout(() => {
//         setIsSuccess(false)
//       }, 3000)
//     } catch (error) {
//       console.error("Erro ao atualizar endereço:", error)
//       toast({
//         title: "Erro",
//         description: "Ocorreu um erro ao atualizar o endereço.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   async function onSecuritySubmit(values: z.infer<typeof securityFormSchema>) {

//     setIsLoading(true)

//     try {
//       // Update password
//       /*const { error } = await supabase.auth.updateUser({
//         password: values.newPassword,
//       })*/

//       if (error) {
//         console.error("Erro ao atualizar senha:", error)
//         toast({
//           title: "Erro",
//           description: "Não foi possível atualizar a senha.",
//           variant: "destructive",
//         })
//         return
//       }

//       // Reset form
//       securityForm.reset({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       })

//       // Show success message
//       setIsSuccess(true)
//       toast({
//         title: "Sucesso",
//         description: "Senha atualizada com sucesso!",
//       })

//       setTimeout(() => {
//         setIsSuccess(false)
//       }, 3000)
//     } catch (error) {
//       console.error("Erro ao atualizar senha:", error)
//       toast({
//         title: "Erro",
//         description: "Ocorreu um erro ao atualizar a senha.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Generate avatar fallback from user name
//   const getInitials = (name: string) => {
//     if (!name) return "U"
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2)
//   }

//   if (isLoadingData) {
//     return (
//       <div className="container max-w-4xl mx-auto py-10 px-4">
//         <div className="flex justify-center items-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <span className="ml-2">Carregando dados do perfil...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container max-w-4xl mx-auto py-10 px-4">
//       <div className="mb-8">
//         <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Voltar para o painel
//         </Link>
//         <h1 className="text-2xl font-bold mt-4">Perfil</h1>
//         <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
//       </div>

//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="md:w-1/3">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex flex-col items-center">
//                 <Avatar className="h-24 w-24 mb-4">
//                   <AvatarImage src={userProfile?.avatarUrl || ""} alt="Avatar do usuário" 
//                   onError={(e) => {
//                       // Hide the image if it fails to load
//                       (e.target as HTMLImageElement).style.display = "none";
//                     }} />
//                   <AvatarFallback>{getInitials(userData?.person.fullName || "")}</AvatarFallback>
//                 </Avatar>
//                 <h3 className="text-xl font-bold">{userData?.person.fullName || "Usuário"}</h3>
//                 <p className="text-muted-foreground mb-4">
//                   {userData?.user_type === "client" ? "Cliente" : "Transportador"}
//                 </p>
//                 <div className="w-full space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Email</span>
//                     <span>{userData?.email || "Não informado"}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Telefone</span>
//                     <span>{userData?.phone || "Não informado"}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Localização</span>
//                     <span>{userAddress?.city ? `${userAddress.city}, Angola` : "Não informado"}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Membro desde</span>
//                     <span>
//                       {userData?.created_at
//                         ? new Date(userData.created_at).toLocaleDateString("pt-AO", {
//                             year: "numeric",
//                             month: "long",
//                           })
//                         : "Não informado"}
//                     </span>
//                   </div>
//                 </div>
//                 <>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handlePhotoUpload}
//                     className="hidden"
//                   />
//                   <Button
//                     variant="outline"
//                     className="w-full mt-4"
//                     onClick={() => fileInputRef.current?.click()}
//                     disabled={isUploadingPhoto}
//                   >
//                     {isUploadingPhoto ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Enviando...
//                       </>
//                     ) : (
//                       <>
//                         <Upload className="h-4 w-4 mr-2" />
//                         Alterar Foto
//                       </>
//                     )}
//                   </Button>
//                 </>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="md:w-2/3">
//           <Tabs defaultValue="profile" className="w-full">
//             <TabsList className="grid w-full grid-cols-3 mb-6">
//               <TabsTrigger value="profile">Perfil</TabsTrigger>
//               <TabsTrigger value="address">Endereço</TabsTrigger>
//               <TabsTrigger value="security">Segurança</TabsTrigger>
//             </TabsList>

//             <TabsContent value="profile">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Informações do Perfil</CardTitle>
//                   <CardDescription>Atualize suas informações pessoais</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <Form {...profileForm}>
//                     <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
//                       <FormField
//                         control={profileForm.control}
//                         name="name"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Nome Completo</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <FormField
//                           control={profileForm.control}
//                           name="email"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Email</FormLabel>
//                               <FormControl>
//                                 <Input {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={profileForm.control}
//                           name="phone"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Telefone</FormLabel>
//                               <FormControl>
//                                 <Input {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>

//                       {/* Campos condicionais baseados na estrutura da tabela */}
//                       {availableColumns.includes("company_name") && (
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <FormField
//                             control={profileForm.control}
//                             name="companyName"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Nome da Empresa</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                           {availableColumns.includes("tax_id") && (
//                             <FormField
//                               control={profileForm.control}
//                               name="taxId"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>NIF</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           )}
//                         </div>
//                       )}

//                       {availableColumns.includes("bio") && (
//                         <FormField
//                           control={profileForm.control}
//                           name="bio"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Biografia</FormLabel>
//                               <FormControl>
//                                 <Textarea className="resize-none" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       )}

//                       <div className="flex justify-end">
//                         {isSuccess && (
//                           <div className="flex items-center text-green-600 mr-4">
//                             <CheckCircle className="h-4 w-4 mr-2" />
//                             <span>Salvo com sucesso!</span>
//                           </div>
//                         )}
//                         <Button type="submit" disabled={isLoading || !user}>
//                           {isLoading ? (
//                             <>
//                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                               Salvando...
//                             </>
//                           ) : (
//                             "Salvar Alterações"
//                           )}
//                         </Button>
//                       </div>
//                     </form>
//                   </Form>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="address">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Endereço</CardTitle>
//                   <CardDescription>Atualize seu endereço</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <Form {...addressForm}>
//                     <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
//                       <FormField
//                         control={addressForm.control}
//                         name="address"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Endereço</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Rua, número, complemento" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <div className="grid grid-cols-2 gap-4">
//                         <FormField
//                           control={addressForm.control}
//                           name="city"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Cidade</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="Cidade" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormField
//                           control={addressForm.control}
//                           name="state"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Província</FormLabel>
//                               <FormControl>
//                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Selecione" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="BG">Bengo</SelectItem>
//                                     <SelectItem value="BL">Benguela</SelectItem>
//                                     <SelectItem value="BI">Bié</SelectItem>
//                                     <SelectItem value="CA">Cabinda</SelectItem>
//                                     <SelectItem value="CC">Cuando Cubango</SelectItem>
//                                     <SelectItem value="CN">Cuanza Norte</SelectItem>
//                                     <SelectItem value="CS">Cuanza Sul</SelectItem>
//                                     <SelectItem value="CU">Cunene</SelectItem>
//                                     <SelectItem value="HM">Huambo</SelectItem>
//                                     <SelectItem value="HL">Huíla</SelectItem>
//                                     <SelectItem value="LN">Luanda</SelectItem>
//                                     <SelectItem value="LNO">Lunda Norte</SelectItem>
//                                     <SelectItem value="LSU">Lunda Sul</SelectItem>
//                                     <SelectItem value="ML">Malanje</SelectItem>
//                                     <SelectItem value="MX">Moxico</SelectItem>
//                                     <SelectItem value="NM">Namibe</SelectItem>
//                                     <SelectItem value="UG">Uíge</SelectItem>
//                                     <SelectItem value="ZA">Zaire</SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
//                       <FormField
//                         control={addressForm.control}
//                         name="postalCode"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Código Postal</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Código Postal" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <div className="flex justify-end">
//                         {isSuccess && (
//                           <div className="flex items-center text-green-600 mr-4">
//                             <CheckCircle className="h-4 w-4 mr-2" />
//                             <span>Salvo com sucesso!</span>
//                           </div>
//                         )}
//                         <Button type="submit" disabled={isLoading}>
//                           {isLoading ? (
//                             <>
//                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                               Salvando...
//                             </>
//                           ) : (
//                             "Salvar Alterações"
//                           )}
//                         </Button>
//                       </div>
//                     </form>
//                   </Form>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="security">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Segurança</CardTitle>
//                   <CardDescription>Atualize sua senha</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <Form {...securityForm}>
//                     <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
//                       <FormField
//                         control={securityForm.control}
//                         name="currentPassword"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Senha Atual</FormLabel>
//                             <FormControl>
//                               <Input type="password" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={securityForm.control}
//                         name="newPassword"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Nova Senha</FormLabel>
//                             <FormControl>
//                               <Input type="password" {...field} />
//                             </FormControl>
//                             <FormDescription>
//                               A senha deve ter pelo menos 8 caracteres e incluir letras e números.
//                             </FormDescription>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={securityForm.control}
//                         name="confirmPassword"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Confirmar Nova Senha</FormLabel>
//                             <FormControl>
//                               <Input type="password" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <div className="flex justify-end">
//                         {isSuccess && (
//                           <div className="flex items-center text-green-600 mr-4">
//                             <CheckCircle className="h-4 w-4 mr-2" />
//                             <span>Senha alterada com sucesso!</span>
//                           </div>
//                         )}
//                         <Button type="submit" disabled={isLoading}>
//                           {isLoading ? (
//                             <>
//                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                               Alterando...
//                             </>
//                           ) : (
//                             "Alterar Senha"
//                           )}
//                         </Button>
//                       </div>
//                     </form>
//                   </Form>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }
