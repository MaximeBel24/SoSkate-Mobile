import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/src/shared/constants/constants";
import { ServiceResponse } from "@/src/shared/types/service.interface";
import { AxiosError } from "axios";

export async function getActiveServices(): Promise<ServiceResponse[]> {
    try {
        const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.SERVICES}/active`;
        const { data } = await apiClient.get<ServiceResponse[]>(endpoint);
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
            backendMessage || "Erreur lors de la récupération des spots",
            status,
            details
        );
    }
}

export async function getServiceById(id: number): Promise<ServiceResponse> {
    try {
        const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.SERVICES}/${id}`;
        const { data } = await apiClient.get<ServiceResponse>(endpoint);
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
            backendMessage || "Erreur lors de la récupération des spots",
            status,
            details
        );
    }
}

