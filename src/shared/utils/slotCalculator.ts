// ============================================
// 🛹 SOSKATE - SLOT CALCULATOR
// ============================================
// Calcule les créneaux disponibles à partir des plages de disponibilité

import { AvailabilityResponse, TimeSlot } from "@/src/shared/types/availability.interface";

/**
 * Intervalle entre les créneaux de départ (en minutes)
 * Ex: 30 = créneaux à 14:00, 14:30, 15:00...
 */
const SLOT_INTERVAL_MINUTES = 30;

/**
 * Convertit une heure "HH:MM:SS" ou "HH:MM" en minutes depuis minuit
 */
const timeToMinutes = (time: string): number => {
    const parts = time.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    return hours * 60 + minutes;
};

/**
 * Convertit des minutes depuis minuit en heure "HH:MM"
 */
const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

/**
 * Calcule tous les créneaux possibles pour une plage de disponibilité
 * et une durée de cours donnée
 *
 * @param availability - Plage de disponibilité de l'instructeur
 * @param durationMinutes - Durée du cours souhaitée
 * @returns Liste des créneaux possibles
 *
 * @example
 * // Dispo: 14:00 -> 19:00, Durée: 2h
 * // Retourne: [14:00-16:00, 14:30-16:30, 15:00-17:00, ...]
 */
export const calculateSlotsForAvailability = (
    availability: AvailabilityResponse,
    durationMinutes: number
): TimeSlot[] => {
    const slots: TimeSlot[] = [];

    const startMinutes = timeToMinutes(availability.startTime);
    const endMinutes = timeToMinutes(availability.endTime);

    // Parcourir chaque créneau de départ possible
    let currentStart = startMinutes;

    while (currentStart + durationMinutes <= endMinutes) {
        const slotEnd = currentStart + durationMinutes;

        slots.push({
            id: `${availability.id}-${currentStart}`,
            startTime: minutesToTime(currentStart),
            endTime: minutesToTime(slotEnd),
            availabilityId: availability.id,
        });

        currentStart += SLOT_INTERVAL_MINUTES;
    }

    return slots;
};

/**
 * Calcule tous les créneaux possibles pour une date donnée
 * à partir de toutes les disponibilités de cette date
 *
 * @param availabilities - Liste des disponibilités pour la date
 * @param durationMinutes - Durée du cours souhaitée
 * @returns Liste des créneaux possibles, triés par heure
 */
export const calculateSlotsForDate = (
    availabilities: AvailabilityResponse[],
    durationMinutes: number
): TimeSlot[] => {
    // Filtrer uniquement les disponibilités AVAILABLE
    const activeAvailabilities = availabilities.filter(
        (a) => a.status === "AVAILABLE"
    );

    // Calculer les créneaux pour chaque disponibilité
    const allSlots = activeAvailabilities.flatMap((availability) =>
        calculateSlotsForAvailability(availability, durationMinutes)
    );

    // Trier par heure de début
    return allSlots.sort((a, b) => {
        const aMinutes = timeToMinutes(a.startTime);
        const bMinutes = timeToMinutes(b.startTime);
        return aMinutes - bMinutes;
    });
};

/**
 * Vérifie si une durée donnée peut tenir dans au moins une disponibilité
 *
 * @param availabilities - Liste des disponibilités
 * @param durationMinutes - Durée à vérifier
 * @returns true si au moins un créneau est possible
 */
export const isDurationAvailable = (
    availabilities: AvailabilityResponse[],
    durationMinutes: number
): boolean => {
    return availabilities.some((availability) => {
        if (availability.status !== "AVAILABLE") return false;

        const startMinutes = timeToMinutes(availability.startTime);
        const endMinutes = timeToMinutes(availability.endTime);
        const availableDuration = endMinutes - startMinutes;

        return availableDuration >= durationMinutes;
    });
};

/**
 * Retourne les durées disponibles pour une liste de disponibilités
 * (filtre les durées qui ne peuvent pas tenir dans les plages)
 *
 * @param availabilities - Liste des disponibilités
 * @param allDurations - Toutes les durées possibles (en minutes)
 * @returns Durées qui peuvent tenir dans au moins une plage
 */
export const getAvailableDurations = (
    availabilities: AvailabilityResponse[],
    allDurations: number[]
): number[] => {
    return allDurations.filter((duration) =>
        isDurationAvailable(availabilities, duration)
    );
};

/**
 * Formate un créneau pour l'affichage
 * @example "14:00 → 16:00"
 */
export const formatSlotDisplay = (slot: TimeSlot): string => {
    return `${slot.startTime} → ${slot.endTime}`;
};

/**
 * Vérifie si un créneau est dans le passé
 */
export const isSlotInPast = (date: string, slot: TimeSlot): boolean => {
    const now = new Date();
    const slotDateTime = new Date(`${date}T${slot.startTime}:00`);
    return slotDateTime <= now;
};

/**
 * Filtre les créneaux passés pour aujourd'hui
 */
export const filterPastSlots = (date: string, slots: TimeSlot[]): TimeSlot[] => {
    const today = new Date().toISOString().split("T")[0];

    // Si ce n'est pas aujourd'hui, tous les créneaux sont valides
    if (date !== today) {
        return slots;
    }

    // Filtrer les créneaux passés
    return slots.filter((slot) => !isSlotInPast(date, slot));
};