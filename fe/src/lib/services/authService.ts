import api from "../api";
import { User, ApiResponse, LoginRequest, RegisterRequest } from "@/types";

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials
    );
    const { token, user } = response.data.data;

    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Trigger auth change event
    window.dispatchEvent(new Event("auth-change"));

    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<ApiResponse<User>>("/auth/register", data);
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Trigger auth change event
    window.dispatchEvent(new Event("auth-change"));
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  },
};
