// app/vehicles/[id]/page.tsx
'use client'
export const fetchCache = "force-no-store";
// export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateVehicleDto } from '@/types/vehicle' // esquema de validação
import { VehicleService } from '@/services/vehicleService'
import { Truck, Upload } from 'lucide-react'
import { z } from "zod"

import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const availableFeatures = [
  { id: 'gps', label: 'GPS' },
  { id: 'ar-condicionado', label: 'Ar Condicionado' },
  { id: 'airbag', label: 'Airbag' },
  { id: 'freio-abs', label: 'Freio ABS' },
]

const formSchema = z.object({
  type: z.string().min(1, {
    message: "Tipo de veículo é obrigatório.",
  }),
  brand: z.string().min(1, {
    message: "Marca é obrigatória.",
  }),
  model: z.string().min(1, {
    message: "Modelo é obrigatório.",
  }),
  licensePlate: z.string().min(1, {
    message: "Placa é obrigatória.",
  }),
  year: z.string().min(1, {
    message: "Ano é obrigatório.",
  }),
  loadCapacity: z.number().min(1, {
    message: "Capacidade é obrigatória.",
  }),
  dimensions: z.string().optional(),
  features: z.array(z.string()).default([]),
  description: z.string().optional(),
  hasDocumentation: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "Você deve confirmar que possui a documentação do veículo.",
    }),
  trailerType: z.string(),
  baseProvince: z.string(),
})

export default function VehicleDetailPage() {
  const {id} = useParams<{id: string}>()
  const vehicleId = id

  const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        type: "",
        brand: "",
        model: "",
        licensePlate: "",
        year: "",
        loadCapacity: 0,
        dimensions: "",
        features: [],
        description: "",
        hasDocumentation: false,
        trailerType: "N/A",
        baseProvince: "Luanda",
      },
    })

  const { setValue, reset } = form

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const data = await VehicleService.getById(vehicleId)
        reset(data) // preenche o formulário com os dados
      } catch (err) {
        console.error('Erro ao carregar veículo:', err)
      } finally {
        setLoading(false)
      }
    }

    loadVehicle()
  }, [vehicleId, reset])

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Carregando dados do veículo...
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Detalhes do Veículo</h1>

      <Form {...form}>
        <form className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Informações do Veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Campos conforme seu formulário original, todos usando: */}
              {/* <FormField name="..." render={({ field }) => ( <Input {...field} disabled /> )} /> */}

              {/* Exemplo resumido: */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Veículo</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Continue adicionando os outros campos do formulário da mesma forma */}

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">Características</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableFeatures.map((feature) => (
                    <FormField
                      key={feature.id}
                      control={form.control}
                      name="features"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(feature.id)}
                              disabled
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{feature.label}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
