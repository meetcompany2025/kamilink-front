// src/pages/clientes/index.tsx ou app/clientes/page.tsx

"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import Link from "next/link"
import { Eye, Lock } from "lucide-react"
import { getAllClients } from "@/services/clientService"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export default function ClientesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [sortBy, setSortBy] = useState<"name" | "city">("name")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [clients, setClients] = useState([])
  const { user } = useAuth()
  const { toast } = useToast()

  const itemsPerPage = 20

  useEffect(() => {
      const fetchClients = async () => {
        try {
          console.log(user.id)
          const res = await getAllClients()

          const normalizedClients = res.map((c) => ({
            id: c.id,
            name: c.user?.person?.fullName || c.companyName || "Sem nome",
            type: c.accountType || "—",
            city: c.user?.person?.provincia || "—",
            status: c.user?.isActive ? "Ativo" : "Inativo",
          }))

          setClients(normalizedClients)
  
          //if (!res.ok) throw new Error("Erro ao buscar fretes")
          console.log(normalizedClients);
          toast({ title: "Clientes carregados", description: `${normalizedClients.length} clientes encontrados.` })
        } catch (err) {
          console.error(err)
          toast({ title: "Erro ao buscar clientes", variant: "destructive" })         
        } finally {
          setIsLoading(false)
        }
      }
  
      if (user) fetchClients()
    }, [user])

  // Filtro + Ordenação + Paginação
  const filteredClients = useMemo(() => {
    let data = [...clients]

    // Filtro por busca
    if (search) {
      data = data.filter((client) =>
        client.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filtro por status
    if (statusFilter !== "Todos") {
      data = data.filter((client) => client.status === statusFilter)
    }

    // Ordenação
    data.sort((a, b) =>
      a[sortBy].localeCompare(b[sortBy], "pt-BR", { sensitivity: "base" })
    )

    return data
  }, [search, clients, statusFilter, sortBy])

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
  const paginatedClients = filteredClients.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>Todos os clientes cadastrados na plataforma</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filtrar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: "name" | "city") => setSortBy(value)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="city">Cidade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {paginatedClients.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nome</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Província</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{client.name}</td>
                    <td className="p-2">{client.type === "INDIVIDUAL" ? "Individual" : "Empresa"}</td>
                    <td className="p-2">{client.city}</td>
                    <td className="p-2">
                      <Badge variant={client.status === "Ativo" ? "default" : "secondary"}>
                        {client.status}
                      </Badge>
                    </td>
                   <td className="p-2 flex gap-2">
                    <Link href={`find-client/${client.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button className="bg-red-600 text-white" variant="outline" size="sm">
                      <Lock className="w-4 h-4" />
                    </Button>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted-foreground text-sm mt-4">Nenhum cliente encontrado.</p>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Próximo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
