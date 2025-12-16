import api from "../api";
import { ApiResponse, Payment } from "@/types";

export const paymentService = {
  checkPaymentStatus: async (orderCode: string): Promise<Payment> => {
    const response = await api.get<ApiResponse<Payment>>(
      `/payment/check-status?orderCode=${orderCode}`
    );
    return response.data.data;
  },

  updatePaymentStatus: async (
    orderCode: string,
    status: string
  ): Promise<Payment> => {
    const response = await api.put<ApiResponse<Payment>>(
      `/payment/update-status?orderCode=${orderCode}&status=${status}`
    );
    return response.data.data;
  },

  createFinalPayment: async (bookingId: number): Promise<Payment> => {
    const response = await api.post<ApiResponse<Payment>>(
      `/payment/create-final-payment/${bookingId}`
    );
    return response.data.data;
  },
};
