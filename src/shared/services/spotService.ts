import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/src/shared/constants/constants";
import { SpotResponse } from "@/src/shared/types/spot.interface";
import { handleApiError } from "@/src/api/axios/handleApiError";

export const getAllSpots = async (): Promise<SpotResponse[]> => {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.SPOTS}`;
    const { data } = await apiClient.get<SpotResponse[]>(endpoint);
    if (!Array.isArray(data)) {
      throw new ApiError("Format de réponse invalide", 500);
    }
    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la récupération des spots");
  }
};

export const getActiveSpots = async (): Promise<SpotResponse[]> => {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.SPOTS}/active`;
    const { data } = await apiClient.get<SpotResponse[]>(endpoint);
    if (!Array.isArray(data)) {
      throw new ApiError("Format de réponse invalide", 500);
    }
    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la récupération des spots actifs");
  }
};
