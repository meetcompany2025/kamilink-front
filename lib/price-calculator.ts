// Tipos de carga e seus fatores de preço
export const cargoTypePriceFactor: Record<string, number> = {
  general: 1.0, // Carga geral (fator base)
  fragile: 1.5, // Carga frágil (50% mais caro)
  perishable: 1.3, // Perecíveis (30% mais caro)
  dangerous: 2.0, // Produtos perigosos (100% mais caro)
  vehicles: 1.8, // Veículos (80% mais caro)
  machinery: 1.7, // Máquinas e equipamentos (70% mais caro)
  furniture: 1.4, // Móveis (40% mais caro)
  other: 1.2, // Outros (20% mais caro)
}

// Fatores de preço baseados no peso (kg)
export const weightPriceFactor = (weight: number): number => {
  if (weight <= 100) return 1.0
  if (weight <= 500) return 1.2
  if (weight <= 1000) return 1.5
  if (weight <= 5000) return 1.8
  if (weight <= 10000) return 2.2
  return 2.5 // Acima de 10 toneladas
}

// Fatores de preço baseados na distância (km)
export const distancePriceFactor = (distance: number): number => {
  if (distance <= 50) return 1.0
  if (distance <= 100) return 0.9 // Desconto para distâncias médias
  if (distance <= 300) return 0.85
  if (distance <= 500) return 0.8
  return 0.75 // Desconto para longas distâncias
}

// Preço base por quilômetro (em Kwanzas angolanos)
export const BASE_PRICE_PER_KM = 500 // 500 Kz por km

// Preço mínimo para qualquer frete
export const MINIMUM_FREIGHT_PRICE = 15000 // 15.000 Kz

// Cálculo do preço do frete
export function calculateFreightPrice({
  distance,
  cargoType,
  weight,
  hasInsurance = false,
  requiresLoadingHelp = false,
  requiresUnloadingHelp = false,
  urgentDelivery = false,
}: {
  distance: number
  cargoType: string
  weight: number
  hasInsurance?: boolean
  requiresLoadingHelp?: boolean
  requiresUnloadingHelp?: boolean
  urgentDelivery?: boolean
}): {
  basePrice: number
  additionalServices: Record<string, number>
  totalPrice: number
  pricePerKm: number
} {
  // Verificar se o tipo de carga é válido
  const cargoFactor = cargoType in cargoTypePriceFactor ? cargoTypePriceFactor[cargoType] : cargoTypePriceFactor.other

  // Calcular o preço base
  const weightFactor = weightPriceFactor(weight)
  const distFactor = distancePriceFactor(distance)

  let basePrice = distance * BASE_PRICE_PER_KM * cargoFactor * weightFactor * distFactor

  // Garantir preço mínimo
  basePrice = Math.max(basePrice, MINIMUM_FREIGHT_PRICE)

  // Calcular serviços adicionais
  const additionalServices: Record<string, number> = {}

  // Seguro (10% do valor base)
  if (hasInsurance) {
    additionalServices.insurance = basePrice * 0.1
  }

  // Ajuda para carregamento
  if (requiresLoadingHelp) {
    additionalServices.loadingHelp = 5000 // 5.000 Kz
  }

  // Ajuda para descarregamento
  if (requiresUnloadingHelp) {
    additionalServices.unloadingHelp = 5000 // 5.000 Kz
  }

  // Entrega urgente (30% adicional)
  if (urgentDelivery) {
    additionalServices.urgentDelivery = basePrice * 0.3
  }

  // Calcular preço total
  const additionalTotal = Object.values(additionalServices).reduce((sum, value) => sum + value, 0)
  const totalPrice = basePrice + additionalTotal

  // Calcular preço por km
  const pricePerKm = totalPrice / distance

  return {
    basePrice: Math.round(basePrice),
    additionalServices,
    totalPrice: Math.round(totalPrice),
    pricePerKm: Math.round(pricePerKm),
  }
}

// Formatar preço em Kwanzas
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
