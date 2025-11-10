export interface CreateReviewDto {
  freightId: string;
  rating: number;
  comment?: string;
}

export interface Review {
  id: string;
  freightId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
