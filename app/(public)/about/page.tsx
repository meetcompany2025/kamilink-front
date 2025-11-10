import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, MapPin, Package, Shield, Star, Users, Phone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre a KamiLink</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Conectando cargas a transportadores de forma inteligente, segura e eficiente em toda Angola.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/register">Comece Agora</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Fale Conosco</Link>
          </Button>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
            <p className="text-lg text-muted-foreground mb-6">
              A KamiLink nasceu com o propósito de transformar o setor de logística e transporte em Angola, conectando
              empresas e pessoas que precisam transportar mercadorias com transportadores qualificados.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Nossa missão é simplificar o processo de contratação de fretes, garantindo segurança, transparência e
              eficiência para todos os envolvidos.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Conectar</h3>
                  <p className="text-muted-foreground">Unir clientes e transportadores de forma eficiente</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Simplificar</h3>
                  <p className="text-muted-foreground">Tornar o processo de contratação de fretes mais simples</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Proteger</h3>
                  <p className="text-muted-foreground">Garantir segurança e confiabilidade em todas as transações</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted rounded-xl p-6 md:p-10">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="KamiLink Mission"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Segurança</h3>
              <p className="text-muted-foreground">
                Priorizamos a segurança em todas as etapas, desde a verificação de transportadores até o rastreamento em
                tempo real.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Qualidade</h3>
              <p className="text-muted-foreground">
                Buscamos excelência em todos os serviços, garantindo a melhor experiência para clientes e
                transportadores.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Comunidade</h3>
              <p className="text-muted-foreground">
                Construímos uma comunidade forte de transportadores e clientes, baseada em confiança e respeito mútuo.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Inovação</h3>
              <p className="text-muted-foreground">
                Investimos em tecnologia para oferecer soluções inovadoras que transformam o setor de logística.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mapa de Atuação */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-6">Onde Atuamos</h2>
            <p className="text-lg text-muted-foreground mb-6">
              A KamiLink está presente em todas as províncias de Angola, conectando transportadores e clientes em todo o
              país.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Cobertura Nacional</h3>
                  <p className="text-muted-foreground">Operamos em todas as 18 províncias de Angola</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Transportadores Verificados</h3>
                  <p className="text-muted-foreground">Mais de 500 transportadores cadastrados e verificados</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Fretes Realizados</h3>
                  <p className="text-muted-foreground">Mais de 10.000 fretes realizados com sucesso</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 bg-muted rounded-xl p-6 md:p-10">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <img
                src="/placeholder.svg?height=500&width=500"
                alt="Mapa de Angola"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para revolucionar sua logística?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de empresas e transportadores que já estão economizando tempo e dinheiro com a KamiLink.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link href="/register/client">Sou Cliente</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10">
            <Link href="/register/transporter">Sou Transportador</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
