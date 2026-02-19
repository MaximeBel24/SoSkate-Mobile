// ============================================
// 🛹 SOSKATE - USE AVAILABILITY HOOK (UPDATED)
// ============================================
// Hook pour récupérer les disponibilités et créneaux
// Utilise maintenant l'endpoint /available-slots du backend

import { useState, useEffect, useCallback } from "react";
import { logger } from "@/src/shared/utils/logger";

import { DURATION_OPTIONS } from "../types/booking.types";
import { AvailabilityResponse } from "@/src/shared/types/availability.interface";
import { getInstructorAvailabilities } from "@/src/shared/services/availabilityService";
import {
  getAvailableSlots,
  TimeSlot,
} from "@/src/shared/services/availableSlotsService";

interface UseAvailabilityParams {
  instructorId: number;
  spotId: number;
}

interface UseAvailabilityReturn {
  // Data
  availabilities: AvailabilityResponse[];
  availabilitiesByDate: Map<string, AvailabilityResponse[]>;

  // Loading states
  isLoading: boolean;
  isLoadingSlots: boolean;
  error: string | null;

  // Methods
  fetchAvailabilities: () => Promise<void>;
  hasAvailabilityForDate: (date: string) => boolean;
  fetchSlotsForDate: (
    date: string,
    durationMinutes: number,
  ) => Promise<TimeSlot[]>;
  getAvailableDurationsForDate: (date: string) => number[];
}

/**
 * Hook pour gérer les disponibilités d'un instructeur
 */
export const useAvailability = ({
  instructorId,
  spotId,
}: UseAvailabilityParams): UseAvailabilityReturn => {
  const [availabilities, setAvailabilities] = useState<AvailabilityResponse[]>(
    [],
  );
  const [availabilitiesByDate, setAvailabilitiesByDate] = useState<
    Map<string, AvailabilityResponse[]>
  >(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère toutes les disponibilités de l'instructeur
   * (pour savoir quels jours ont des dispos dans le calendrier)
   */
  const fetchAvailabilities = useCallback(async () => {
    if (!instructorId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getInstructorAvailabilities(instructorId);

      // Filtrer uniquement les disponibilités AVAILABLE et futures
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const validAvailabilities = data.filter(
        (a) => a.status === "AVAILABLE" && a.date >= todayStr,
      );

      setAvailabilities(validAvailabilities);

      // Grouper par date
      const byDate = new Map<string, AvailabilityResponse[]>();
      validAvailabilities.forEach((availability) => {
        const existing = byDate.get(availability.date) || [];
        byDate.set(availability.date, [...existing, availability]);
      });
      setAvailabilitiesByDate(byDate);
    } catch (err) {
      logger.error("Erreur chargement disponibilités:", err);
      setError("Impossible de charger les disponibilités");
    } finally {
      setIsLoading(false);
    }
  }, [instructorId]);

  /**
   * Charge les disponibilités au montage
   */
  useEffect(() => {
    fetchAvailabilities();
  }, [fetchAvailabilities]);

  /**
   * Vérifie si une date a des disponibilités
   */
  const hasAvailabilityForDate = useCallback(
    (date: string): boolean => {
      const dateAvailabilities = availabilitiesByDate.get(date);
      return dateAvailabilities !== undefined && dateAvailabilities.length > 0;
    },
    [availabilitiesByDate],
  );

  /**
   * Récupère les créneaux disponibles pour une date et durée données
   * via l'endpoint backend /available-slots
   */
  const fetchSlotsForDate = useCallback(
    async (date: string, durationMinutes: number): Promise<TimeSlot[]> => {
      if (!instructorId || !spotId) {
        return [];
      }

      setIsLoadingSlots(true);

      try {
        const slots = await getAvailableSlots(
          instructorId,
          spotId,
          date,
          durationMinutes,
        );
        return slots;
      } catch (err) {
        logger.error("Erreur chargement créneaux:", err);
        setError("Impossible de charger les créneaux");
        return [];
      } finally {
        setIsLoadingSlots(false);
      }
    },
    [instructorId, spotId],
  );

  /**
   * Retourne les durées disponibles pour une date
   * Pour l'instant, retourne toutes les durées si la date a des dispos
   * TODO: Le backend pourrait retourner les durées possibles
   */
  const getAvailableDurationsForDate = useCallback(
    (date: string): number[] => {
      const hasDispos = hasAvailabilityForDate(date);
      if (!hasDispos) return [];

      // Retourner toutes les durées, le backend filtrera les créneaux
      return DURATION_OPTIONS.map((d) => d.value);
    },
    [hasAvailabilityForDate],
  );

  return {
    availabilities,
    availabilitiesByDate,
    isLoading,
    isLoadingSlots,
    error,
    fetchAvailabilities,
    hasAvailabilityForDate,
    fetchSlotsForDate,
    getAvailableDurationsForDate,
  };
};

// export type UseAvailabilityReturn = ReturnType<typeof useAvailability>;
