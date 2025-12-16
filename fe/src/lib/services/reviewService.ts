import api from "../api";
import { Review, ApiResponse } from "@/types";

interface CreateReviewRequest {
  carId: number;
  bookingId: number;
  rating: number;
  comment: string;
}

export const reviewService = {
  async createReview(data: CreateReviewRequest): Promise<Review> {
    const response = await api.post<ApiResponse<Review>>(`/reviews`, data);
    return response.data.data;
  },

  async getCarReviews(carId: number): Promise<Review[]> {
    const response = await api.get<ApiResponse<Review[]>>(
      `/reviews/car/${carId}`
    );
    return response.data.data;
  },

  async getUserReviews(userId: number): Promise<Review[]> {
    const response = await api.get<ApiResponse<Review[]>>(
      `/reviews/user/${userId}`
    );
    return response.data.data;
  },

  async deleteReview(reviewId: number): Promise<void> {
    await api.delete(`/reviews/${reviewId}`);
  },
};
