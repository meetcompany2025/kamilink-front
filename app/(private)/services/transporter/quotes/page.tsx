"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle, MapPin, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  originCity: z.string().min(2, {
    message: "Cidade de origem é obrigatória.",
  }),
  originState: z.string().min(2, {
    message: "Província de origem é obrigatória.",
  }),
  destinationCity: z.string().min(2, {
    message: "Cidade de destino é obrigatória.",
  }),
  destinationState: z.string().min(2, {
    message: "Província de destino é obrigatória.",
  }),
  cargoType: z.string().min(1, {
    message: "Tipo de carga é obrigatório.",
  }),
  weight: z.string().min(1, {
    message: "Peso é obrigatório.",
  }),
  quantity: z.string().min(1, {
    message: "Quantidade é obrigatória.",
  }),
  description: z.string().optional(),
  name: z.string().min(2, {
    message: "Nome é obrigatório.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 dígitos.",
  }),
})

export default function QuotesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originCity: "",
      originState: "",
      destinationCity: "",
      destinationState: "",
      cargoType: "",
      weight: "",
      quantity: "1",
      description: "",
      name: "",
      email: "",
      phone: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log(values)

    // Simulando uma requisição
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      window.scrollTo(0, 0)
    }, 1500)
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para serviços
        </Link>
        <h1 className="text-2xl font-bold mt-4">Solicitar Cotação</h1>
        <p className="text-muted-foreground">Preencha o formulário para receber cotações de transportadores</p>
      </div>

      {isSuccess ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Cotação Solicitada com Sucesso!</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Sua solicitação de cotação foi enviada. Em breve, você receberá propostas de transportadores
                qualificados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline">
                  <Link href="/services">Voltar para Serviços</Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard">Ir para o Painel</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Origem e Destino
                </CardTitle>
                <CardDescription>Informe os locais de origem e destino da carga</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="originCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade de Origem</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="originState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Província de Origem</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BG">Bengo</SelectItem>
                              <SelectItem value="BL">Benguela</SelectItem>
                              <SelectItem value="BI">Bié</SelectItem>
                              <SelectItem value="CA">Cabinda</SelectItem>
                              <SelectItem value="CC">Cuando Cubango</SelectItem>
                              <SelectItem value="CN">Cuanza Norte</SelectItem>
                              <SelectItem value="CS">Cuanza Sul</SelectItem>
                              <SelectItem value="CU">Cunene</SelectItem>
                              <SelectItem value="HM">Huambo</SelectItem>
                              <SelectItem value="HL">Huíla</SelectItem>
                              <SelectItem value="LN">Luanda</SelectItem>
                              <SelectItem value="LNO">Lunda Norte</SelectItem>
                              <SelectItem value="LSU">Lunda Sul</SelectItem>
                              <SelectItem value="ML">Malanje</SelectItem>
                              <SelectItem value="MX">Moxico</SelectItem>
                              <SelectItem value="NM">Namibe</SelectItem>
                              <SelectItem value="UG">Uíge</SelectItem>
                              <SelectItem value="ZA">Zaire</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="destinationCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade de Destino</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destinationState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Província de Destino</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BG">Bengo</SelectItem>
                              <SelectItem value="BL">Benguela</SelectItem>
                              <SelectItem value="BI">Bié</SelectItem>
                              <SelectItem value="CA">Cabinda</SelectItem>
                              <SelectItem value="CC">Cuando Cubango</SelectItem>
                              <SelectItem value="CN">Cuanza Norte</SelectItem>
                              <SelectItem value="CS">Cuanza Sul</SelectItem>
                              <SelectItem value="CU">Cunene</SelectItem>
                              <SelectItem value="HM">Huambo</SelectItem>
                              <SelectItem value="HL">Huíla</SelectItem>
                              <SelectItem value="LN">Luanda</SelectItem>
                              <SelectItem value="LNO">Lunda Norte</SelectItem>
                              <SelectItem value="LSU">Lunda Sul</SelectItem>
                              <SelectItem value="ML">Malanje</SelectItem>
                              <SelectItem value="MX">Moxico</SelectItem>
                              <SelectItem value="NM">Namibe</SelectItem>
                              <SelectItem value="UG">Uíge</SelectItem>
                              <SelectItem value="ZA">Zaire</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Informações da Carga
                </CardTitle>
                <CardDescription>Informe os detalhes da carga a ser transportada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="cargoType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Carga</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de carga" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Carga Geral</SelectItem>
                            <SelectItem value="fragile">Carga Frágil</SelectItem>
                            <SelectItem value="perishable">Perecíveis</SelectItem>
                            <SelectItem value="dangerous">Produtos Perigosos</SelectItem>
                            <SelectItem value="vehicles">Veículos</SelectItem>
                            <SelectItem value="machinery">Máquinas e Equipamentos</SelectItem>
                            <SelectItem value="furniture">Móveis</SelectItem>
                            <SelectItem value="other">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ex: 500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ex: 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição da Carga</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva detalhes adicionais sobre a carga"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seus Dados de Contato</CardTitle>
                <CardDescription>Informe seus dados para receber as cotações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="+244 923 456 789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Solicitar Cotações"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
