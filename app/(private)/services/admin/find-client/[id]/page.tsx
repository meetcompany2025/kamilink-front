"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Eye } from "lucide-react"
import { getClientById } from "@/services/clientService"
import { toast } from "@/components/ui/use-toast"

function getInitials(name: string) {
  return name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

type Freight = {
  id: string
  origin: string
  destination: string
  cargoType: string
  price: number
  status: string
  pickupDate: string
  deliveryDate: string
}

type Client = {
  id: string
  accountType: "COMPANY" | "INDIVIDUAL"
  companyName?: string
  nif?: string
  createdAt: string
  user: {
    id: string
    email: string
    isActive: boolean
    isVerified: boolean
    person: {
      fullName: string
      documentNumber: string
      phone: string
      provincia: string
    }
    freightsAsClient?: Freight[]
  }
}

export default function ClienteDetalhesPage() {
  const params = useParams()
  const id = params?.id as string
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function fetchClient() {
      try {
        const data = await getClientById(id)
        setClient(data)
      } catch (err) {
        console.error(err)
        setError("Erro ao carregar o cliente.")
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do cliente.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [id])

  if (loading) return <p className="p-6 text-sm text-muted-foreground">Carregando dados...</p>
  if (error) return <p className="p-6 text-sm text-red-500">{error}</p>
  if (!client) return <p className="p-6 text-sm text-muted-foreground">Cliente não encontrado.</p>

  const person = client.user.person
  const freights = client.user.freightsAsClient || []

  const inProgressFreights = freights.filter(f => f.status === "IN_PROGRESS" || f.status === "PENDING")
  const completedFreights = freights.filter(f => f.status === "COMPLETED" || f.status === "DELIVERED")
  const canceledFreights = freights.filter(f => f.status === "CANCELED")

  const formatDate = (d: string) => new Date(d).toLocaleDateString()

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6 px-4">
      {/* Perfil do Cliente */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold border">
              {getInitials(person.fullName)}
            </div>
            <div>
              <CardTitle className="text-2xl">{person.fullName}</CardTitle>
              <CardDescription>
                {client.accountType === "COMPANY"
                  ? `Empresa: ${client.companyName}`
                  : "Cliente Individual"}
              </CardDescription>
            </div>
          </div>

          <Badge
            variant={client.user.isActive ? "default" : "secondary"}
            className="text-sm px-4 py-1"
          >
            {client.user.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><strong>Email:</strong> {client.user.email}</div>
          <div><strong>Telefone:</strong> {person.phone}</div>
          <div><strong>Província:</strong> {person.provincia}</div>
          <div><strong>Documento:</strong> {person.documentNumber}</div>
          {client.accountType === "COMPANY" && (
            <>
              <div><strong>Empresa:</strong> {client.companyName}</div>
              <div><strong>NIF:</strong> {client.nif}</div>
            </>
          )}
          <div><strong>Conta criada em:</strong> {formatDate(client.createdAt)}</div>
        </CardContent>
      </Card>

      {/* Fretes do Cliente */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Fretes do Cliente</CardTitle>
          <CardDescription>Visualize os fretes organizados por status</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="ativos">
            <TabsList className="mb-6">
              <TabsTrigger value="ativos">Em Progresso / Pendentes</TabsTrigger>
              <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
              <TabsTrigger value="cancelados">Cancelados</TabsTrigger>
            </TabsList>

            {[
              { value: "ativos", data: inProgressFreights, empty: "Nenhum frete em progresso ou pendente." },
              { value: "concluidos", data: completedFreights, empty: "Nenhum frete concluído." },
              { value: "cancelados", data: canceledFreights, empty: "Nenhum frete cancelado." }
            ].map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="mt-2">
                {tab.data.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Origem</th>
                        <th className="text-left py-3 px-2">Destino</th>
                        <th className="text-left py-3 px-2">Tipo</th>
                        <th className="text-left py-3 px-2">Preço</th>
                        <th className="text-left py-3 px-2">Data de Recolha</th>
                        <th className="text-left py-3 px-2">Data de Entrega</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tab.data.map((f) => (
                        <tr key={f.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-2">{f.origin}</td>
                          <td className="py-3 px-2">{f.destination}</td>
                          <td className="py-3 px-2">{f.cargoType}</td>
                          <td className="py-3 px-2">{f.price.toLocaleString()} Kz</td>
                          <td className="py-3 px-2">{formatDate(f.pickupDate)}</td>
                          <td className="py-3 px-2">{formatDate(f.deliveryDate)}</td>
                          <td className="py-3 px-2">
                            <Badge
                              variant={
                                f.status === "IN_PROGRESS"
                                  ? "default"
                                  : f.status === "CANCELED"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {f.status.replace("_", " ")}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-muted-foreground">{tab.empty}</p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Voltar */}
      <div className="pt-4">
        <Link href="/clientes">
          <Button variant="outline">← Voltar à lista</Button>
        </Link>
      </div>
    </div>
  )
}
