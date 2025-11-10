import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  FileText,
  MapPin,
  Package,
  Search,
  TrendingUp,
  Truck,
  ClipboardList,
  ShieldCheck,
} from "lucide-react"
import FadeIn from "@/components/fade-in"
import SlideIn from "@/components/slide-in"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Serviços | KamiLink",
  description: "Conheça os serviços oferecidos pela KamiLink para clientes e transportadores.",
}

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <FadeIn>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nossos Serviços</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A KamiLink oferece soluções completas para logística e transporte de cargas em toda Angola, conectando
            clientes e transportadores de forma eficiente e segura.
          </p>
          <div className="relative h-64 w-full my-6 rounded-lg overflow-hidden">
            <Image
              src="/images/truck-angola-2.png"
              alt="Serviços de transporte em Angola"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <SlideIn direction="left">
            <Card className="h-full border-none shadow-md dark:bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Para Clientes</CardTitle>
                <CardDescription>Soluções para quem precisa transportar cargas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative rounded-lg overflow-hidden h-48">
                  <img
                    src="/images/truck-angola-2.png"
                    alt="Serviços para clientes"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <p className="text-white p-4 font-medium">Transporte seguro para suas cargas</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Encontre transportadores qualificados para suas cargas, com preços competitivos e rastreamento em
                  tempo real. Garantimos segurança e eficiência em todo o processo.
                </p>
              </CardContent>
              <CardFooter>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/services/freight" className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Solicitar Frete</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/services/tracking" className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Rastreamento</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/services/quotes" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Cotações</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/services/reports" className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      <span>Relatórios</span>
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </SlideIn>

          <SlideIn direction="right">
            <Card className="h-full border-none shadow-md dark:bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Para Transportadores</CardTitle>
                <CardDescription>Soluções para quem transporta cargas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative rounded-lg overflow-hidden h-48">
                  <img
                    src="/images/truck-angola-3.png"
                    alt="Serviços para transportadores"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <p className="text-white p-4 font-medium">Oportunidades para sua frota</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Encontre fretes disponíveis em toda Angola, gerencie sua frota e aumente sua receita. Nossa plataforma
                  conecta você a clientes que precisam dos seus serviços.
                </p>
              </CardContent>
              <CardFooter>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/services/find-freight" className="flex items-center">
                      <Search className="mr-2 h-4 w-4" />
                      <span>Encontrar Fretes</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/services/register-vehicle" className="flex items-center">
                      <Truck className="mr-2 h-4 w-4" />
                      <span>Cadastrar Veículo</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/services/reports" className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      <span>Relatórios</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/services/documents" className="flex items-center">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      <span>Documentos</span>
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </SlideIn>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Frota Diversificada</h3>
              <p className="text-muted-foreground">
                Acesso a diversos tipos de veículos para atender às suas necessidades específicas de transporte.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cobertura Nacional</h3>
              <p className="text-muted-foreground">
                Serviços disponíveis em todas as 18 províncias de Angola, conectando todo o país.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Segurança Garantida</h3>
              <p className="text-muted-foreground">
                Transportadores verificados e sistema de rastreamento para garantir a segurança da sua carga.
              </p>
            </div>
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden mb-16">
          <img
            src="/images/truck-angola-4.png"
            alt="Transporte de cargas em Angola"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="p-8 text-white max-w-lg">
              <h2 className="text-2xl font-bold mb-4">Soluções Personalizadas para Empresas</h2>
              <p className="mb-4">
                Oferecemos soluções logísticas personalizadas para empresas de todos os tamanhos, com contratos
                especiais, relatórios detalhados e atendimento dedicado.
              </p>
              <Button asChild variant="default" className="bg-white text-black hover:bg-gray-200">
                <Link href="/contact">
                  Fale com um Consultor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Cadastre-se gratuitamente e comece a usar todos os serviços da KamiLink. Estamos aqui para transformar a
            logística em Angola.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Cadastre-se Agora</Link>
          </Button>
        </div>
      </FadeIn>
    </div>
  )
}
