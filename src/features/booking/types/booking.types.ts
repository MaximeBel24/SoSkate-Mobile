// ============================================
// 🛹 SOSKATE - BOOKING FLOW TYPES
// ============================================
// Types internes pour le flow de réservation

import { TimeSlot } from "@/src/shared/services/availableSlotsService";

/**
 * Étapes du flow de réservation
 */
export type BookingStep = "date" | "slot" | "summary";

/**
 * Options de durée disponibles
 */
export interface DurationOption {
    label: string;
    value: number; // en minutes
}

/**
 * Liste des durées disponibles
 */
export const DURATION_OPTIONS: DurationOption[] = [
    { label: "1h", value: 60 },
    { label: "1h30", value: 90 },
    { label: "2h", value: 120 },
    { label: "2h30", value: 150 },
    { label: "3h", value: 180 },
    { label: "4h", value: 240 },
];

/**
 * Données passées à l'écran de booking depuis SpotCard
 */
export interface BookingParams {
    spotId: number;
    spotName: string;
    spotAddress: string;
    instructorId: number;
    instructorFirstName: string;
    instructorLastName: string;
    serviceId: number;
    serviceName: string;
    basePriceCents: number; // Prix en centimes par heure
    maxParticipants: number;
}

/**
 * État du flow de réservation
 */
export interface BookingFlowState {
    // Données initiales (depuis SpotCard)
    params: BookingParams | null;

    // Sélections utilisateur
    selectedDate: string | null; // "2026-01-29"
    selectedDuration: number | null; // 120 (minutes)
    selectedSlot: TimeSlot | null;
    participantsNotes: string;

    // État UI
    currentStep: BookingStep;
    isLoading: boolean;
    error: string | null;
}

/**
 * Actions du flow de réservation
 */
export type BookingFlowAction =
    | { type: "SET_PARAMS"; payload: BookingParams }
    | { type: "SELECT_DATE"; payload: string }
    | { type: "SELECT_DURATION"; payload: number }
    | { type: "SELECT_SLOT"; payload: TimeSlot }
    | { type: "SET_NOTES"; payload: string }
    | { type: "NEXT_STEP" }
    | { type: "PREV_STEP" }
    | { type: "GO_TO_STEP"; payload: BookingStep }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "RESET" };

/**
 * Configuration des étapes du stepper
 */
export interface StepConfig {
    key: BookingStep;
    label: string;
    icon: string; // Nom de l'icône Phosphor
}

export const BOOKING_STEPS: StepConfig[] = [
    { key: "date", label: "Date", icon: "Calendar" },
    { key: "slot", label: "Créneau", icon: "Clock" },
    { key: "summary", label: "Confirmation", icon: "CheckCircle" },
];

/**
 * Calcul du prix total
 */
export const calculateTotalPrice = (
    basePriceCents: number,
    durationMinutes: number
): number => {
    // Prix = (prix horaire / 60) * durée en minutes
    return Math.round((basePriceCents / 60) * durationMinutes);
};

/**
 * Formatage du prix en euros
 */
export const formatPrice = (priceCents: number): string => {
    return `${(priceCents / 100).toFixed(2).replace(".", ",")}€`;
};

/**
 * Formatage de la durée
 */
export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
        return `${hours}h`;
    }
    return `${hours}h${mins.toString().padStart(2, "0")}`;
};