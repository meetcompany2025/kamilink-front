import type { Metadata } from "next"
import FAQClientPage from "./FaqClientPage"

export const metadata: Metadata = {
  title: "Perguntas Frequentes | KamiLink",
  description: "Encontre respostas para as perguntas mais comuns sobre a plataforma KamiLink.",
}

export default function FAQPage() {
  return <FAQClientPage />
}
