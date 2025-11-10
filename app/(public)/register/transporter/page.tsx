import type { Metadata } from "next"
import { TransporterRegisterForm } from "./TransporterRegisterForm"

export const metadata: Metadata = {
  title: "Cadastro de Transportador | KamiLink",
  description: "Cadastre-se como transportador na plataforma KamiLink e comece a transportar cargas",
}

export default function TransporterRegisterPage() {
  return (
    <div className="container py-10">
      <TransporterRegisterForm />
    </div>
  )
}
