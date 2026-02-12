// ============================================
// 🛹 SOSKATE - AVAILABILITY SERVICE
// ============================================
// Appels API pour les disponibilités des instructeurs

import { AvailabilityResponse } from "@/src/shared/types/availability.interface";
import apiClient from "@/src/api/axios/axiosConfig";
import { handleApiError } from "@/src/api/axios/handleApiError";

/**
 * Récupère toutes les disponibilités d'un instructeur
 */
export const getInstructorAvailabilities = async (
  instructorId: number,
): Promise<AvailabilityResponse[]> => {
  try {
    const response = await apiClient.get<AvailabilityResponse[]>(
      `/instructors/${instructorId}/availabilities`,
    );
    return response.data;
  } catch (err) {
    return handleApiError(
      err,
      "Erreur lors de la récupération des disponibilités",
    );
  }
};

/**
 * Récupère les disponibilités d'un instructeur avec filtres from/to
 * GET /instructors/{id}/availabilities?from=&to=
 */
export const getAvailabilitiesWithFilters = async (
  instructorId: number,
  from: string,
  to: string,
): Promise<AvailabilityResponse[]> => {
  try {
    const response = await apiClient.get<AvailabilityResponse[]>(
      `/instructors/${instructorId}/available`,
      {
        params: { from, to },
      },
    );
    return response.data;
  } catch (err) {
    return handleApiError(
      err,
      "Erreur lors de la récupération des disponibilités avec filtre",
    );
  }
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
  },
): Promise<AvailabilityResponse> => {
  try {
    const response = await apiClient.post<AvailabilityResponse>(
      `/instructors/${instructorId}/availabilities`,
      data,
    );
    return response.data;
  } catch (err) {
    return handleApiError(
      err,
      "Erreur lors de la création de la disponibilité",
    );
  }
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
  },
): Promise<AvailabilityResponse> => {
  try {
    const response = await apiClient.put<AvailabilityResponse>(
      `/instructors/${instructorId}/availabilities/${availabilityId}`,
      data,
    );
    return response.data;
  } catch (err) {
    return handleApiError(
      err,
      "Erreur lors de la modification de la disponibilité",
    );
  }
};

/**
 * Supprime une disponibilité
 * DELETE /instructors/{id}/availabilities/{availabilityId}
 */
export const deleteAvailability = async (
  instructorId: number,
  availabilityId: number,
): Promise<void> => {
  try {
    await apiClient.delete(
      `/instructors/${instructorId}/availabilities/${availabilityId}`,
    );
  } catch (err) {
    return handleApiError(
      err,
      "Erreur lors de la suppression de la disponibilité",
    );
  }
};
