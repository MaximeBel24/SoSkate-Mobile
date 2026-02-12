// ============================================
// SOSKATE - INSTRUCTOR SPOTS SERVICE
// ============================================
// Appels API pour gérer les relations Instructor <-> Spot
//
// Deux directions :
// - Instructor → Spots : quels spots pour un instructeur
// - Spot → Instructors : quels instructeurs pour un spot

import apiClient from "@/src/api/axios/axiosConfig";
import {
  InstructorSpotResponse,
  AddSpotRequest,
} from "@/src/features/instructor-spots/types/instructor-spots.types";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";
import { handleApiError } from "@/src/api/axios/handleApiError";
import { ApiError } from "@/src/api/axios/apiError";

// ============================================
// INSTRUCTOR → SPOTS
// ============================================

/**
 * Récupère tous les spots associés à un instructeur
 */
export const getInstructorSpots = async (
  instructorId: number,
): Promise<InstructorSpotResponse[]> => {
  try {
    const response = await apiClient.get<InstructorSpotResponse[]>(
      `/instructors/${instructorId}/spots`,
    );
    return response.data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la récupération des spots");
  }
};

/**
 * Associe un spot à un instructeur
 */
export const addSpotToInstructor = async (
  instructorId: number,
  spotId: number,
): Promise<InstructorSpotResponse> => {
  try {
    const request: AddSpotRequest = { spotId };
    const response = await apiClient.post<InstructorSpotResponse>(
      `/instructors/${instructorId}/spots`,
      request,
    );
    return response.data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de l'association du spot");
  }
};

/**
 * Retire un spot d'un instructeur
 */
export const removeSpotFromInstructor = async (
  instructorId: number,
  spotId: number,
): Promise<void> => {
  try {
    await apiClient.delete(`/instructors/${instructorId}/spots/${spotId}`);
  } catch (err) {
    return handleApiError(err, "Erreur lors de la suppression du spot");
  }
};

/**
 * Récupère tous les instructeurs associés à un spot
 */
export const getInstructorsBySpot = async (
  spotId: number,
): Promise<InstructorResponse[]> => {
  try {
    const response = await apiClient.get<InstructorResponse[]>(
      `/spots/${spotId}/instructors`,
    );
    if (!Array.isArray(response.data)) {
      throw new ApiError("Format de réponse invalide", 500);
    }
    return response.data;
  } catch (err) {
    return handleApiError(
      err,
      "Erreur lors de la récupération des instructeurs",
    );
  }
};
