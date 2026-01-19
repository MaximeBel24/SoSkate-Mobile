// ============================================
// 🛹 SOSKATE - PHOTO SERVICE
// ============================================
// Service pour la gestion des photos (spots, avatars, etc.)

import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { API_CONFIG, ENDPOINTS } from "@/src/shared/constants/constants";
import { PhotoResponse } from "@/src/shared/types/photo.interface";
import { AxiosError } from "axios";

// ============================================
// TYPES
// ============================================
export type PhotoEntityType = "CUSTOMER" | "INSTRUCTOR" | "SPOT" | "EVENT";
export type PhotoType = "AVATAR" | "COVER" | "GALLERY";

export interface UploadAvatarParams {
  file: {
    uri: string;
    type: string;
    name: string;
  };
  entityType: PhotoEntityType;
  entityId: number;
  uploadedBy: number;
}

export interface AvatarResponse {
  id: number;
  url: string;
  thumbnailUrl?: string;
  photoType: PhotoType;
  entityType: PhotoEntityType;
  entityId: number;
  createdAt: string;
}

// ============================================
// AVATAR METHODS
// ============================================

/**
 * Upload un avatar pour un Customer ou Instructor
 */
export async function uploadAvatar(
  params: UploadAvatarParams,
): Promise<AvatarResponse> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.PHOTOS}`;

    // Créer le FormData
    const formData = new FormData();

    // Ajouter le fichier
    formData.append("file", {
      uri: params.file.uri,
      type: params.file.type,
      name: params.file.name,
    } as any);

    // Ajouter les métadonnées
    formData.append("entityType", params.entityType);
    formData.append("entityId", params.entityId.toString());
    formData.append("photoType", "AVATAR");
    formData.append("uploadedBy", params.uploadedBy.toString());

    console.log("📤 Uploading avatar:", {
      entityType: params.entityType,
      entityId: params.entityId,
      fileName: params.file.name,
    });

    const { data } = await apiClient.post<AvatarResponse>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Avatar uploaded successfully:", data.url);

    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const status = error.response?.status;
    const backend = error.response?.data;

    const backendMessage =
      (backend && (backend.message || backend.error || backend.title)) ??
      error.message;

    console.error("❌ Error uploading avatar:", {
      status,
      backendMessage,
    });

    throw new ApiError(
      backendMessage || "Erreur lors de l'upload de la photo",
      status,
    );
  }
}

/**
 * Récupère l'avatar d'un Customer
 */
export async function getCustomerAvatar(
  customerId: number,
): Promise<AvatarResponse | null> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.PHOTOS}/customers/${customerId}/avatar`;

    console.log("🔍 Fetching customer avatar:", customerId);

    const { data } = await apiClient.get<AvatarResponse>(endpoint);

    console.log("✅ Customer avatar found:", data.url);

    return data;
  } catch (err) {
    const error = err as AxiosError<any>;

    // 404 = pas d'avatar, c'est normal
    if (error.response?.status === 404) {
      console.log("ℹ️ No avatar found for customer:", customerId);
      return null;
    }

    const status = error.response?.status;
    const backend = error.response?.data;

    const backendMessage =
      (backend && (backend.message || backend.error || backend.title)) ??
      error.message;

    console.error("❌ Error fetching customer avatar:", {
      status,
      backendMessage,
    });

    throw new ApiError(
      backendMessage || "Erreur lors de la récupération de l'avatar",
      status,
    );
  }
}

/**
 * Récupère l'avatar d'un Instructor
 */
export async function getInstructorAvatar(
  instructorId: number,
): Promise<AvatarResponse | null> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.PHOTOS}/instructors/${instructorId}/avatar`;

    console.log("🔍 Fetching instructor avatar:", instructorId);

    const { data } = await apiClient.get<AvatarResponse>(endpoint);

    console.log("✅ Instructor avatar found:", data.url);

    return data;
  } catch (err) {
    const error = err as AxiosError<any>;

    // 404 = pas d'avatar, c'est normal
    if (error.response?.status === 404) {
      console.log("ℹ️ No avatar found for instructor:", instructorId);
      return null;
    }

    const status = error.response?.status;
    const backend = error.response?.data;

    const backendMessage =
      (backend && (backend.message || backend.error || backend.title)) ??
      error.message;

    console.error("❌ Error fetching instructor avatar:", {
      status,
      backendMessage,
    });

    throw new ApiError(
      backendMessage || "Erreur lors de la récupération de l'avatar",
      status,
    );
  }
}

// ============================================
// SPOT PHOTOS METHODS
// ============================================

/**
 * Get photos for a specific spot.
 * Uses the dedicated endpoint: GET /api/photos/spots/{spotId}
 */
export async function getSpotPhotos(spotId: number): Promise<PhotoResponse[]> {
  try {
    const endpoint = `${API_CONFIG.BASE_URL}${ENDPOINTS.PHOTOS}/spots/${spotId}`;

    console.log("🔍 Fetching photos for spot:", spotId);

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
      details,
    );
  }
}

/**
 * Get photos for a specific instructor.
 * TODO: Implement when instructor photo endpoint is available.
 */
export async function getInstructorPhotos(
  instructorId: number,
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
  eventId: number,
): Promise<PhotoResponse[]> {
  // TODO: Attendre l'implémentation backend
  console.warn("getEventPhotos not yet implemented");
  return [];
}
