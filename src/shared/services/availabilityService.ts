// ============================================
// 🛹 SOSKATE - AVAILABILITY SERVICE
// ============================================
// Appels API pour les disponibilités des instructeurs


import {AvailabilityResponse} from "@/src/shared/types/availability.interface";
import apiClient from "@/src/api/axios/axiosConfig";

/**
 * Récupère toutes les disponibilités d'un instructeur
 */
export const getInstructorAvailabilities = async (
    instructorId: number
): Promise<AvailabilityResponse[]> => {
    const response = await apiClient.get<AvailabilityResponse[]>(
        `/instructors/${instructorId}/availabilities`
    );
    return response.data;
};

/**
 * Récupère les disponibilités d'un instructeur avec filtres from/to
 * GET /instructors/{id}/availabilities?from=&to=
 */
export const getAvailabilitiesWithFilters = async (
    instructorId: number,
    from: string,
    to: string
): Promise<AvailabilityResponse[]> => {
    const response = await apiClient.get<AvailabilityResponse[]>(
        `/instructors/${instructorId}/planning-slots`,
        {
            params: { from, to },
        }
    );
    return response.data;
};

/**
 * Crée une nouvelle disponibilité
 * POST /instructors/{id}/availabilities
 */
export const createAvailability = async (
    instructorId: number,
    data: {
        date: string;
        startTime: string;
        endTime: string;
    }
): Promise<AvailabilityResponse> => {
    const response = await apiClient.post<AvailabilityResponse>(
        `/instructors/${instructorId}/availabilities`,
        data
    );
    return response.data;
};

/**
 * Modifie une disponibilité existante
 * PUT /instructors/{id}/availabilities/{availabilityId}
 */
export const updateAvailability = async (
    instructorId: number,
    availabilityId: number,
    data: {
        startTime: string;
        endTime: string;
    }
): Promise<AvailabilityResponse> => {
    const response = await apiClient.put<AvailabilityResponse>(
        `/instructors/${instructorId}/availabilities/${availabilityId}`,
        data
    );
    return response.data;
};

/**
 * Supprime une disponibilité
 * DELETE /instructors/{id}/availabilities/{availabilityId}
 */
export const deleteAvailability = async (
    instructorId: number,
    availabilityId: number
): Promise<void> => {
    await apiClient.delete(
        `/instructors/${instructorId}/availabilities/${availabilityId}`
    );
};























