// ============================================
// 🛹 SOSKATE - BOOKING SERVICE
// ============================================
// Appels API pour les réservations

import {
    BookingResponse,
    CreateBookingRequest,
    BookingListItem,
} from "@/src/shared/types/booking.interface";
import apiClient from "@/src/api/axios/axiosConfig";

/**
 * Crée une nouvelle réservation
 */
export const createBooking = async (
    customerId: number,
    bookingData: CreateBookingRequest
): Promise<BookingResponse> => {
    const response = await apiClient.post<BookingResponse>(
        `/customers/${customerId}/bookings`,
        bookingData
    );
    return response.data;
};

/**
 * Récupère les réservations d'un customer
 */
export const getCustomerBookings = async (
    customerId: number
): Promise<BookingResponse[]> => {
    const response = await apiClient.get<BookingResponse[]>(
        `/customers/${customerId}/bookings`
    );
    return response.data;
};

/**
 * Récupère une réservation par son ID
 */
export const getBookingById = async (
    bookingId: number
): Promise<BookingResponse> => {
    const response = await apiClient.get<BookingResponse>(`/bookings/${bookingId}`);
    return response.data;
};

/**
 * Annule une réservation
 * Note: Règle métier - impossible d'annuler moins de 48h avant
 */
export const cancelBooking = async (
    bookingId: number,
    reason?: string
): Promise<void> => {
    await apiClient.delete(`/bookings/${bookingId}`, {
        data: reason ? { reason } : undefined,
    });
};

/**
 * Récupère les réservations à venir d'un customer
 */
export const getUpcomingBookings = async (
    customerId: number
): Promise<BookingResponse[]> => {
    const allBookings = await getCustomerBookings(customerId);
    const now = new Date();

    return allBookings
        .filter((booking) => {
            const bookingDate = new Date(booking.startTime);
            return (
                bookingDate > now &&
                (booking.status === "PENDING" || booking.status === "CONFIRMED")
            );
        })
        .sort(
            (a, b) =>
                new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
};

/**
 * Récupère l'historique des réservations passées
 */
export const getPastBookings = async (
    customerId: number
): Promise<BookingResponse[]> => {
    const allBookings = await getCustomerBookings(customerId);
    const now = new Date();

    return allBookings
        .filter((booking) => {
            const bookingDate = new Date(booking.startTime);
            return bookingDate <= now || booking.status === "COMPLETED";
        })
        .sort(
            (a, b) =>
                new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
};

/**
 * Vérifie si une réservation peut être annulée (règle 48h)
 */
export const canCancelBooking = (booking: BookingResponse): boolean => {
    const now = new Date();
    const bookingDate = new Date(booking.startTime);
    const hoursUntilBooking =
        (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return (
        hoursUntilBooking >= 48 &&
        (booking.status === "PENDING" || booking.status === "CONFIRMED")
    );
};