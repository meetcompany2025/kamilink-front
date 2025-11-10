"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { AuthService } from "@/services/authService"

// --- Schema de validação ---
const formSchema = z
  .object({
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

function ChangePasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast({
        title: "Token inválido ou ausente",
        description: "",
      }) 
      return
    }

    setIsLoading(true)

    try {
      
      await AuthService.changePassword({ newPassword: values.password, resetToken: token })
      console.log("Enviando nova senha:", values.password, "com token:", token)

      setIsLoading(false)
      toast({
        title: "Password atualizada",
        description: "A sua senha foi atualizada",
      })      
      
      router.replace('/login');
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Email enviado",
        description: "Verifique o seu email para aceder ao link de recuperação",
      })   
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o login
          </Link>
          <CardTitle className="text-2xl mt-4">Definir Nova Senha</CardTitle>
          <CardDescription>Digite sua nova senha abaixo para redefinir seu acesso</CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Senha Alterada!</h3>
              <p className="text-muted-foreground mb-6">
                Sua senha foi redefinida com sucesso. Agora você pode fazer login com a nova senha.
              </p>
              <Button asChild>
                <Link href="/login">Ir para o Login</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Alterando...
                    </>
                  ) : (
                    "Redefinir Senha"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>

        {!isSuccess && (
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm">
              Lembrou sua senha?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Voltar para o login
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}


export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div>Carregando autenticação...</div>}>
      <ChangePasswordContent />
    </Suspense>
  )
}