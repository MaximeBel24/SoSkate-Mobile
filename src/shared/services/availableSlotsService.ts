// ============================================
// 🛹 SOSKATE - AVAILABLE SLOTS SERVICE
// ============================================
// Service pour récupérer les créneaux disponibles
// Utilise l'endpoint backend qui calcule tout (réservations, buffers, etc.)


import apiClient from "@/src/api/axios/axiosConfig";

/**
 * Réponse d'un créneau horaire
 */
export interface TimeSlotApiResponse {
    startTime: string; // "14:00:00"
    endTime: string;   // "15:30:00"
    available: boolean;
}

/**
 * Réponse de l'API available-slots
 */
export interface AvailableSlotsApiResponse {
    instructorId: number;
    spotId: number;
    date: string; // "2026-01-29"
    durationMinutes: number;
    slots: TimeSlotApiResponse[];
}

/**
 * Créneau formaté pour l'UI
 */
export interface TimeSlot {
    id: string;
    startTime: string; // "14:00"
    endTime: string;   // "15:30"
    available: boolean;
}

/**
 * Récupère les créneaux disponibles pour un instructeur, spot, date et durée
 *
 * GET /instructors/{instructorId}/available-slots?spotId=X&date=Y&durationMinutes=Z
 */
export const getAvailableSlots = async (
    instructorId: number,
    spotId: number,
    date: string,
    durationMinutes: number
): Promise<TimeSlot[]> => {
    try {
        const response = await apiClient.get<AvailableSlotsApiResponse>(
            `/instructors/${instructorId}/available-slots`,
            {
                params: {
                    spotId,
                    date,
                    durationMinutes,
                },
            }
        );

        // Transformer les slots pour l'UI
        return response.data.slots
            .filter(slot => slot.available) // Ne garder que les créneaux disponibles
            .map((slot, index) => ({
                id: `${date}-${slot.startTime}-${index}`,
                startTime: formatTime(slot.startTime),
                endTime: formatTime(slot.endTime),
                available: slot.available,
            }));
    } catch (error) {
        console.error("Erreur lors de la récupération des créneaux:", error);
        throw error;
    }
};

/**
 * Récupère TOUS les créneaux (disponibles et indisponibles) pour debug/affichage
 */
export const getAllSlots = async (
    instructorId: number,
    spotId: number,
    date: string,
    durationMinutes: number
): Promise<TimeSlot[]> => {
    try {
        const response = await apiClient.get<AvailableSlotsApiResponse>(
            `/instructors/${instructorId}/available-slots`,
            {
                params: {
                    spotId,
                    date,
                    durationMinutes,
                },
            }
        );

        return response.data.slots.map((slot, index) => ({
            id: `${date}-${slot.startTime}-${index}`,
            startTime: formatTime(slot.startTime),
            endTime: formatTime(slot.endTime),
            available: slot.available,
        }));
    } catch (error) {
        console.error("Erreur lors de la récupération des créneaux:", error);
        throw error;
    }
};

/**
 * Formate une heure "HH:MM:SS" en "HH:MM"
 */
const formatTime = (time: string): string => {
    // Si déjà au format "HH:MM", retourner tel quel
    if (time.length === 5) return time;
    // Sinon, prendre les 5 premiers caractères "HH:MM:SS" -> "HH:MM"
    return time.substring(0, 5);
};