"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { CheckCircle, XCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

function EmailConfirmationContent() {
  const searchParams = useSearchParams()
  /*const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      return
    }

    const confirmEmail = async () => {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/confirm-email?token=${token}`
        )
        setStatus("success")
      } catch (error) {
        setStatus("error")
      }
    }

    confirmEmail()
  }, [token])*/

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          {/*status === "loading" && (
            <>
              <CardTitle className="text-xl font-bold">Confirmando...</CardTitle>
              <CardDescription>Estamos validando seu link de confirmação.</CardDescription>
            </>
          )*/}

          {
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Email Confirmado!</CardTitle>
              <CardDescription>Sua conta foi ativada com sucesso.</CardDescription>
            </>
          }

          {/*status === "error" && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Link Inválido</CardTitle>
              <CardDescription>O link de confirmação é inválido ou já foi usado.</CardDescription>
            </>
          )*/}
        </CardHeader>

        {/*(status === "success" || status === "error") && (*/
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Agora você pode acessar a plataforma normalmente usando seu login.
            </p>
          </CardContent>
        /*)*/}

        {/*(status === "success" || status === "error") && (*/
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/login">Ir para Login</Link>
            </Button>
            <Button asChild>
              <Link href="/">
                Página Inicial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        /*)*/}
      </Card>
    </div>
  )
}


export default function EmailConfirmationPage() {
  return (
    <Suspense fallback={<div>Carregando autenticação...</div>}>
      <EmailConfirmationContent />
    </Suspense>
  )
}