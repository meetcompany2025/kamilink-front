"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building2, Loader2, User, Eye, EyeOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { SocialButton } from "@/components/ui/social-button"
import { useAuth } from "@/components/auth-provider"
import { registerClient } from "@/services/clientService"


// Lista de províncias de Angola
const provincias = [
  "Bengo",
  "Benguela",
  "Bié",
  "Cabinda",
  "Cuando Cubango",
  "Cuanza Norte",
  "Cuanza Sul",
  "Cunene",
  "Huambo",
  "Huíla",
  "Luanda",
  "Lunda Norte",
  "Lunda Sul",
  "Malanje",
  "Moxico",
  "Namibe",
  "Uíge",
  "Zaire",
]



// Esquema de validação com Zod
const formSchema = z
  .object({
    accountType: z.enum(["INDIVIDUAL", "COMPANY"]),
    fullName: z.string().min(3, {
      message: "Nome deve ter pelo menos 3 caracteres.",
    }),
    email: z.string().email({
      message: "Email inválido.",
    }),
    phone: z.string().min(9, {
      message: "Telefone deve ter pelo menos 9 dígitos.",
    }),
    documentType: z.enum(["BI", "NIF", "Passaporte"]),
    documentNumber: z.string().min(1, {
      message: "Número de documento é obrigatório.",
    }),
    provincia: z.string({
      message: "Selecione uma província.",
    }),
    // provincia: z.string({
    //   required_error: "Selecione uma província.",
    // }),
    password: z
      .string()
      .min(8, {
        message: "Senha deve ter pelo menos 8 caracteres.",
      })
      .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message: "Senha deve conter pelo menos 1 número e 1 símbolo.",
      }),
    confirmPassword: z.string(),
    companyName: z.string().optional(),
    nif: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos e condições.",
    }),
    uploadDocument: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.accountType === "COMPANY") {
        return !!data.companyName && !!data.nif
      }
      return true
    },
    {
      message: "Campos obrigatórios para conta empresarial.",
      path: ["companyName"],
    },
  )

export default function ClientRegisterPage() {
  const [accountType, setAccountType] = useState<"INDIVIDUAL" | "COMPANY">("INDIVIDUAL")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const auth = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: "INDIVIDUAL",
      fullName: "",
      email: "",
      phone: "",
      documentType: "BI",
      documentNumber: "",
      provincia: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      nif: "",
      acceptTerms: false,
      uploadDocument: false,
    },
  })

  const { watch } = form;

  const uploadDocument = watch("uploadDocument");
  const acceptTerms = watch("acceptTerms");

  const canSubmit = uploadDocument && acceptTerms;

  // Sincronizar o estado do tipo de conta com o formulário
  useEffect(() => {
    form.setValue("accountType", accountType)
  }, [accountType, form])

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

  // Função para formatar NIF
  const formatNIF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.slice(0, 9)
  }

  // Função para lidar com o envio do formulário
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const token = await registerClient({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone.replace(/\D/g, ""),
        password: values.password,
        accountType: values.accountType,
        companyName: values.companyName || null,
        nif: values.nif || null,
        documentType: values.documentType,
        documentNumber: values.documentNumber,
        provincia: values.provincia,
        profile: "CLIENT"
      })

      localStorage.setItem('token', token);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar sua conta.",
      })

      setTimeout(() => {
        router.push("/register/confirmation")
      }, 1000)

      /*setTimeout(() => {
          setRedirectTo(values.uploadDocument ? "/upload-documents" : "/login")
        }, 2000)

        if (redirectTo) {
          return <Link href={redirectTo} replace />
        }*/

    } catch (error: any) {
      console.error("Erro no registro:", error)
      toast({
        title: "Erro ao criar conta",
        description: error?.response?.data?.message || "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
        <h1 className="text-2xl font-bold mt-4">Cadastro de Cliente</h1>
        <p className="text-muted-foreground">Crie sua conta para solicitar fretes</p>
      </div>

      <div className="flex gap-4 mb-8">
        <Button
          type="button"
          variant={accountType === "INDIVIDUAL" ? "default" : "outline"}
          className="flex-1 gap-2"
          onClick={() => setAccountType("INDIVIDUAL")}
        >
          <User className="h-4 w-4" />
          Pessoa Física
        </Button>
        <Button
          type="button"
          variant={accountType === "COMPANY" ? "default" : "outline"}
          className="flex-1 gap-2"
          onClick={() => setAccountType("COMPANY")}
        >
          <Building2 className="h-4 w-4" />
          Empresa
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome {accountType === "INDIVIDUAL" ? "Completo" : "do Responsável"}</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {accountType === "COMPANY" && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000000000"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatNIF(e.target.value)
                          field.onChange(formatted)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+244 923 456 789"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value)
                      field.onChange(formatted)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BI">BI</SelectItem>
                      <SelectItem value="NIF">NIF</SelectItem>
                      <SelectItem value="Passaporte">Passaporte</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº do Documento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        form.watch("documentType") === "BI"
                          ? "123456789LA123"
                          : form.watch("documentType") === "NIF"
                            ? "000000000"
                            : "AB123456"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="provincia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Província</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma província" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provincias.map((provincia) => (
                      <SelectItem key={provincia} value={provincia}>
                        {provincia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} />
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
                </FormControl>
                <FormDescription>Mínimo de 8 caracteres, incluindo 1 número e 1 símbolo</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showConfirmPassword ? "text" : "password"} placeholder="********" {...field} />
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="uploadDocument"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Desejo enviar uma cópia do meu documento para verificação</FormLabel>
                  <FormDescription>Isso ajudará a verificar sua conta mais rapidamente</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Aceito os{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      termos e condições
                    </Link>{" "}
                    e a{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      política de privacidade
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading || !canSubmit}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </Button>
        </form>
      </Form>

      {/*<div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou cadastre-se com</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SocialButton
          icon={
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
          }
          provider="Google"
          onClick={() => {
            if (!isLoading) {
              auth.signInWithGoogle()
            }
          }}
        />
        <SocialButton
          icon={
            <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
            </svg>
          }
          provider="Facebook"
          onClick={() => {
            if (!isLoading) {
              auth.signInWithFacebook()
            }
          }}
        />
      </div>*/}

      <div className="mt-6 text-center text-sm">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Entrar
        </Link>
      </div>
    </div>
  )
}
