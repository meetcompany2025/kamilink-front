"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, Search, Filter } from "lucide-react"
import { type Invoice, getUserInvoices } from "@/lib/supabase/invoices"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import FadeIn from "@/components/fade-in"

export default function InvoicesPage() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    async function loadInvoices() {
      if (!user?.id) return

      try {
        const data = await getUserInvoices(user.id)
        setInvoices(data)
      } catch (error) {
        console.error("Error loading invoices:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInvoices()
  }, [user?.id])

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.freight_request?.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    const matchesType = typeFilter === "all" || invoice.invoice_type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago"
      case "pending":
        return "Pendente"
      case "overdue":
        return "Vencido"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    return type === "client_invoice" ? "Fatura" : "Recibo"
  }

  if (loading) {
    return (
      <FadeIn>
        <div className="container py-8">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Carregando faturas...</p>
            </div>
          </div>
        </div>
      </FadeIn>
    )
  }

  return (
    <FadeIn>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Minhas Faturas e Recibos</h1>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="client_invoice">Faturas</SelectItem>
                  <SelectItem value="transporter_receipt">Recibos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setTypeFilter("all")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices list */}
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                {invoices.length === 0
                  ? "Você ainda não possui faturas ou recibos."
                  : "Nenhuma fatura encontrada com os filtros aplicados."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{invoice.invoice_number}</h3>
                        <Badge className={getStatusColor(invoice.status)}>{getStatusText(invoice.status)}</Badge>
                        <Badge variant="outline">{getTypeText(invoice.invoice_type)}</Badge>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Data: {new Date(invoice.issue_date).toLocaleDateString("pt-AO")}</p>
                        {invoice.freight_request?.tracking_number && (
                          <p>Rastreamento: {invoice.freight_request.tracking_number}</p>
                        )}
                        {invoice.freight_request && (
                          <p>
                            {invoice.freight_request.origin_city} → {invoice.freight_request.destination_city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <p className="text-2xl font-bold">{formatCurrency(invoice.total_amount)}</p>
                      <div className="flex gap-2">
                        <Link href={`/invoices/${invoice.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </FadeIn>
  )
}
