import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/src/shared/constants/constants";
import { PhotoResponse } from "@/src/shared/types/photo.interface";
import { AxiosError } from "axios";

/**
 * Get photos for a specific spot.
 * Uses the dedicated endpoint: GET /api/photos/spots/{spotId}
 */
export async function getSpotPhotos(spotId: number): Promise<PhotoResponse[]> {
  try {
    // ✅ Endpoint dédié pour les photos de spots
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.PHOTOS}/spots/${spotId}`;

    console.log("🔍 Fetching photos for spot:", spotId);
    console.log("📍 Endpoint:", endpoint);

    const { data } = await apiClient.get<PhotoResponse[]>(endpoint);

    console.log("✅ Photos received:", data.length, "photos");

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

    console.error("❌ Error fetching photos:", {
      status,
      backendMessage,
      details,
    });

    throw new ApiError(
      backendMessage || "Erreur lors de la récupération des photos",
      status,
      details
    );
  }
}

/**
 * Get photos for a specific instructor.
 * TODO: Implement when instructor photo endpoint is available.
 */
export async function getInstructorPhotos(
  instructorId: number
): Promise<PhotoResponse[]> {
  // TODO: Attendre l'implémentation backend
  console.warn("getInstructorPhotos not yet implemented");
  return [];
}

/**
 * Get photos for a specific event.
 * TODO: Implement when event photo endpoint is available.
 */
export async function getEventPhotos(
  eventId: number
): Promise<PhotoResponse[]> {
  // TODO: Attendre l'implémentation backend
  console.warn("getEventPhotos not yet implemented");
  return [];
}
