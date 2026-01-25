// ============================================
// 🛹 SOSKATE - USE INSTRUCTOR SPOTS HOOK
// ============================================
// Hook pour gérer les spots d'enseignement d'un instructeur

import { useState, useEffect, useCallback } from "react";
import { InstructorSpotResponse } from "../types/instructor-spots.types";
import {
    getInstructorSpots,
    addSpotToInstructor,
    removeSpotFromInstructor,
} from "@/src/shared/services/instructorSpotsService";
import { useAuth } from "@/src/shared/contexts/AuthContext";

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
    addSpot: (spotId: number) => Promise<boolean>;
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
        } catch (err: any) {
            console.error("Erreur chargement spots instructeur:", err);
            setError(
                err.response?.data?.message ||
                "Impossible de charger vos spots d'enseignement"
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
        async (spotId: number): Promise<boolean> => {
            if (!user?.instructorId) return false;

            setIsAdding(true);
            setError(null);

            try {
                const newSpot = await addSpotToInstructor(user.instructorId, spotId);

                // Ajouter localement (optimistic update)
                setSpots((prev) => [...prev, newSpot]);

                return true;
            } catch (err: any) {
                console.error("Erreur ajout spot:", err);
                setError(
                    err.response?.data?.message || "Impossible d'ajouter ce spot"
                );
                return false;
            } finally {
                setIsAdding(false);
            }
        },
        [user?.instructorId]
    );

    /**
     * Retirer un spot
     */
    const removeSpot = useCallback(
        async (spotId: number): Promise<boolean> => {
            if (!user?.instructorId) return false;

            setIsRemoving(true);
            setError(null);

            try {
                await removeSpotFromInstructor(user.instructorId, spotId);

                // Retirer localement (optimistic update)
                setSpots((prev) => prev.filter((s) => s.spot.id !== spotId));

                return true;
            } catch (err: any) {
                console.error("Erreur retrait spot:", err);
                setError(
                    err.response?.data?.message || "Impossible de vous retirer de ce spot"
                );
                return false;
            } finally {
                setIsRemoving(false);
            }
        },
        [user?.instructorId]
    );

    /**
     * Vérifie si un spot est déjà associé
     */
    const isSpotAssociated = useCallback(
        (spotId: number): boolean => {
            return spotIds.includes(spotId);
        },
        [spotIds]
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