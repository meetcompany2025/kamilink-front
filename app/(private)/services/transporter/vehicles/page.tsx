"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Truck, ArrowRight, TruckIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { VehicleService } from "@/services/vehicleService"

export default function MyVehiclesPage() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await VehicleService.getMyVehicles()
        setVehicles(res)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) fetchVehicles()
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">Carregando seus veículos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <div className="mb-8">
          <h1 className="text-2xl font-bold">Meus Veículos</h1>
          <p className="text-muted-foreground">Gerencie todos os veículos que você cadastrou.</p>
          </div>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/services/transporter/vehicles/register-vehicle">
            <TruckIcon className="mr-2 h-4 w-4" />
            Registar Veículo
          </Link>
        </Button>
      </div>
      

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <Truck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum veículo encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não cadastrou nenhum veículo.
              </p>
              <Button asChild>
                <Link href="/vehicles/register-vehicles">Cadastrar Novo Veículo</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <strong>Tipo:</strong> {vehicle.type}
                </div>
                <div>
                  <strong>Status:</strong> {vehicle.status || "Indefinido"}
                </div>
                <Button asChild className="mt-2 w-full">
                  <Link href={`/services/transporter/vehicles/${vehicle.id}`} className="inline-flex items-center gap-2">
                    Ver Detalhes <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
