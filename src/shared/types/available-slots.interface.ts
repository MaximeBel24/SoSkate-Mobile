/**
 * Réponse d'un créneau horaire
 */
export interface TimeSlotApiResponse {
  startTime: string; // "14:00:00"
  endTime: string; // "15:30:00"
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
  endTime: string; // "15:30"
  available: boolean;
}
