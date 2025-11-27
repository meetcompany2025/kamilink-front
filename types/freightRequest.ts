export type FreightStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

export interface CreateFreightRequestDto {
  id: string;
  origin: string;
  originState: string;
  destination: string;
  destinationState: string;
  cargoType: string;
  weightKg: string;
  lengthCm?: string | undefined;
  widthCm?: string | undefined;
  heightCm?: string | undefined; 
  quantity: string;
  description?: string;
  pickupDate: string;
  deliveryDate: string;
  paymentMethod: string;
  requiresLoadingHelp: boolean;
  requiresUnloadingHelp: boolean;
  hasInsurance: boolean;
  price: number;
  originCoordinates: string;
  destinationCoordinates: string;
  estimatedDistance?: number;
  estimatedTime?: number;
}

export interface FreightRequest {
  id: string;
  clientId: string;
  origin: string;
  originState: string;
  destination: string;
  destinationState: string;
  cargoType: string;
  weightKg: string;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number; 
  quantity: string;
  description?: string;
  pickupDate: string;
  deliveryDate: string;
  requiresLoadingHelp: boolean;
  requiresUnloadingHelp: boolean;
  hasInsurance: boolean;
  price?: number;
  originCoordinates: string;
  destinationCoordinates: string;
  estimatedDistance: number;
  estimatedTime: number;
  cancelationReason: string
  transporterId: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  // Image 
  Image?: Array<{
    id: string;
    type: string;
    path: string;
    filename: string;
    freightId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  // Client
  client?: {
    person: {
      id: string;
      fullName: string;
      documentNumber: string;
      phone: string;
      provincia: string;
      userId: string;
      createdAt: string;
      updatedAt: string;
    };
  };
   // Review para as avaliações
  Review?: Array<{
    id: string;
    rating: number;
    comment?: string;
    freightId: string;
    createdAt: string;
    userId?: string;
  }>;
}
export interface FreightRequestTransporter {
  id: string;
  clientId: string;
  origin: string;
  originState: string;
  destination: string;
  destinationState: string;
  cargoType: string;
  weightKg: string;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number; 
  quantity: string;
  description?: string;
  pickupDate: string;
  deliveryDate: string;
  requiresLoadingHelp: boolean;
  requiresUnloadingHelp: boolean;
  hasInsurance: boolean;
  price?: number;
  originCoordinates: string;
  destinationCoordinates: string;
  estimatedDistance: number;
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
  status?: string
  clientName?: string,
  clientRating?: string,
  weight?: string,
  dimensions?: string,
  distance?: number,

}
