// src/pages/transporters/index.tsx or app/transporters/page.tsx

"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import Link from "next/link"
import { Eye, Lock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { getAllTransporters } from "@/services/transporterService"

export default function TransportersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [sortBy, setSortBy] = useState<"name" | "region">("name")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [transporters, setTransporters] = useState([])
  const { user } = useAuth()
  const { toast } = useToast()
  
  const itemsPerPage = 20
  
  useEffect(() => {
        const fetchTransporters = async () => {
          try {
            console.log(user.id)
            const res = await getAllTransporters()
  
            const normalizedTransporters = res.map((t) => ({
              id: t.id,
              name: t.user?.person?.fullName || "N/A",
              region: t.user?.person?.provincia || "—",
              status: t.user?.isActive ? "Ativo" : "Inativo",
            }))
  
            setTransporters(normalizedTransporters)
    
            console.log(res);
            //if (!res.ok) throw new Error("Erro ao buscar fretes")
            console.log(normalizedTransporters);
            toast({ title: "Transportadores carregados", description: `${normalizedTransporters.length} transportadore(s) encontrado(s).` })
          } catch (err) {
            console.error(err)
            toast({ title: "Erro ao buscar transportadores", variant: "destructive" })         
          } finally {
            setIsLoading(false)
          }
        }
    
        if (user) fetchTransporters()
      }, [user])

  const filteredTransporters = useMemo(() => {
    let data = [...transporters]

    // Search
    if (search) {
      data = data.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "Todos") {
      data = data.filter((t) => t.status === statusFilter)
    }

    // Sorting
    data.sort((a, b) =>
      a[sortBy].localeCompare(b[sortBy], "pt-BR", { sensitivity: "base" })
    )

    return data
  }, [search, transporters, statusFilter, sortBy])

  const totalPages = Math.ceil(filteredTransporters.length / itemsPerPage)
  const paginatedTransporters = filteredTransporters.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Lista de Transportadores</CardTitle>
            <CardDescription>Todos os transportadores cadastrados na plataforma</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Buscar transportador..."
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

            <Select value={sortBy} onValueChange={(value: "name" | "region") => setSortBy(value)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="region">Provincia</SelectItem>
              </SelectContent>
            </Select>

          
          </div>
        </CardHeader>

        <CardContent>
          {paginatedTransporters.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Nome</th>
                    <th className="text-left p-2">Provincia</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransporters.map((t) => (
                    <tr key={t.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{t.name}</td>
                      <td className="p-2">{t.region}</td>
                      <td className="p-2">
                        <Badge variant={t.status === "Ativo" ? "default" : "secondary"}>
                          {t.status}
                        </Badge>
                      </td>
                      <td className="p-2 flex gap-2">
                        <Link href={`find-transporter/${t.id}`}>
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
              <p className="text-muted-foreground text-sm mt-4">
                Nenhum transportador encontrado.
              </p>
            )}


          {/* Pagination */}
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
