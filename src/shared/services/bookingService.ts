// ============================================
// 🛹 SOSKATE - BOOKING SERVICE
// ============================================
// Appels API pour les réservations

import {
  BookingResponse,
  CreateBookingRequest,
} from "@/src/shared/types/booking.interface";
import { InstructorBookingResponse } from "@/src/features/planning/types/planning.types";
import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { handleApiError } from "@/src/api/axios/handleApiError";

/**
 * Crée une nouvelle réservation
 */
export const createBooking = async (
  customerId: number,
  bookingData: CreateBookingRequest,
): Promise<BookingResponse> => {
  try {
    const response = await apiClient.post<BookingResponse>(
      `/customers/${customerId}/bookings`,
      bookingData,
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
  instructorId: number,
): Promise<InstructorBookingResponse[]> => {
  try {
    const response = await apiClient.get<InstructorBookingResponse[]>(
      `/instructors/${instructorId}/bookings`,
    );
    if (!Array.isArray(response.data)) {
      throw new ApiError("Format de réponse invalide", 500);
    }
    return response.data;
  } catch (err) {
    return handleApiError(
      err,
      "Erreur lors de la récupération des réservations",
    );
  }
};
