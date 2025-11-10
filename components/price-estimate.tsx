"use client"

import { useEffect, useState } from "react"
import { calculateFreightPrice, formatPrice } from "@/lib/price-calculator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calculator, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PriceEstimateProps {
  distance: number
  cargoType: string
  weight: number
  hasInsurance: boolean
  requiresLoadingHelp: boolean
  requiresUnloadingHelp: boolean
  onPriceCalculated?: (price: number) => void
}

export function PriceEstimate({
  distance,
  cargoType,
  weight,
  hasInsurance,
  requiresLoadingHelp,
  requiresUnloadingHelp,
  onPriceCalculated,
}: PriceEstimateProps) {
  const [urgentDelivery, setUrgentDelivery] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Converter peso para número
  const weightNum = Number.parseFloat(weight.toString()) || 0

  // Calcular preço
  const priceDetails = calculateFreightPrice({
    distance,
    cargoType,
    weight: weightNum,
    hasInsurance,
    requiresLoadingHelp,
    requiresUnloadingHelp,
    urgentDelivery,
  })

  // Notificar o componente pai sobre o preço calculado
  useEffect(() => {
    if (onPriceCalculated) {
      onPriceCalculated(priceDetails.totalPrice)
    }
  }, [priceDetails.totalPrice, onPriceCalculated])

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Estimativa de Preço
        </CardTitle>
        <CardDescription>Preço estimado baseado na distância, tipo de carga e serviços adicionais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Preço Total Estimado</p>
            <p className="text-3xl font-bold text-primary">{formatPrice(priceDetails.totalPrice)}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Ocultar Detalhes" : "Ver Detalhes"}
          </Button>
        </div>

        {showDetails && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  Preço Base
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">
                          Calculado com base na distância ({distance} km), tipo de carga e peso ({weightNum} kg)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                <span>{formatPrice(priceDetails.basePrice)}</span>
              </div>

              {Object.entries(priceDetails.additionalServices).map(([service, price]) => (
                <div key={service} className="flex justify-between text-sm">
                  <span>
                    {service === "insurance"
                      ? "Seguro de Carga"
                      : service === "loadingHelp"
                        ? "Auxílio para Carregamento"
                        : service === "unloadingHelp"
                          ? "Auxílio para Descarregamento"
                          : service === "urgentDelivery"
                            ? "Entrega Urgente"
                            : service}
                  </span>
                  <span>{formatPrice(price)}</span>
                </div>
              ))}

              <Separator />
              <div className="flex justify-between text-sm font-medium">
                <span>Preço por Km</span>
                <span>{formatPrice(priceDetails.pricePerKm)}/km</span>
              </div>
            </div>
          </>
        )}

        <div className="pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgentDelivery"
              checked={urgentDelivery}
              onCheckedChange={(checked) => setUrgentDelivery(checked === true)}
            />
            <Label htmlFor="urgentDelivery" className="text-sm font-medium">
              Entrega Urgente (+30%)
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">
          Esta é uma estimativa. O preço final pode variar de acordo com condições específicas da rota e do serviço.
        </p>
      </CardFooter>
    </Card>
  )
}
