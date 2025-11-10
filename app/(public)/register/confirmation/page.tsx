import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, Mail, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Cadastro Realizado | KamiLink",
  description: "Seu cadastro foi realizado com sucesso",
}

export default function RegistrationConfirmationPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Cadastro Realizado!</CardTitle>
          <CardDescription>
            Seu cadastro foi realizado com sucesso. 
            {/*Verifique seu email para confirmar sua conta.*/}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-950">
            <div className="flex">
              <div className="flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Verifique seu email</h3>
                {/*<div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                  <p>Enviamos um link de confirmação para o seu email. Clique no link para ativar sua conta.</p>
                </div>*/}
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Após a confirmação do email, nossa equipe irá verificar seus documentos. Este processo pode levar até 48
              horas úteis.
            </p>
          </div>
        </CardContent>
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
      </Card>
    </div>
  )
}
