// ============================================
// 🛹 SOSKATE - MY BOOKINGS SERVICE
// ============================================
// Appels API pour "Mes réservations"

import {
    MyBookingResponse,
    UpdateNotesRequest,
    CancelParticipationRequest,
} from "@/src/features/my-bookings/types/my-bookings.types";
import apiClient from "@/src/api/axios/axiosConfig";

/**
 * Récupère toutes les réservations d'un customer
 */
export const getMyBookings = async (
    customerId: number
): Promise<MyBookingResponse[]> => {
    const response = await apiClient.get<MyBookingResponse[]>(
        `/customers/${customerId}/my-bookings`
    );
    return response.data;
};

/**
 * Annule une participation
 */
export const cancelParticipation = async (
    customerId: number,
    participationId: number,
    reason?: string
): Promise<void> => {
    const request: CancelParticipationRequest = reason ? { reason } : {};
    await apiClient.post(
        `/customers/${customerId}/participations/${participationId}/cancel`,
        request
    );
};

/**
 * Modifie les notes d'une réservation
 */
export const updateBookingNotes = async (
    customerId: number,
    participationId: number,
    notes: string
): Promise<MyBookingResponse> => {
    const request: UpdateNotesRequest = { notes };
    const response = await apiClient.patch<MyBookingResponse>(
        `/customers/${customerId}/participations/${participationId}/notes`,
        request
    );
    return response.data;
};