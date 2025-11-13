import { ApiError } from "@/api/apiError";
import apiClient from "@/api/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/constants/constants";
import { SpotResponse } from "@/interfaces/spot.interface";
import { AxiosError } from "axios";

export async function getActiveSpots(): Promise<SpotResponse[]> {
    try {
        const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.SPOTS}/active`;
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

export async function getSpotById(id: number): Promise<SpotResponse> {
    try {
        const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.SPOTS}/${id}`;
        const { data } = await apiClient.get<SpotResponse>(endpoint);
        return data;
    } catch (err) {
        const error = err as AxiosError<any>;

        const status = error.response?.status;
        const backend = error.response?.data;

        const backendMessage =
            (backend && (backend.message || backend.error || backend.title)) ??
            error.message;

        const details = backend?.errors ?? backend;

        // Message personnalisé si 404
        const finalMessage = status === 404
            ? "Spot introuvable"
            : backendMessage || "Erreur lors de la récupération du spot";

        throw new ApiError(
            finalMessage,
            status,
            details
        );
    }
}