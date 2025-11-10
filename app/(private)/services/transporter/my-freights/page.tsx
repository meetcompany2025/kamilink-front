//import { getUserProfile } from "@/lib/supabase/auth"
/*import { redirect } from "next/navigation"
import { AuthService } from "@/services/authService"
import { cookies } from "next/headers";*/

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, PackageSearch, ArrowRight, Badge } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { FreightRequestService } from "@/services/freightRequestService"

const statusConfig: Record<
  string,
  { label: string; color: string }
> = {
  PENDING:     { label: "Pendente",     color: "bg-yellow-200 text-yellow-900" },
  ACCEPTED:    { label: "Aceite",       color: "bg-blue-200 text-blue-900" },
  IN_PROGRESS: { label: "Em Andamento", color: "bg-purple-200 text-purple-900" },
  COMPLETED:   { label: "Concluído",    color: "bg-green-200 text-green-900" },
  CANCELED:    { label: "Cancelado",    color: "bg-red-200 text-red-900" },
};

export default function MyFreightsPage() {
  const { user } = useAuth()
  const [freights, setFreights] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      const fetchFreights = async () => {
        try {
          console.log(user.id)
          const res = await FreightRequestService.getTansporterFreights()
  
          //if (!res.ok) throw new Error("Erro ao buscar fretes")
  
          console.log(res);
          setFreights(res)
        } catch (err) {
          console.error(err)
        } finally {
          setIsLoading(false)
        }
      }
  
      if (user) fetchFreights()
    }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">Carregando seus fretes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Meus Fretes</h1>
        <p className="text-muted-foreground">Acompanhe todos os fretes.</p>
      </div>

      {freights.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <PackageSearch className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum frete encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não aceitou nenhuma solicitação.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {freights.map((freight) => {

            const status = statusConfig[freight.status as keyof typeof statusConfig] ??
            statusConfig.PENDING;
            
            return (
              <Card key={freight.id}>
              <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {freight.origin}, {freight.originState} → {freight.destination},{" "}
            {freight.destinationState}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {/* Status with badge */}
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <span className={`px-3 py-1 rounded-full  text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>

          {/* Pickup & Delivery Dates aligned */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-700">Data de Coleta</p>
              <p>{new Date(freight.pickupDate).toLocaleDateString("pt-AO")}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Data de Entrega</p>
              <p>{new Date(freight.deliveryDate).toLocaleDateString("pt-AO")}</p>
            </div>
          </div>

          {/* Cargo Type */}
          <div>
            <p className="font-medium text-gray-700">Tipo de Carga</p>
            <p>{freight.cargoType}</p>
          </div>
        </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  <Button asChild className="mt-2 w-full">
                    <Link href={`/services/transporter/freight/${freight.id}`} className="inline-flex items-center gap-2">
                      Ver Detalhes <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
                
              </Card>
          )})}
        </div>
      )}
    </div>
  )
}


/*const MyFreightsPage = async () => {
  const cookieStore = cookies(); // Já é o objeto, não precisa de await
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const user = await AuthService.me(token);

  if (!user) redirect("/login");

  return (
    <div>
      <h1>My Freights</h1>
      <p>Welcome, {user?.email}!</p>
      //{ Add your freights list or other content here }
    </div>
  )
}

export default MyFreightsPage*/
