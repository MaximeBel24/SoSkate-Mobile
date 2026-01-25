// ============================================
// 🛹 SOSKATE - INSTRUCTOR SPOTS SERVICE
// ============================================
// Appels API pour gérer les spots d'un instructeur

import {
    InstructorSpotResponse,
    AddSpotRequest,
} from "@/src/features/instructor-spots/types/instructor-spots.types";
import apiClient from "@/src/api/axios/axiosConfig";

/**
 * Récupère tous les spots associés à un instructeur
 * GET /instructors/{id}/spots
 */
export const getInstructorSpots = async (
    instructorId: number
): Promise<InstructorSpotResponse[]> => {
    const response = await apiClient.get<InstructorSpotResponse[]>(
        `/instructors/${instructorId}/spots`
    );
    return response.data;
};

/**
 * Associe un spot à un instructeur
 * POST /instructors/{id}/spots
 */
export const addSpotToInstructor = async (
    instructorId: number,
    spotId: number
): Promise<InstructorSpotResponse> => {
    const request: AddSpotRequest = { spotId };
    const response = await apiClient.post<InstructorSpotResponse>(
        `/instructors/${instructorId}/spots`,
        request
    );
    return response.data;
};

/**
 * Retire un spot d'un instructeur
 * DELETE /instructors/{id}/spots/{spotId}
 */
export const removeSpotFromInstructor = async (
    instructorId: number,
    spotId: number
): Promise<void> => {
    await apiClient.delete(`/instructors/${instructorId}/spots/${spotId}`);
};

/**
 * Vérifie si un instructeur est associé à un spot
 */
export const isInstructorAssociatedToSpot = async (
    instructorId: number,
    spotId: number
): Promise<boolean> => {
    try {
        const spots = await getInstructorSpots(instructorId);
        return spots.some((s) => s.spot.id === spotId);
    } catch (error) {
        console.error("Erreur vérification association:", error);
        return false;
    }
};