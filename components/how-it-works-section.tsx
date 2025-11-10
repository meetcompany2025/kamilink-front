import { CheckCircle, PackagePlus, Search, Truck } from "lucide-react"

export default function HowItWorksSection() {
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Como funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <PackagePlus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Cadastre sua carga</h3>
            <p className="text-muted-foreground dark:text-gray-400">
              Informe origem, destino, tipo de carga e data desejada para o transporte.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">2. Receba propostas</h3>
            <p className="text-muted-foreground dark:text-gray-400">
              Transportadores qualificados enviarão propostas para sua solicitação.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">3. Escolha a melhor oferta</h3>
            <p className="text-muted-foreground dark:text-gray-400">
              Compare preços, avaliações e escolha o transportador ideal para sua carga.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">4. Acompanhe em tempo real</h3>
            <p className="text-muted-foreground dark:text-gray-400">
              Rastreie sua carga em tempo real e receba atualizações sobre o status da entrega.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
