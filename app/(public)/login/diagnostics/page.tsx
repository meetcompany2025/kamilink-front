import { LoginDiagnostics } from "@/components/login-diagnostics"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function LoginDiagnosticsPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/login">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Login
          </Button>
        </Link>
      </div>
      <LoginDiagnostics />
    </div>
  )
}
