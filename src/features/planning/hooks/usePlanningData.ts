// ============================================
// 🛹 SOSKATE - USE PLANNING DATA HOOK
// ============================================
// Hook pour gérer les données du planning (disponibilités + bookings)

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import {
    getAvailabilitiesWithFilters,
    createAvailability,
    updateAvailability,
    deleteAvailability,
} from "@/src/shared/services/availabilityService";
import { AvailabilityResponse } from "@/src/shared/types/availability.interface";
import { InstructorBookingResponse } from "../types/planning.types";
import {getInstructorBookings} from "@/src/shared/services/bookingService";

interface UsePlanningDataParams {
    fromDate: string;
    toDate: string;
}

interface UsePlanningDataReturn {
    // Data
    availabilities: AvailabilityResponse[];
    bookings: InstructorBookingResponse[];

    // Loading states
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;

    // Error
    error: string | null;

    // Actions
    refresh: () => Promise<void>;
    addAvailability: (data: {
        date: string;
        startTime: string;
        endTime: string;
    }) => Promise<boolean>;
    editAvailability: (
        availabilityId: number,
        data: { startTime: string; endTime: string }
    ) => Promise<boolean>;
    removeAvailability: (availabilityId: number) => Promise<boolean>;

    // Helpers
    getAvailabilitiesForDate: (date: string) => AvailabilityResponse[];
    getBookingsForDate: (date: string) => InstructorBookingResponse[];
}

export const usePlanningData = ({
                                    fromDate,
                                    toDate,
                                }: UsePlanningDataParams): UsePlanningDataReturn => {
    const { user, isInstructor } = useAuth();

    const [availabilities, setAvailabilities] = useState<AvailabilityResponse[]>([]);
    const [bookings, setBookings] = useState<InstructorBookingResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Charge les disponibilités et les bookings
     */
    const fetchData = useCallback(async () => {
        if (!user?.instructorId || !isInstructor) {
            setAvailabilities([]);
            setBookings([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Charger les disponibilités et bookings en parallèle
            const [availabilitiesData, bookingsData] = await Promise.all([
                getAvailabilitiesWithFilters(user.instructorId, fromDate, toDate),
                getInstructorBookings(user.instructorId),
            ]);

            setAvailabilities(availabilitiesData);

            // Filtrer les bookings pour la période affichée
            const filteredBookings = bookingsData.filter((booking: InstructorBookingResponse) => {
                const bookingDate = booking.startTime.split("T")[0];
                return bookingDate >= fromDate && bookingDate <= toDate;
            });

            setBookings(filteredBookings);
        } catch (err: any) {
            console.error("Erreur chargement planning:", err);
            setError(
                err.response?.data?.message ||
                "Impossible de charger votre planning"
            );
        } finally {
            setIsLoading(false);
        }
    }, [user?.instructorId, isInstructor, fromDate, toDate]);

    /**
     * Rafraîchir les données
     */
    const refresh = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    /**
     * Ajouter une disponibilité
     */
    const addAvailability = useCallback(
        async (data: {
            date: string;
            startTime: string;
            endTime: string;
        }): Promise<boolean> => {
            if (!user?.instructorId) return false;

            setIsCreating(true);
            setError(null);

            try {
                const newAvailability = await createAvailability(
                    user.instructorId,
                    data
                );

                // Ajouter localement
                setAvailabilities((prev) => [...prev, newAvailability]);

                return true;
            } catch (err: any) {
                console.error("Erreur création disponibilité:", err);
                setError(
                    err.response?.data?.message ||
                    "Impossible de créer la disponibilité"
                );
                return false;
            } finally {
                setIsCreating(false);
            }
        },
        [user?.instructorId]
    );

    /**
     * Modifier une disponibilité
     */
    const editAvailability = useCallback(
        async (
            availabilityId: number,
            data: { startTime: string; endTime: string }
        ): Promise<boolean> => {
            if (!user?.instructorId) return false;

            setIsUpdating(true);
            setError(null);

            try {
                const updated = await updateAvailability(
                    user.instructorId,
                    availabilityId,
                    data
                );

                // Mettre à jour localement
                setAvailabilities((prev) =>
                    prev.map((a) => (a.id === availabilityId ? updated : a))
                );

                return true;
            } catch (err: any) {
                console.error("Erreur modification disponibilité:", err);
                setError(
                    err.response?.data?.message ||
                    "Impossible de modifier la disponibilité"
                );
                return false;
            } finally {
                setIsUpdating(false);
            }
        },
        [user?.instructorId]
    );

    /**
     * Supprimer une disponibilité
     */
    const removeAvailability = useCallback(
        async (availabilityId: number): Promise<boolean> => {
            if (!user?.instructorId) return false;

            setIsDeleting(true);
            setError(null);

            try {
                await deleteAvailability(user.instructorId, availabilityId);

                // Retirer localement
                setAvailabilities((prev) =>
                    prev.filter((a) => a.id !== availabilityId)
                );

                return true;
            } catch (err: any) {
                console.error("Erreur suppression disponibilité:", err);
                setError(
                    err.response?.data?.message ||
                    "Impossible de supprimer la disponibilité"
                );
                return false;
            } finally {
                setIsDeleting(false);
            }
        },
        [user?.instructorId]
    );

    /**
     * Récupère les disponibilités pour une date spécifique
     */
    const getAvailabilitiesForDate = useCallback(
        (date: string): AvailabilityResponse[] => {
            return availabilities.filter((a) => a.date === date);
        },
        [availabilities]
    );

    /**
     * Récupère les bookings pour une date spécifique
     */
    const getBookingsForDate = useCallback(
        (date: string): InstructorBookingResponse[] => {
            return bookings.filter((b) => {
                const bookingDate = b.startTime.split("T")[0];
                return bookingDate === date;
            });
        },
        [bookings]
    );

    // Charger les données quand les dates changent
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        availabilities,
        bookings,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        error,
        refresh,
        addAvailability,
        editAvailability,
        removeAvailability,
        getAvailabilitiesForDate,
        getBookingsForDate,
    };
};