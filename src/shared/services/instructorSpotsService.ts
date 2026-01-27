// ============================================
// SOSKATE - INSTRUCTOR SPOTS SERVICE
// ============================================
// Appels API pour gérer les relations Instructor <-> Spot
//
// Deux directions :
// - Instructor → Spots : quels spots pour un instructeur
// - Spot → Instructors : quels instructeurs pour un spot

import apiClient from "@/src/api/axios/axiosConfig";
import { ApiError } from "@/src/api/axios/apiError";
import { AxiosError } from "axios";
import {
    InstructorSpotResponse,
    AddSpotRequest,
} from "@/src/features/instructor-spots/types/instructor-spots.types";
import { InstructorResponse } from "@/src/shared/types/instructor.interface";

// ============================================
// INSTRUCTOR → SPOTS
// ============================================

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
        console.error("[instructorSpotsService] isInstructorAssociatedToSpot error:", error);
        return false;
    }
};

// ============================================
// SPOT → INSTRUCTORS
// ============================================

/**
 * Récupère tous les instructeurs associés à un spot
 * GET /spots/{id}/instructors
 */
export const getInstructorsBySpot = async (
    spotId: number
): Promise<InstructorResponse[]> => {
    try {
        const response = await apiClient.get<InstructorResponse[]>(
            `/spots/${spotId}/instructors`
        );

        if (!Array.isArray(response.data)) {
            throw new ApiError("Format de réponse invalide", 500);
        }

        return response.data;
    } catch (err) {
        const error = err as AxiosError<{ message?: string; error?: string; title?: string; errors?: unknown }>;
        const status = error.response?.status;
        const backend = error.response?.data;
        const backendMessage =
            backend?.message || backend?.error || backend?.title || error.message;
        const details = backend?.errors ?? backend;

        throw new ApiError(
            backendMessage || "Erreur lors de la récupération des instructeurs du spot",
            status,
            details
        );
    }
};
