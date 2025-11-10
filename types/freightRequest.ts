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
  createdAt: string;
  updatedAt: string;
}
