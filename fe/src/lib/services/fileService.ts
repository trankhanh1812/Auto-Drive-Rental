import api from "../api";
import { ApiResponse } from "@/types";

export const fileService = {
  uploadFile: async (file: File, folder: string = "general"): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post<ApiResponse<string>>(
      `/files/upload?folder=${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  uploadImages: async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(file => fileService.uploadFile(file, "cars"));
    return Promise.all(uploadPromises);
  },

  uploadVideo: async (file: File): Promise<string> => {
    return fileService.uploadFile(file, "videos");
  },

  deleteFile: async (publicId: string): Promise<void> => {
    await api.delete(`/files/${publicId}`);
  },
};
