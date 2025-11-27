import api from "@/services/api";

export interface CreateReviewDto {
  freightId: string;
  rating: number;
  comment?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  freightId: string;
  createdAt: string;
  userId?: string;
}

export const ReviewService = {
  create: async (data: CreateReviewDto): Promise<Review> => {
    const res = await api.post('/reviews', data);
    return res.data;
  },

  getByFreightId: async (freightId: string): Promise<Review[]> => {
    const res = await api.get(`/reviews/freight/${freightId}`);
    return res.data;
  },

  getMyReviews: async (): Promise<Review[]> => {
    const res = await api.get('/reviews');
    return res.data;
  }
};