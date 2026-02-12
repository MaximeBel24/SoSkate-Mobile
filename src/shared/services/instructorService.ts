import apiClient from "@/src/api/axios/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/src/shared/constants/constants";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import { handleApiError } from "@/src/api/axios/handleApiError";

export const getInstructorById = async (
  id: number,
): Promise<InstructorResponse> => {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.INSTRUCTOR}/${id}`;
    const { data } = await apiClient.get<InstructorResponse>(endpoint);
    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la récupération de l'instructeur");
  }
};
