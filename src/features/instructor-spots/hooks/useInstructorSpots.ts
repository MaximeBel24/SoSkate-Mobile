// ============================================
// 🛹 SOSKATE - USE INSTRUCTOR SPOTS HOOK
// ============================================
// Hook pour gérer les spots d'enseignement d'un instructeur

import { getErrorMessage } from "@/src/api/axios/getErrorMessage";
import { logger } from "@/src/shared/utils/logger";
import { useState, useEffect, useCallback } from "react";
import { InstructorSpotResponse } from "../types/instructor-spots.types";
import {
  getInstructorSpots,
  addSpotToInstructor,
  removeSpotFromInstructor,
} from "@/src/shared/services/instructorSpotsService";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import {SpotResponse} from "@/src/shared/types/spot.interface";

interface UseInstructorSpotsReturn {
  // Data
  spots: InstructorSpotResponse[];
  spotIds: number[]; // Liste des IDs pour vérification rapide

  // Loading states
  isLoading: boolean;
  isAdding: boolean;
  isRemoving: boolean;

  // Error
  error: string | null;

  // Actions
  refresh: () => Promise<void>;
  addSpot: (spotId: number, spotData: SpotResponse) => Promise<boolean>;
  removeSpot: (spotId: number) => Promise<boolean>;
  isSpotAssociated: (spotId: number) => boolean;
}

export const useInstructorSpots = (): UseInstructorSpotsReturn => {
  const { user, isInstructor } = useAuth();

  const [spots, setSpots] = useState<InstructorSpotResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Liste des IDs des spots associés (pour vérification rapide)
  const spotIds = spots.map((s) => s.spot.id);

  /**
   * Charge les spots de l'instructeur
   */
  const fetchSpots = useCallback(async () => {
    if (!user?.instructorId || !isInstructor) {
      setSpots([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getInstructorSpots(user.instructorId);
      setSpots(data);
    } catch (err) {
      logger.error("Erreur chargement spots instructeur:", err);
      setError(
        getErrorMessage(err, "Impossible de charger vos spots d'enseignement"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.instructorId, isInstructor]);

  /**
   * Rafraîchir la liste
   */
  const refresh = useCallback(async () => {
    await fetchSpots();
  }, [fetchSpots]);

  /**
   * Ajouter un spot
   */
  const addSpot = useCallback(
      async (spotId: number, spotData: SpotResponse): Promise<boolean> => {
        if (!user?.instructorId) return false;

        setIsAdding(true);
        setError(null);

        // 1. SNAPSHOT
        const previousSpots = spots;

        // 2. OPTIMISTIC UPDATE — objet temporaire
        const optimisticSpot: InstructorSpotResponse = {
          id: -1,
          instructorId: user.instructorId,
          spot: {
            id: spotData.id,
            name: spotData.name,
            address: spotData.address,
            city: spotData.city,
            latitude: spotData.latitude,
            longitude: spotData.longitude,
          },
          createdAt: new Date().toISOString(),
        };

        setSpots((prev) => [...prev, optimisticSpot]);

        try {
          // 3. APPEL API
          const realSpot = await addSpotToInstructor(user.instructorId, spotId);

          // Remplacer le placeholder par la vraie réponse
          setSpots((prev) =>
              prev.map((s) => (s.id === -1 ? realSpot : s)),
          );

          return true;
        } catch (err) {
          // 4. ROLLBACK
          setSpots(previousSpots);
          logger.error("Erreur ajout spot:", err);
          setError(getErrorMessage(err, "Impossible d'ajouter ce spot"));
          return false;
        } finally {
          setIsAdding(false);
        }
      },
      [user?.instructorId, spots],
  );

  /**
   * Retirer un spot
   */
  const removeSpot = useCallback(
    async (spotId: number): Promise<boolean> => {
      if (!user?.instructorId) return false;

      setIsRemoving(true);
      setError(null);

      // 1. SNAPSHOT — on sauvegarde l'état actuel
      const saveSpots = spots;

      setSpots((prev) =>
          prev.filter((s) =>
              s.spot.id !== spotId));

      try {
        await removeSpotFromInstructor(user.instructorId, spotId);
        return true;
      } catch (err) {
        setSpots(saveSpots);
        logger.error("Erreur retrait spot:", err);
        setError(
          getErrorMessage(err, "Impossible de vous retirer de ce spot"),
        );
        return false;
      } finally {
        setIsRemoving(false);
      }
    },
    [user?.instructorId, spots  ],
  );

  /**
   * Vérifie si un spot est déjà associé
   */
  const isSpotAssociated = useCallback(
    (spotId: number): boolean => {
      return spotIds.includes(spotId);
    },
    [spotIds],
  );

  // Charger au montage
  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  return {
    spots,
    spotIds,
    isLoading,
    isAdding,
    isRemoving,
    error,
    refresh,
    addSpot,
    removeSpot,
    isSpotAssociated,
  };
};
