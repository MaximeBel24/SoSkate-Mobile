// ============================================
// 🛹 SOSKATE - INSTRUCTOR COURSES SERVICE
// ============================================

import {
    CourseDetail,
    CourseListItem,
    CourseStatsResponse,
} from "@/src/features/courses/types/course.types";
import apiClient from "@/src/api/axios/axiosConfig";

// ============================================
// TYPES
// ============================================
export type CourseFilter = "upcoming" | "passed";

// ============================================
// SERVICE
// ============================================
export const instructorCoursesService = {
    /**
     * Récupère les cours d'un instructeur avec filtre
     * GET /instructors/{id}/bookings?filter=upcoming|passed
     */
    getCourses: async (
        instructorId: number,
        filter: CourseFilter
    ): Promise<CourseListItem[]> => {
        const response = await apiClient.get<CourseListItem[]>(
            `/instructors/${instructorId}/bookings`,
            { params: { filter } }
        );
        return response.data;
    },

    /**
     * Récupère le détail complet d'une réservation
     * GET /bookings/{id}
     */
    getCourseDetail: async (bookingId: number): Promise<CourseDetail> => {
        const response = await apiClient.get<CourseDetail>(
            `/bookings/${bookingId}`
        );
        return response.data;
    },

    /**
     * Récupère les statistiques de l'instructeur
     * GET /instructors/{id}/stats
     */
    getInstructorStats: async (
        instructorId: number
    ): Promise<CourseStatsResponse> => {
        const response = await apiClient.get<CourseStatsResponse>(
            `/instructors/${instructorId}/stats`
        );
        return response.data;
    },

    /**
     * Annule une réservation (possible jusqu'à 24h avant)
     * DELETE /bookings/{id}
     */
    cancelCourse: async (bookingId: number, reason?: string): Promise<void> => {
        await apiClient.delete(`/bookings/${bookingId}`, {
            data: { reason },
        });
    },
};

export default instructorCoursesService;
