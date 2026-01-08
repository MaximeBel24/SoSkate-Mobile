import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/src/shared/constants/constants";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import { AxiosError } from "axios";

export async function getAllInstructors(): Promise<InstructorResponse[]> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.INSTRUCTOR}`;
    const { data } = await apiClient.get<InstructorResponse[]>(endpoint);
    if (!Array.isArray(data)) {
      throw new ApiError("Format de réponse invalide", 500);
    }
    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const status = error.response?.status;
    const backend = error.response?.data;
    const backendMessage =
        (backend && (backend.message || backend.error || backend.title)) ??
        error.message;
    const details = backend?.errors ?? backend;
    throw new ApiError(
        backendMessage || "Erreur lors de la récupération des instructeurs",
        status,
        details
    );
  }
}

export async function getInstructorById(id: string): Promise<InstructorResponse> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.INSTRUCTOR}/${id}`;
    const { data } = await apiClient.get<InstructorResponse>(endpoint);
    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const status = error.response?.status;
    const backend = error.response?.data;
    const backendMessage =
        (backend && (backend.message || backend.error || backend.title)) ??
        error.message;
    const details = backend?.errors ?? backend;
    throw new ApiError(
        backendMessage || "Erreur lors de la récupération de l'instructeur",
        status,
        details
    );
  }
}

// TODO: À utiliser plus tard quand le backend supportera le filtrage par spot
export async function getInstructorsBySpot(spotId: number): Promise<InstructorResponse[]> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.INSTRUCTOR}/spot/${spotId}`;
    const { data } = await apiClient.get<InstructorResponse[]>(endpoint);
    if (!Array.isArray(data)) {
      throw new ApiError("Format de réponse invalide", 500);
    }
    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const status = error.response?.status;
    const backend = error.response?.data;
    const backendMessage =
        (backend && (backend.message || backend.error || backend.title)) ??
        error.message;
    const details = backend?.errors ?? backend;
    throw new ApiError(
        backendMessage || "Erreur lors de la récupération des instructeurs du spot",
        status,
        details
    );
  }
}