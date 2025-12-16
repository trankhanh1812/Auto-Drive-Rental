import api from "../api";
import { User, ApiResponse } from "@/types";

export const userService = {
  getCurrentProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>("/users/profile");
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>("/users/profile", data);
    return response.data.data;
  },

  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<ApiResponse<string>>(
      "/users/profile/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  uploadDrivingLicense: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<ApiResponse<string>>(
      "/users/profile/driving-license",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },
};
