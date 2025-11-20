import { ApiError } from "@/api/apiError";
import apiClient from "@/api/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/constants/constants";
import { PhotoEntityType, PhotoResponse } from "@/interfaces/photo.interface";
import { AxiosError } from "axios";

/**
 * Service for fetching photos by entity type and ID.
 */
export async function getPhotosByEntity(
    entityType: PhotoEntityType,
    entityId: number
): Promise<PhotoResponse[]> {
    try {
        const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.PHOTOS}`;
        const { data } = await apiClient.get<PhotoResponse[]>(endpoint, {
            params: {
                entityType,
                entityId,
            },
        });

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
            backendMessage || "Erreur lors de la récupération des photos",
            status,
            details
        );
    }
}

/**
 * Get photos for a specific spot.
 * Convenience method that wraps getPhotosByEntity.
 */
export async function getSpotPhotos(spotId: number): Promise<PhotoResponse[]> {
    return getPhotosByEntity(PhotoEntityType.SPOT, spotId);
}

/**
 * Get photos for a specific instructor.
 */
export async function getInstructorPhotos(instructorId: number): Promise<PhotoResponse[]> {
    return getPhotosByEntity(PhotoEntityType.INSTRUCTOR, instructorId);
}

/**
 * Get photos for a specific event.
 */
export async function getEventPhotos(eventId: number): Promise<PhotoResponse[]> {
    return getPhotosByEntity(PhotoEntityType.EVENT, eventId);
}