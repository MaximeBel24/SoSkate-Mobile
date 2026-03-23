// ============================================
// 🛹 SOSKATE - PHOTO SERVICE
// ============================================
// Service pour la gestion des photos (spots, avatars, etc.)

import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { ENDPOINTS } from "@/src/shared/constants/constants";
import { PhotoResponse } from "@/src/shared/types/photo.interface";
import { AxiosError } from "axios";
import { handleApiError } from "@/src/api/axios/handleApiError";

// ============================================
// TYPES
// ============================================
export type PhotoEntityType = "CUSTOMER" | "INSTRUCTOR" | "SPOT" | "EVENT";
export type PhotoType = "AVATAR" | "COVER" | "GALLERY" | "TRICK";

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

export interface UploadPhotoParams {
  file: {
    uri: string;
    type: string;
    name: string;
  };
  entityType: PhotoEntityType;
  entityId: number;
  photoType: PhotoType;
  uploadedBy: number;
  displayOrder?: number;
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
export const uploadAvatar = async (
  params: UploadAvatarParams,
): Promise<AvatarResponse> => {
  try {
    const endpoint = ENDPOINTS.PHOTOS;

    const formData = new FormData();

    formData.append("file", {
      uri: params.file.uri,
      type: params.file.type,
      name: params.file.name,
    } as any);

    formData.append("entityType", params.entityType);
    formData.append("entityId", params.entityId.toString());
    formData.append("photoType", "AVATAR");
    formData.append("uploadedBy", params.uploadedBy.toString());

    const { data } = await apiClient.post<AvatarResponse>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de l'upload de la photo");
  }
};

/**
 * Récupère l'avatar d'un Customer
 * Retourne null si aucun avatar (404)
 */
export const getCustomerAvatar = async (
  customerId: number,
): Promise<AvatarResponse | null> => {
  try {
    const endpoint = `${ENDPOINTS.PHOTOS}/customers/${customerId}/avatar`;
    const { data } = await apiClient.get<AvatarResponse>(endpoint);
    return data;
  } catch (err) {
    const error = err as AxiosError;

    // 404 = pas d'avatar, c'est normal
    if (error.response?.status === 404) {
      return null;
    }

    return handleApiError(err, "Erreur lors de la récupération de l'avatar");
  }
};

/**
 * Récupère l'avatar d'un Instructor
 * Retourne null si aucun avatar (404)
 */
export const getInstructorAvatar = async (
  instructorId: number,
): Promise<AvatarResponse | null> => {
  try {
    const endpoint = `${ENDPOINTS.PHOTOS}/instructors/${instructorId}/avatar`;
    const { data } = await apiClient.get<AvatarResponse>(endpoint);
    return data;
  } catch (err) {
    const error = err as AxiosError;

    // 404 = pas d'avatar, c'est normal
    if (error.response?.status === 404) {
      return null;
    }

    return handleApiError(err, "Erreur lors de la récupération de l'avatar");
  }
};

// ============================================
// SPOT PHOTOS METHODS
// ============================================

/**
 * Récupère les photos d'un spot
 * GET /api/photos/spots/{spotId}
 */
export const getSpotPhotos = async (
  spotId: number,
): Promise<PhotoResponse[]> => {
  try {
    const endpoint = `${ENDPOINTS.PHOTOS}/spots/${spotId}`;
    const { data } = await apiClient.get<PhotoResponse[]>(endpoint);

    if (!Array.isArray(data)) {
      throw new ApiError("Format de réponse invalide", 500);
    }

    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la récupération des photos");
  }
};

/**
 * Récupère les photos galerie d'un instructeur
 * GET /api/photos?entityType=INSTRUCTOR&entityId={id}&photoType=GALLERY
 */
export const getInstructorPhotos = async (
    instructorId: number,
): Promise<PhotoResponse[]> => {
  try {
    const endpoint = `${ENDPOINTS.PHOTOS}?entityType=INSTRUCTOR&entityId=${instructorId}&photoType=GALLERY`;
    const { data } = await apiClient.get<PhotoResponse[]>(endpoint);

    if (!Array.isArray(data)) {
      throw new ApiError("Format de réponse invalide", 500);
    }

    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la récupération des photos");
  }
};

/**
 * Upload une photo galerie pour un instructeur
 * POST /api/photos
 */
export const uploadInstructorPhoto = async (
    params: UploadPhotoParams,
): Promise<PhotoResponse> => {
  try {
    const formData = new FormData();

    formData.append("file", {
      uri: params.file.uri,
      type: params.file.type,
      name: params.file.name,
    } as any);

    formData.append("entityType", params.entityType);
    formData.append("entityId", params.entityId.toString());
    formData.append("photoType", params.photoType);
    formData.append("uploadedBy", params.uploadedBy.toString());

    if (params.displayOrder !== undefined) {
      formData.append("displayOrder", params.displayOrder.toString());
    }

    const { data } = await apiClient.post<PhotoResponse>(
        ENDPOINTS.PHOTOS,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
    );

    return data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de l'upload de la photo");
  }
};

/**
 * Supprime une photo (soft delete)
 * DELETE /api/photos/{id}
 */
export const deletePhoto = async (
    photoId: number,
    deletedBy: number,
): Promise<void> => {
  try {
    await apiClient.delete(
        `${ENDPOINTS.PHOTOS}/${photoId}?deletedBy=${deletedBy}`,
    );
  } catch (err) {
    return handleApiError(err, "Erreur lors de la suppression de la photo");
  }
};