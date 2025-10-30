import {SpotResponse} from "@/interfaces/spot.interface";
import {API_CONFIG, ENDPOINTS} from "@/constants/constants";
import apiClient from "@/api/axiosConfig";
import {AxiosError} from "axios";
import {ApiError} from "@/api/apiError";

export async function getAllSpots(): Promise<SpotResponse[]> {

    try {
        const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.SPOTS}`
        const { data } = await apiClient.get<SpotResponse[]>(endpoint);
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