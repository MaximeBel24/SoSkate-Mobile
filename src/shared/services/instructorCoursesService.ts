// ============================================
// 🛹 SOSKATE - INSTRUCTOR COURSES SERVICE
// ============================================

import {
  CourseDetail,
  CourseListItem,
  CourseStatsResponse,
} from "@/src/features/courses/types/course.types";
import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { handleApiError } from "@/src/api/axios/handleApiError";

// ============================================
// TYPES
// ============================================
export type CourseFilter = "upcoming" | "passed";

// ============================================
// SERVICE
// ============================================
/**
 * Récupère les cours d'un instructeur avec filtre
 * GET /instructors/{id}/bookings?filter=upcoming|passed
 */
export const getCourses = async (
  instructorId: number,
  filter: CourseFilter,
): Promise<CourseListItem[]> => {
  try {
    const response = await apiClient.get<CourseListItem[]>(
      `/instructors/${instructorId}/bookings`,
      { params: { filter } },
    );
    if (!Array.isArray(response.data)) {
      throw new ApiError("Format de réponse invalide", 500);
    }
    return response.data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la récupération des cours");
  }
};

/**
 * Récupère le détail complet d'une réservation
 * GET /bookings/{id}
 */
export const getCourseDetail = async (
  bookingId: number,
): Promise<CourseDetail> => {
  try {
    const response = await apiClient.get<CourseDetail>(
      `/bookings/${bookingId}`,
    );
    return response.data;
  } catch (err) {
    return handleApiError(
      err,
      "Erreur lors de la récupération des détails de la réservation",
    );
  }
};

/**
 * Récupère les statistiques de l'instructeur
 * GET /instructors/{id}/stats
 */
export const getInstructorStats = async (
  instructorId: number,
): Promise<CourseStatsResponse> => {
  try {
    const response = await apiClient.get<CourseStatsResponse>(
      `/instructors/${instructorId}/stats`,
    );
    return response.data;
  } catch (err) {
    return handleApiError(
      err,
      "Erreur lors de la récupération des statistiques",
    );
  }
};

/**
 * Annule une réservation (possible jusqu'à 24h avant)
 * DELETE /bookings/{id}
 */
export const cancelCourse = async (
  instructorId: number,
  bookingId: number,
): Promise<void> => {
  try {
    await apiClient.post(
      `/instructors/${instructorId}/bookings/${bookingId}/cancel`,
    );
  } catch (err) {
    return handleApiError(err, "Erreur lors de l'annulation de la réservation");
  }
};
