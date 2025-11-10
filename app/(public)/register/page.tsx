"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Truck, User } from "lucide-react"

// Adicionar imports para os componentes necessários
import { SocialButton } from "@/components/ui/social-button"
import { Facebook } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import dynamic from "next/dynamic"
import React from "react"

// Substitua a importação direta do componente de mapa por:
const MapView = dynamic(() => import("@/components/map/map-view").then((mod) => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
      <p>Carregando mapa...</p>
    </div>
  ),
})

// Adicione o componente ErrorBoundary:
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Map error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// Adicionar o hook useAuth dentro da função do componente
export default function RegisterPage() {
  const auth = useAuth()
  const showMap = false // Assuming showMap is defined elsewhere or will be based on some condition

  // Resto do código permanece o mesmo...
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10 px-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a página inicial
          </Link>
          <h1 className="text-3xl font-bold mt-4">Cadastre-se na KamiLink</h1>
          <p className="text-muted-foreground">Escolha o tipo de conta que deseja criar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Sou Cliente
              </CardTitle>
              <CardDescription>Cadastre-se como cliente para solicitar fretes e gerenciar suas cargas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm">Solicite fretes para suas cargas</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm">Acompanhe suas cargas em tempo real</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm">Avalie transportadores e gerencie pagamentos</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-4">
                <Button asChild className="w-full" size="lg">
                  <Link href="/register/client">Cadastrar como Cliente</Link>
                </Button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Pessoa física ou jurídica que precisa transportar cargas
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Sou Transportador
              </CardTitle>
              <CardDescription>Cadastre-se como transportador para oferecer serviços de transporte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm">Encontre fretes disponíveis na sua região</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm">Gerencie sua frota e motoristas</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm">Receba pagamentos de forma segura e rápida</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-4">
                <Button asChild className="w-full" size="lg">
                  <Link href="/register/transporter">Cadastrar como Transportador</Link>
                </Button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Autônomo ou empresa que oferece serviços de transporte
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {showMap && (
          <div className="relative">
            <ErrorBoundary
              fallback={
                <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
                  <p>Não foi possível carregar o mapa. Por favor, continue com o registro.</p>
                </div>
              }
            >
              <MapView
              // props existentes...
              />
            </ErrorBoundary>
          </div>
        )}

        

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
