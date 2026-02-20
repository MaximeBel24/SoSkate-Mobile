// ============================================
// 🛹 SOSKATE - MY BOOKINGS SERVICE
// ============================================
// Appels API pour "Mes réservations"

import {
  MyBookingResponse,
  UpdateNotesRequest,
  CancelParticipationRequest,
} from "@/src/features/my-bookings/types/my-bookings.types";
import { ApiError } from "@/src/api/axios/apiError";
import apiClient from "@/src/api/axios/axiosConfig";
import { handleApiError } from "@/src/api/axios/handleApiError";

/**
 * Récupère toutes les réservations d'un customer
 */
export const getMyBookings = async (
  customerId: number,
): Promise<MyBookingResponse[]> => {
  try {
    const response = await apiClient.get<MyBookingResponse[]>(
      `/customers/${customerId}/my-bookings`,
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

/**
 * Annule une participation
 */
export const cancelParticipation = async (
  customerId: number,
  participationId: number,
  reason?: string,
): Promise<void> => {
  try {
    const request: CancelParticipationRequest = reason ? { reason } : {};
    await apiClient.post(
      `/customers/${customerId}/participations/${participationId}/cancel`,
      request,
    );
  } catch (err) {
    return handleApiError(
      err,
      "Erreur lors de l'annulation de la participation",
    );
  }
};

/**
 * Modifie les notes d'une réservation
 */
export const updateBookingNotes = async (
  customerId: number,
  participationId: number,
  notes: string,
): Promise<MyBookingResponse> => {
  try {
    const request: UpdateNotesRequest = { notes };
    const response = await apiClient.patch<MyBookingResponse>(
      `/customers/${customerId}/participations/${participationId}/notes`,
      request,
    );
    return response.data;
  } catch (err) {
    return handleApiError(err, "Erreur lors de la modification des notes");
  }
};
