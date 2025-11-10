// Províncias de Angola
export const PROVINCES = [
  { value: "luanda", label: "Luanda" },
  { value: "benguela", label: "Benguela" },
  { value: "huambo", label: "Huambo" },
  { value: "cabinda", label: "Cabinda" },
  { value: "malanje", label: "Malanje" },
  { value: "huila", label: "Huíla" },
  { value: "bie", label: "Bié" },
  { value: "uige", label: "Uíge" },
  { value: "cunene", label: "Cunene" },
  { value: "lunda_norte", label: "Lunda Norte" },
  { value: "lunda_sul", label: "Lunda Sul" },
  { value: "moxico", label: "Moxico" },
  { value: "namibe", label: "Namibe" },
  { value: "zaire", label: "Zaire" },
  { value: "bengo", label: "Bengo" },
  { value: "cuando_cubango", label: "Cuando Cubango" },
  { value: "cuanza_norte", label: "Cuanza Norte" },
  { value: "cuanza_sul", label: "Cuanza Sul" },
]

// Tipos de veículos
export const VEHICLE_TYPES = [
  { value: "camioneta", label: "Camioneta (até 3.5T)" },
  { value: "truck", label: "Truck (até 10T)" },
  { value: "truck_grande", label: "Truck Grande (até 30T)" },
  { value: "bitruck", label: "Bitruck" },
  { value: "carreta", label: "Carreta" },
]

// Tipos de reboques
export const TRAILER_TYPES = [
  { value: "bau", label: "Baú" },
  { value: "sider", label: "Sider" },
  { value: "graneleiro", label: "Graneleiro" },
  { value: "tanque", label: "Tanque" },
  { value: "frigorifico", label: "Frigorífico" },
  { value: "cegonha", label: "Cegonha" },
  { value: "porta_container", label: "Porta Container" },
]

// Tipos de documentos
export const DOCUMENT_TYPES = [
  { value: "bi", label: "Bilhete de Identidade (BI)" },
  { value: "nif", label: "Número de Identificação Fiscal (NIF)" },
  { value: "passaporte", label: "Passaporte" },
]

// Status de frete
export const FREIGHT_STATUS = [
  { value: "pending", label: "Pendente", color: "yellow" },
  { value: "accepted", label: "Aceito", color: "blue" },
  { value: "in_transit", label: "Em Trânsito", color: "orange" },
  { value: "delivered", label: "Entregue", color: "green" },
  { value: "cancelled", label: "Cancelado", color: "red" },
]

// Tipos de carga
export const CARGO_TYPES = [
  { value: "general", label: "Carga Geral" },
  { value: "fragile", label: "Carga Frágil" },
  { value: "perishable", label: "Perecíveis" },
  { value: "dangerous", label: "Carga Perigosa" },
  { value: "liquid", label: "Líquidos" },
  { value: "refrigerated", label: "Refrigerada" },
  { value: "livestock", label: "Animais Vivos" },
  { value: "vehicles", label: "Veículos" },
  { value: "machinery", label: "Maquinaria" },
  { value: "construction", label: "Material de Construção" },
]

// Métodos de pagamento
export const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Transferência Bancária" },
  { value: "cash", label: "Dinheiro" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "credit_card", label: "Cartão de Crédito" },
  { value: "platform_balance", label: "Saldo na Plataforma" },
]

// Comissão da plataforma
export const PLATFORM_COMMISSION = 0.1 // 10%

// Limite mínimo para saque
export const MINIMUM_WITHDRAWAL = 5000 // 5.000 KZS
