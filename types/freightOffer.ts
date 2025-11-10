export type FreightStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

export interface CreateFreightOfferDto {
  transporterId: string;
  freightRequestId?: string;
  vehicleId?: string;
  price: number;
  estimatedDeliveryDate?: string;
  notes?: string;
}

export interface FreightOffer {
  id: string;
  transporterId: string;
  freightRequestId?: string;
  vehicleId?: string;
  price: number;
  estimatedDeliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
