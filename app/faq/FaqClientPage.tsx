"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import AnimatedPageTransition from "@/components/animated-page-transition"
import FadeIn from "@/components/fade-in"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function FAQClientPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")

  const faqCategories = [
    {
      id: "general",
      title: t("faq.categories.general"),
      questions: [
        {
          id: "what-is-kamilink",
          question: t("faq.general.what_is_kamilink.question"),
          answer: t(
            "faq.general.what_is_kamilink.answer",
            "O KamiLink é uma plataforma digital que conecta empresas que precisam transportar cargas com transportadores em Angola. Nossa plataforma simplifica o processo de contratação de fretes, oferecendo uma solução completa para gerenciamento logístico.",
          ),
        },
        {
          id: "how-it-works",
          question: t("faq.general.how_it_works.question", "Como funciona o KamiLink?"),
          answer: t(
            "faq.general.how_it_works.answer",
            "O KamiLink funciona em três etapas simples: 1) Os clientes cadastram suas cargas na plataforma; 2) Os transportadores enviam propostas para realizar o frete; 3) O cliente seleciona a melhor proposta e acompanha todo o processo de transporte em tempo real através da nossa plataforma.",
          ),
        },
        {
          id: "coverage",
          question: t("faq.general.coverage.question"),
          answer: t(
            "faq.general.coverage.answer",
            "Atualmente, o KamiLink opera em todo o território angolano, conectando empresas e transportadores nas principais cidades e províncias do país, incluindo Luanda, Benguela, Huambo, Lubango e outras regiões.",
          ),
        },
        {
          id: "support",
          question: t("faq.general.support.question"),
          answer: t(
            "faq.general.support.answer",
            "Você pode entrar em contato com nossa equipe de suporte através do e-mail suporte@kamilink.co.ao, pelo telefone +244 923 456 789 ou através do formulário de contato disponível em nosso site. Nosso horário de atendimento é de segunda a sexta, das 8h às 17h.",
          ),
        },
      ],
    },
    {
      id: "clients",
      title: t("faq.categories.clients", "Para Clientes"),
      questions: [
        {
          id: "how-to-register",
          question: t("faq.clients.how_to_register.question"),
          answer: t(
            "faq.clients.how_to_register.answer",
            'Para se cadastrar como cliente, clique no botão "Registrar" no canto superior direito do site, selecione a opção "Cliente" e preencha o formulário com seus dados. Após a verificação, você poderá começar a cadastrar suas cargas imediatamente.',
          ),
        },
        {
          id: "freight-cost",
          question: t("faq.clients.freight_cost.question"),
          answer: t(
            "faq.clients.freight_cost.answer",
            "O valor do frete é determinado pelos transportadores com base em diversos fatores, como distância, tipo de carga, peso, volume e urgência. Você receberá múltiplas propostas e poderá escolher a que melhor atende às suas necessidades e orçamento.",
          ),
        },
        {
          id: "payment-methods",
          question: t("faq.clients.payment_methods.question"),
          answer: t(
            "faq.clients.payment_methods.answer",
            "Aceitamos pagamentos via transferência bancária, depósito, Multicaixa Express e pagamentos móveis como BAI Directo. Todos os pagamentos são processados de forma segura através da nossa plataforma.",
          ),
        },
        {
          id: "tracking",
          question: t("faq.clients.tracking.question"),
          answer: t(
            "faq.clients.tracking.answer",
            'Você pode acompanhar sua carga em tempo real através da seção "Rastreamento" na plataforma. Basta inserir o código de rastreamento fornecido após a contratação do frete. Além disso, você receberá notificações sobre atualizações importantes do status da sua carga.',
          ),
        },
      ],
    },
    {
      id: "transporters",
      title: t("faq.categories.transporters", "Para Transportadores"),
      questions: [
        {
          id: "transporter-register",
          question: t("faq.transporters.register.question"),
          answer: t(
            "faq.transporters.register.answer",
            'Para se cadastrar como transportador, clique em "Registrar" no topo do site, selecione a opção "Transportador" e preencha o formulário com seus dados e informações dos veículos. Será necessário fornecer documentação como licença de transporte, seguro e documentos do veículo para verificação.',
          ),
        },
        {
          id: "find-freight",
          question: t("faq.transporters.find_freight.question"),
          answer: t(
            "faq.transporters.find_freight.answer",
            'Após aprovação do seu cadastro, você terá acesso à seção "Encontrar Fretes" onde poderá visualizar todas as cargas disponíveis que correspondem ao seu perfil e tipo de veículo. Você pode filtrar por região, tipo de carga e data para encontrar as melhores oportunidades.',
          ),
        },
        {
          id: "commission",
          question: t("faq.transporters.commission.question"),
          answer: t(
            "faq.transporters.commission.answer",
            "O KamiLink cobra uma comissão de 5% sobre o valor do frete. Esta comissão só é aplicada quando você efetivamente realiza um frete através da plataforma. Não há taxas de assinatura ou custos fixos mensais.",
          ),
        },
        {
          id: "payment-receipt",
          question: t("faq.transporters.payment_receipt.question"),
          answer: t(
            "faq.transporters.payment_receipt.answer",
            "Os pagamentos são processados em até 3 dias úteis após a confirmação de entrega da carga. O valor será transferido diretamente para a conta bancária cadastrada em seu perfil, já descontada a comissão da plataforma.",
          ),
        },
      ],
    },
    {
      id: "security",
      title: t("faq.categories.security", "Segurança"),
      questions: [
        {
          id: "data-security",
          question: t("faq.security.data_security.question"),
          answer: t(
            "faq.security.data_security.answer",
            "O KamiLink utiliza criptografia de ponta a ponta para proteger todos os dados dos usuários. Nossos servidores são seguros e seguimos as melhores práticas de segurança digital. Nunca compartilhamos seus dados com terceiros sem sua autorização expressa.",
          ),
        },
        {
          id: "cargo-insurance",
          question: t("faq.security.cargo_insurance.question"),
          answer: t(
            "faq.security.cargo_insurance.answer",
            "Todos os transportadores cadastrados na plataforma são obrigados a ter seguro de carga. Adicionalmente, oferecemos a opção de contratar um seguro extra para cargas de alto valor, garantindo maior tranquilidade durante o transporte.",
          ),
        },
        {
          id: "transporter-verification",
          question: t("faq.security.transporter_verification.question"),
          answer: t(
            "faq.security.transporter_verification.answer",
            "Realizamos uma verificação rigorosa de todos os transportadores, incluindo análise de documentação, verificação de antecedentes e avaliação da condição dos veículos. Apenas transportadores que atendem aos nossos padrões de qualidade e segurança são aprovados na plataforma.",
          ),
        },
      ],
    },
  ]

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <AnimatedPageTransition>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("faq.title", "Perguntas Frequentes")}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                "faq.description",
                "Encontre respostas para as perguntas mais comuns sobre o KamiLink e nossos serviços de logística em Angola.",
              )}
            </p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("faq.search_placeholder", "Pesquisar perguntas...")}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {searchQuery ? (
            <div className="max-w-3xl mx-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <Card key={category.id} className="mb-6">
                    <CardHeader>
                      <CardTitle>{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq) => (
                          <AccordionItem key={faq.id} value={faq.id}>
                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent>
                              <div className="pt-2 pb-4 text-muted-foreground">{faq.answer}</div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {t("faq.no_results", "Nenhum resultado encontrado para sua pesquisa. Tente outros termos.")}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <Tabs defaultValue="general">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                  {faqCategories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {faqCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{category.title}</CardTitle>
                        <CardDescription>
                          {t("faq.category_description", "Respostas para as perguntas mais comuns sobre")}{" "}
                          {category.title.toLowerCase()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {category.questions.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                              <AccordionContent>
                                <div className="pt-2 pb-4 text-muted-foreground">{faq.answer}</div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </FadeIn>
      </div>
    </AnimatedPageTransition>
  )
}
