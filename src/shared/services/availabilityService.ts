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
 * Récupère les disponibilités d'un instructeur pour une période donnée
 */
export const getInstructorAvailabilitiesForPeriod = async (
    instructorId: number,
    startDate: string,
    endDate: string
): Promise<AvailabilityResponse[]> => {
    const response = await apiClient.get<AvailabilityResponse[]>(
        `/instructors/${instructorId}/availabilities`,
        {
            params: {
                startDate,
                endDate,
            },
        }
    );
    return response.data;
};

/**
 * Récupère les disponibilités d'un instructeur pour une date spécifique
 */
export const getInstructorAvailabilitiesForDate = async (
    instructorId: number,
    date: string
): Promise<AvailabilityResponse[]> => {
    const allAvailabilities = await getInstructorAvailabilities(instructorId);

    // Filtrer par date et statut AVAILABLE
    return allAvailabilities.filter(
        (availability) =>
            availability.date === date && availability.status === "AVAILABLE"
    );
};

/**
 * Vérifie si un instructeur a des disponibilités pour une semaine donnée
 */
export const getWeekAvailabilities = async (
    instructorId: number,
    weekStartDate: string
): Promise<Map<string, boolean>> => {
    const allAvailabilities = await getInstructorAvailabilities(instructorId);

    // Créer une map date -> hasAvailability
    const availabilityMap = new Map<string, boolean>();

    // Générer les 7 jours de la semaine
    const startDate = new Date(weekStartDate);
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateString = currentDate.toISOString().split("T")[0];

        // Vérifier si au moins une dispo existe pour cette date
        const hasAvailability = allAvailabilities.some(
            (a) => a.date === dateString && a.status === "AVAILABLE"
        );
        availabilityMap.set(dateString, hasAvailability);
    }

    return availabilityMap;
};