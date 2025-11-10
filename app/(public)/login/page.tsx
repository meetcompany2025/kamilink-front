"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, AlertCircle, HelpCircle, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { showToast } from "@/components/ui/custom-toast"
import { SocialButton } from "@/components/ui/social-button"
import { Facebook } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoginHelp } from "@/components/login-help"
import { LoginDiagnostics } from "@/components/login-diagnostics"
import { AuthRedirect } from "@/components/auth-redirect"
import { ProductionDebug } from "@/components/production-debug"

// Esquema de validação para login com email
const emailFormSchema = z.object({
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória.",
  }),
  rememberMe: z.boolean().default(false),
})

// Esquema de validação para login com telefone
const phoneFormSchema = z.object({
  phone: z.string().min(9, {
    message: "Número de telefone inválido. Deve ter pelo menos 9 dígitos.",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória.",
  }),
  rememberMe: z.boolean().default(false),
})


function LoginContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email")
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [showDebug, setShowDebug] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  const {
    user,
    isLoading: authLoading,
    signInWithEmail,
    // signInWithGoogle,
    // signInWithFacebook,
    signInWithPhone,
    userProfile,
    error: authError,
  } = useAuth()

  // Formulário para login com email
  const emailForm = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })
  // const emailForm = useForm<z.infer<typeof emailFormSchema>>({
  //   resolver: zodResolver(emailFormSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //     rememberMe: false,
  //   },
  // })

  // Formulário para login com telefone
  const phoneForm = useForm({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
      password: "",
      rememberMe: false,
    },
  })
  // const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
  //   resolver: zodResolver(phoneFormSchema),
  //   defaultValues: {
  //     phone: "",
  //     password: "",
  //     rememberMe: false,
  //   },
  // })

  // Limpar erro quando os campos são alterados
  useEffect(() => {
    const emailSubscription = emailForm.watch(() => {
      if (loginError) setLoginError(null)
    })

    const phoneSubscription = phoneForm.watch(() => {
      if (loginError) setLoginError(null)
    })

    return () => {
      emailSubscription.unsubscribe()
      phoneSubscription.unsubscribe()
    }
  }, [emailForm, phoneForm, loginError])

  // Mostrar diagnósticos após muitas tentativas falhadas
 

  // Função para lidar com erros de login
  const handleLoginError = (error: any) => {
    console.error("[LOGIN ERROR]", error)
    setLoginAttempts((prev) => prev + 1)

    let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente."

    if (error && typeof error === "object") {
      if ("message" in error && typeof error.message === "string") {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou senha incorretos. Verifique seus dados e tente novamente."
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada."
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Muitas tentativas de login. Aguarde alguns minutos."
        } else if (error.message.includes("Network")) {
          errorMessage = "Erro de conexão. Verifique sua internet e tente novamente."
        } else {
          errorMessage = error.message
        }
      }
    }

    setLoginError(errorMessage)

    showToast("Erro ao fazer login", errorMessage, "destructive")
  }

  // Função para login com email
  async function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
    setIsLoading(true)
    setLoginError(null)

    try {
      console.log("[LOGIN] Attempting email login for:", values.email)

      if (typeof signInWithEmail !== "function") {
        throw new Error("Serviço de autenticação não disponível. Tente recarregar a página.")
      }

      await signInWithEmail(values.email, values.password, values.rememberMe)

      console.log("[LOGIN] Login successful, preparing redirect...")

      showToast("Login realizado com sucesso!", "Redirecionando para o dashboard...")


      setLoginAttempts(0)
    } catch (error: any) {
      handleLoginError(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para login com telefone
  async function onPhoneSubmit(values: z.infer<typeof phoneFormSchema>) {
    setIsLoading(true)
    setLoginError(null)

    try {
      console.log("[LOGIN] Attempting phone login for:", values.phone)

      let phoneNumber = values.phone
      if (!phoneNumber.startsWith("244")) {
        phoneNumber = "244" + phoneNumber.replace(/^0+/, "")
      }

      await signInWithPhone(phoneNumber, values.password, values.rememberMe)

      console.log("[LOGIN] Login successful, preparing redirect...")

      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      })

      setLoginAttempts(0)
    } catch (error: any) {
      handleLoginError(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Show diagnostics if requested
  if (showDiagnostics) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <Button variant="outline" onClick={() => setShowDiagnostics(false)}>
            ← Voltar ao Login
          </Button>
        </div>
        <LoginDiagnostics />
      </div>
    )
  }

  return (
    <AuthRedirect>
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10 px-4">

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setShowHelp(!showHelp)}>
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <CardTitle className="text-2xl mt-4">Entrar na plataforma</CardTitle>
            <CardDescription>Acesse sua conta para gerenciar seus fretes</CardDescription>
          </CardHeader>
          <CardContent>
            {(loginError || authError) && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro de autenticação</AlertTitle>
                <AlertDescription>{"Intoduza as credenciais para aceder ao dashboard" /*||loginError || authError*/}</AlertDescription>
              </Alert>
            )}

            {/*loginAttempts >= 2 && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Problemas com o login?</AlertTitle>
                <AlertDescription>
                  Se continuar com dificuldades, clique no ícone de configurações (⚙️) para executar um diagnóstico.
                </AlertDescription>
              </Alert>
            )*/}

            <Tabs
              defaultValue="email"
              className="w-full"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "email" | "phone")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Telefone</TabsTrigger>
              </TabsList>
              <TabsContent value="email">
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="email"

                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com" {...field} autoComplete="new-email" />
                            
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} autoComplete="new-password"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between">
                      <FormField
                        control={emailForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">Lembrar-me</FormLabel>
                          </FormItem>
                        )}
                      />
                      <Link href="/auth/recover-password" className="text-sm text-primary hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="phone">
                <Form {...phoneForm}>
                  <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                    <FormField
                      control={phoneForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="999 999 999" {...field} autoComplete="off" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={phoneForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} autoComplete="new-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between">
                      <FormField
                        control={phoneForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">Lembrar-me</FormLabel>
                          </FormItem>
                        )}
                      />
                      <Link href="/auth/recover-password" className="text-sm text-primary hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            {showHelp && <LoginHelp />}

            {/*<div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
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
                  try {
                    signInWithGoogle()
                  } catch (error) {
                    handleLoginError(error)
                  }
                }}
              />
              <SocialButton
                icon={<Facebook className="h-5 w-5 text-[#1877F2]" />}
                provider="Facebook"
                onClick={() => {
                  try {
                    signInWithFacebook()
                  } catch (error) {
                    handleLoginError(error)
                  }
                }}
              />
            </div>*/}
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </AuthRedirect>
  )
}


export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando autenticação...</div>}>
      <LoginContent />
    </Suspense>
  )
}