// ============================================
// 🛹 SOSKATE - BOOKING SERVICE
// ============================================
// Appels API pour les réservations

import {
    BookingResponse,
    CreateBookingRequest,
} from "@/src/shared/types/booking.interface";
import apiClient from "@/src/api/axios/axiosConfig";
import {handleApiError} from "@/src/api/axios/handleApiError";

/**
 * Crée une nouvelle réservation
 */
export const createBooking = async (
    customerId: number,
    bookingData: CreateBookingRequest
): Promise<BookingResponse> => {
    try {
        const response = await apiClient.post<BookingResponse>(
            `/customers/${customerId}/bookings`,
            bookingData
        );
        return response.data;
    } catch (err) {
        return handleApiError(err, "Erreur lors de la création de la réservation");
    }
};

/**
 * Récupère les bookings d'un instructeur
 * GET /instructors/{id}/bookings
 */
export const getInstructorBookings = async (
    instructorId: number
): Promise<any[]> => {
    try {
        const response = await apiClient.get<any[]>(
            `/instructors/${instructorId}/bookings`
        );
        return response.data;
    } catch (err) {
        return handleApiError(err, "Erreur lors de la récupération des réservations");
    }
};