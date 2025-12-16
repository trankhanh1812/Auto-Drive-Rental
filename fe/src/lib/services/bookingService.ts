import api from "../api";
import { Booking, ApiResponse } from "@/types";

export const bookingService = {
  createBooking: async (bookingData: {
    carId: number;
    startDate: string;
    endDate: string;
    pickupLocation: string;
    dropoffLocation?: string;
    notes?: string;
    deposit?: number;
  }): Promise<Booking> => {
    const response = await api.post<ApiResponse<Booking>>(
      "/bookings",
      bookingData
    );
    return response.data.data;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>(
      "/bookings/my-bookings"
    );
    return response.data.data;
  },

  getBookingById: async (id: number): Promise<Booking> => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data.data;
  },

  getBookingByOrderCode: async (orderCode: string): Promise<Booking> => {
    const response = await api.get<ApiResponse<Booking>>(
      `/bookings/order/${orderCode}`
    );
    return response.data.data;
  },
};
