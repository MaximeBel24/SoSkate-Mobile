import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/src/shared/constants/constants";
import { ServiceResponse } from "@/src/shared/types/service.interface";
import { handleApiError } from "@/src/api/axios/handleApiError";

export const getActiveServices = async (): Promise<ServiceResponse[]> => {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.SERVICES}/active`;
    const { data } = await apiClient.get<ServiceResponse[]>(endpoint);
    if (!Array.isArray(data)) {
      throw new ApiError("Format de réponse invalide", 500);
    }
    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la récupération des services");
  }
};
