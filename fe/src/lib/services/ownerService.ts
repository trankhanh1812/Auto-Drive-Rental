import api from "../api";
import { ApiResponse, Car, Booking } from "@/types";

interface DashboardData {
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  activeRentals: number;
}

export const ownerService = {
  getDashboard: async (): Promise<DashboardData> => {
    const response =
      await api.get<ApiResponse<DashboardData>>("/owner/dashboard");
    return response.data.data;
  },

  getOwnerCars: async (): Promise<Car[]> => {
    const response = await api.get<ApiResponse<Car[]>>("/owner/cars");
    return response.data.data;
  },

  getOwnerCarById: async (id: number): Promise<Car> => {
    const response = await api.get<ApiResponse<Car>>(`/owner/cars/${id}`);
    return response.data.data;
  },

  updateCar: async (id: number, carData: any): Promise<Car> => {
    const response = await api.put<ApiResponse<Car>>(
      `/owner/cars/${id}`,
      carData
    );
    return response.data.data;
  },

  getOwnerBookings: async (): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>("/owner/bookings");
    return response.data.data;
  },

  approveBooking: async (id: number): Promise<Booking> => {
    const response = await api.put<ApiResponse<Booking>>(
      `/owner/bookings/${id}/approve`
    );
    return response.data.data;
  },

  rejectBooking: async (bookingId: number): Promise<Booking> => {
    const response = await api.put<ApiResponse<Booking>>(
      `/owner/bookings/${bookingId}/reject`
    );
    return response.data.data;
  },

  startBooking: async (bookingId: number): Promise<Booking> => {
    const response = await api.put<ApiResponse<Booking>>(
      `/owner/bookings/${bookingId}/start`
    );
    return response.data.data;
  },

  completeBooking: async (bookingId: number): Promise<Booking> => {
    const response = await api.put<ApiResponse<Booking>>(
      `/owner/bookings/${bookingId}/complete`
    );
    return response.data.data;
  },
};
