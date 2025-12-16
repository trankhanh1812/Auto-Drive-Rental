import api from "../api";
import { Car, User, ApiResponse } from "@/types";

export const adminService = {
  // Car approval
  async getPendingCars(): Promise<Car[]> {
    const response = await api.get<ApiResponse<Car[]>>("/admin/cars/pending");
    return response.data.data;
  },

  async approveCar(carId: number): Promise<Car> {
    const response = await api.put<ApiResponse<Car>>(
      `/admin/cars/${carId}/approve`
    );
    return response.data.data;
  },

  async rejectCar(carId: number, reason?: string): Promise<void> {
    await api.put(`/admin/cars/${carId}/reject`, null, {
      params: { reason },
    });
  },

  // User management
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>("/admin/users");
    return response.data.data;
  },

  async getUserById(userId: number): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/admin/users/${userId}`);
    return response.data.data;
  },

  async banUser(userId: number): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      `/admin/users/${userId}/ban`
    );
    return response.data.data;
  },

  async unbanUser(userId: number): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      `/admin/users/${userId}/unban`
    );
    return response.data.data;
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  },

  // Dashboard statistics
  async getAdminStats(): Promise<{
    pendingCarsCount: number;
    totalUsersCount: number;
    complaintsCount: number;
  }> {
    const response = await api.get<ApiResponse<any>>("/admin/stats");
    return response.data.data;
  },
};
