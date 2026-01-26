// ============================================
// 🛹 SOSKATE - AVAILABILITY TYPES
// ============================================
// Types pour les disponibilités des instructeurs

/**
 * Statut d'une disponibilité
 */
export type AvailabilityStatus = "AVAILABLE" | "BOOKED" | "CANCELLED";

/**
 * Réponse API pour une disponibilité d'instructeur
 * GET /instructors/{id}/availabilities
 */
export interface AvailabilityResponse {
    id: number;
    instructorId: number;
    date: string; // "2026-01-20"
    startTime: string; // "15:00:00"
    endTime: string; // "19:00:00"
    available: boolean;
    status: AvailabilityStatus;
    createdAt: string;
}

/**
 * Créneau calculé à partir d'une disponibilité
 * (généré côté client selon la durée choisie)
 */
export interface TimeSlot {
    id: string; // Unique ID pour React key
    startTime: string; // "14:00"
    endTime: string; // "16:00"
    availabilityId: number; // Référence à la dispo source
}

/**
 * Disponibilités groupées par date
 */
export interface AvailabilityByDate {
    [date: string]: AvailabilityResponse[];
}

/**
 * Paramètres pour récupérer les disponibilités
 */
export interface GetAvailabilityParams {
    instructorId: number;
    startDate?: string;
    endDate?: string;
}