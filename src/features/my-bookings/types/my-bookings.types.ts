// ============================================
// 🛹 SOSKATE - MY BOOKINGS TYPES
// ============================================
// Types pour l'écran "Mes réservations"

/**
 * Statut d'une participation
 */
export type ParticipantStatus = "CONFIRMED" | "CANCELLED" | "PENDING";

/**
 * Statut d'un booking
 */
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "FULL";

/**
 * Réponse API pour "Mes réservations"
 * GET /customers/{id}/my-bookings
 */
export interface MyBookingResponse {
  // Infos participation
  participationId: number;
  participantStatus: ParticipantStatus;
  joinedAt: string;

  // Infos booking
  bookingId: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  bookingStatus: BookingStatus;
  participantsNotes: string | null;

  // Infos instructeur
  instructorId: number;
  instructorFirstname: string;
  instructorLastname: string;

  // Infos spot
  spotId: number;
  spotName: string;
  spotAddress: string;
  spotCity: string;

  // Infos service
  serviceId: number;
  serviceName: string;
  basePriceCents: number;

  // Prix calculé
  totalPriceCents: number;
}

/**
 * Requête pour modifier les notes
 * PATCH /customers/{id}/participations/{id}/notes
 */
export interface UpdateNotesRequest {
  notes: string;
}

/**
 * Requête pour annuler une participation
 * POST /customers/{id}/participations/{id}/cancel
 */
export interface CancelParticipationRequest {
  reason?: string;
}

/**
 * Sections pour l'affichage
 */
export type BookingSection = "upcoming" | "past";

/**
 * Booking groupé par section
 */
export interface GroupedBookings {
  upcoming: MyBookingResponse[];
  past: MyBookingResponse[];
}

// ============================================
// HELPERS
// ============================================

/**
 * Vérifie si une réservation peut être annulée (> 48h avant)
 */
export const canCancelBooking = (booking: MyBookingResponse): boolean => {
  if (booking.participantStatus === "CANCELLED") {
    return false;
  }
  const startTime = new Date(booking.startTime);
  const now = new Date();
  const hoursUntilStart =
    (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilStart >= 48;
};

/**
 * Vérifie si les notes peuvent être modifiées (> 24h avant)
 */
export const canEditNotes = (booking: MyBookingResponse): boolean => {
  if (
    booking.participantStatus === "CANCELLED" ||
    booking.bookingStatus === "COMPLETED"
  ) {
    return false;
  }
  const startTime = new Date(booking.startTime);
  const now = new Date();
  const hoursUntilStart =
    (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilStart >= 24;
};

/**
 * Vérifie si la réservation est passée
 */
export const isBookingPast = (booking: MyBookingResponse): boolean => {
  const startTime = new Date(booking.startTime);
  return startTime < new Date();
};

/**
 * Groupe les réservations par section (à venir / passées)
 */
export const groupBookings = (
  bookings: MyBookingResponse[],
): GroupedBookings => {
  const now = new Date();

  const upcoming = bookings
    .filter((b) => {
      const startTime = new Date(b.startTime);
      return startTime >= now && b.participantStatus !== "CANCELLED";
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

  const past = bookings
    .filter((b) => {
      const startTime = new Date(b.startTime);
      return startTime < now || b.participantStatus === "CANCELLED";
    })
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );

  return { upcoming, past };
};

/**
 * Formate le prix en euros
 */
export const formatPrice = (priceCents: number): string => {
  return `${(priceCents / 100).toFixed(2).replace(".", ",")}€`;
};

/**
 * Formate une date pour l'affichage
 */
export const formatBookingDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Formate une heure pour l'affichage
 */
export const formatBookingTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formate la durée
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h${mins.toString().padStart(2, "0")}`;
};
