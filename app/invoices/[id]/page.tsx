import { notFound } from "next/navigation"
import InvoiceViewer from "@/components/invoice-viewer"

interface InvoicePageProps {
  params: {
    id: string
  }
}

export default function InvoicePage({ params }: InvoicePageProps) {
  if (!params.id) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <InvoiceViewer invoiceId={params.id} />
    </div>
  )
}
