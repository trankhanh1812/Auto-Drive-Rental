import api from "../api";
import { ApiResponse, Car, CarSearchParams } from "@/types";

export interface CreateCarData {
  name: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  carType: string;
  seats: string;
  transmission: string;
  fuelType: string;
  pricePerDay: number;
  description: string;
  videoUrl?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  color?: string;
  imageUrls?: string[];
  features?: string[];
}

export const carService = {
  getAllCars: async (): Promise<Car[]> => {
    const response = await api.get<ApiResponse<Car[]>>("/cars");
    return response.data.data;
  },

  getAvailableCars: async (): Promise<Car[]> => {
    const response = await api.get<ApiResponse<Car[]>>("/cars/available");
    return response.data.data;
  },

  getCarById: async (id: number): Promise<Car> => {
    const response = await api.get<ApiResponse<Car>>(`/cars/${id}`);
    return response.data.data;
  },

  searchCars: async (params: CarSearchParams): Promise<Car[]> => {
    const response = await api.post<ApiResponse<Car[]>>("/cars/search", params);
    return response.data.data;
  },

  getTopRatedCars: async (): Promise<Car[]> => {
    const response = await api.get<ApiResponse<Car[]>>("/cars/top-rated");
    return response.data.data;
  },

  createCar: async (data: CreateCarData): Promise<Car> => {
    const response = await api.post<ApiResponse<Car>>("/cars", data);
    return response.data.data;
  },

  updateCar: async (id: number, data: Partial<CreateCarData>): Promise<Car> => {
    const response = await api.put<ApiResponse<Car>>(`/cars/${id}`, data);
    return response.data.data;
  },

  deleteCar: async (id: number): Promise<void> => {
    await api.delete(`/cars/${id}`);
  },
};
