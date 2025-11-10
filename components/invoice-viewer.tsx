"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Printer } from "lucide-react"
import { type Invoice, getInvoiceById } from "@/lib/supabase/invoices"
import { formatCurrency } from "@/lib/utils"

interface InvoiceViewerProps {
  invoiceId: string
}

export default function InvoiceViewer({ invoiceId }: InvoiceViewerProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInvoice() {
      try {
        const data = await getInvoiceById(invoiceId)
        setInvoice(data)
      } catch (error) {
        console.error("Error loading invoice:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInvoice()
  }, [invoiceId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log("Download PDF functionality to be implemented")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando fatura...</p>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Fatura não encontrada</p>
      </div>
    )
  }

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

  const isClientInvoice = invoice.invoice_type === "client_invoice"

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold">
          {isClientInvoice ? "Fatura" : "Recibo"} #{invoice.invoice_number}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Invoice content */}
      <div className="space-y-6">
        {/* Company header */}
        <div className="text-center border-b pb-6">
          <h2 className="text-3xl font-bold text-primary">{invoice.company_name || "KamiLink"}</h2>
          <p className="text-muted-foreground mt-2">
            {invoice.company_address || "Rua Principal, 789, Luanda, Angola"}
          </p>
          {invoice.company_tax_id && <p className="text-sm text-muted-foreground">NIF: {invoice.company_tax_id}</p>}
        </div>

        {/* Invoice details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">{isClientInvoice ? "Faturar para:" : "Cliente:"}</h3>
            <div className="space-y-1">
              <p className="font-medium">{invoice.client?.full_name}</p>
              {invoice.client?.company_name && (
                <p className="text-sm text-muted-foreground">{invoice.client.company_name}</p>
              )}
              <p className="text-sm">{invoice.client?.email}</p>
              <p className="text-sm">{invoice.client?.phone}</p>
              {invoice.client?.address && <p className="text-sm text-muted-foreground">{invoice.client.address}</p>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">{isClientInvoice ? "Prestador de serviço:" : "Transportador:"}</h3>
            <div className="space-y-1">
              <p className="font-medium">{invoice.transporter?.full_name}</p>
              {invoice.transporter?.company_name && (
                <p className="text-sm text-muted-foreground">{invoice.transporter.company_name}</p>
              )}
              <p className="text-sm">{invoice.transporter?.email}</p>
              <p className="text-sm">{invoice.transporter?.phone}</p>
              {invoice.transporter?.address && (
                <p className="text-sm text-muted-foreground">{invoice.transporter.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Invoice info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm font-medium">Número da {isClientInvoice ? "Fatura" : "Recibo"}</p>
            <p className="text-lg font-bold">{invoice.invoice_number}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Data de Emissão</p>
            <p>{new Date(invoice.issue_date).toLocaleDateString("pt-AO")}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Status</p>
            <Badge className={getStatusColor(invoice.status)}>{getStatusText(invoice.status)}</Badge>
          </div>
          {invoice.due_date && (
            <div>
              <p className="text-sm font-medium">Data de Vencimento</p>
              <p>{new Date(invoice.due_date).toLocaleDateString("pt-AO")}</p>
            </div>
          )}
          {invoice.freight_request?.tracking_number && (
            <div>
              <p className="text-sm font-medium">Número de Rastreamento</p>
              <p className="font-mono">{invoice.freight_request.tracking_number}</p>
            </div>
          )}
        </div>

        {/* Freight details */}
        {invoice.freight_request && (
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Transporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Origem</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.freight_request.origin_address}
                    <br />
                    {invoice.freight_request.origin_city}, {invoice.freight_request.origin_state}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Destino</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.freight_request.destination_address}
                    <br />
                    {invoice.freight_request.destination_city}, {invoice.freight_request.destination_state}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">Tipo de Carga</p>
                  <p className="text-sm text-muted-foreground">{invoice.freight_request.cargo_type}</p>
                </div>
                <div>
                  <p className="font-medium">Peso</p>
                  <p className="text-sm text-muted-foreground">{invoice.freight_request.weight} kg</p>
                </div>
                <div>
                  <p className="font-medium">Dimensões</p>
                  <p className="text-sm text-muted-foreground">{invoice.freight_request.dimensions}</p>
                </div>
              </div>

              <div>
                <p className="font-medium">Descrição</p>
                <p className="text-sm text-muted-foreground">{invoice.freight_request.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Data de Coleta</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.freight_request.pickup_date).toLocaleDateString("pt-AO")}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Data de Entrega</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.freight_request.delivery_date).toLocaleDateString("pt-AO")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invoice items */}
        <Card>
          <CardHeader>
            <CardTitle>Itens da {isClientInvoice ? "Fatura" : "Receita"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Descrição</th>
                    <th className="text-right py-2">Qtd</th>
                    <th className="text-right py-2">Valor Unit.</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">{formatCurrency(item.unit_price)}</td>
                        <td className="text-right py-2 font-medium">{formatCurrency(item.total_price)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>

              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto:</span>
                  <span>-{formatCurrency(invoice.discount_amount)}</span>
                </div>
              )}

              {invoice.tax_amount > 0 && (
                <div className="flex justify-between">
                  <span>IVA ({(invoice.tax_rate * 100).toFixed(1)}%):</span>
                  <span>{formatCurrency(invoice.tax_amount)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total_amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment information */}
        {invoice.payments && invoice.payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoice.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{payment.payment_method}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.payment_date).toLocaleDateString("pt-AO")}
                      </p>
                      {payment.reference_number && (
                        <p className="text-sm text-muted-foreground">Ref: {payment.reference_number}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(payment.amount)}</p>
                      <Badge className={getStatusColor(payment.status)}>{getStatusText(payment.status)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes and terms */}
        {(invoice.notes || invoice.payment_terms) && (
          <Card>
            <CardContent className="pt-6">
              {invoice.notes && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Observações:</h4>
                  <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                </div>
              )}

              {invoice.payment_terms && (
                <div>
                  <h4 className="font-medium mb-2">Termos de Pagamento:</h4>
                  <p className="text-sm text-muted-foreground">{invoice.payment_terms}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>Este documento foi gerado automaticamente pelo sistema KamiLink</p>
          <p>Para dúvidas, entre em contato: suporte@kamilink.ao</p>
        </div>
      </div>
    </div>
  )
}
