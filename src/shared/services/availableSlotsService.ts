// ============================================
// 🛹 SOSKATE - AVAILABLE SLOTS SERVICE
// ============================================
// Service pour récupérer les créneaux disponibles
// Utilise l'endpoint backend qui calcule tout (réservations, buffers, etc.)

import apiClient from "@/src/api/axios/axiosConfig";
import {handleApiError} from "@/src/api/axios/handleApiError";
import {AvailableSlotsApiResponse, TimeSlot} from "@/src/shared/types/available-slots.interface";

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
            `/instructors/${instructorId}/bookable`,
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
    } catch (err) {
        return handleApiError(err, "Erreur lors de la récupération des créneaux disponibles");
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