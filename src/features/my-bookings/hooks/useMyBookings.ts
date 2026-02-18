// ============================================
// 🛹 SOSKATE - USE MY BOOKINGS HOOK
// ============================================
// Hook pour gérer les réservations de l'utilisateur

import { useState, useEffect, useCallback } from "react";
import {
  MyBookingResponse,
  GroupedBookings,
  groupBookings,
} from "../types/my-bookings.types";

import { useAuth } from "@/src/shared/contexts/AuthContext";
import {
  cancelParticipation,
  getMyBookings,
  updateBookingNotes,
} from "@/src/shared/services/myBookingService";

interface UseMyBookingsReturn {
  // Data
  bookings: MyBookingResponse[];
  groupedBookings: GroupedBookings;

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  isCancelling: boolean;
  isUpdatingNotes: boolean;

  // Error
  error: string | null;

  // Actions
  refresh: () => Promise<void>;
  cancel: (participationId: number, reason?: string) => Promise<boolean>;
  updateNotes: (participationId: number, notes: string) => Promise<boolean>;
}

export const useMyBookings = (): UseMyBookingsReturn => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<MyBookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charge les réservations
   */
  const fetchBookings = useCallback(
    async (showRefreshing = false) => {
      if (!user?.id) return;

      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data = await getMyBookings(user.id);
        setBookings(data);
      } catch (err: any) {
        console.error("Erreur chargement réservations:", err);
        setError(
          err.response?.data?.message ||
            "Impossible de charger vos réservations",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user?.id],
  );

      /**
       * Rafraîchir (pull to refresh)
       */
      const refresh = useCallback(async () => {
        await fetchBookings(true);
      }, [fetchBookings]);

    const cancel = useCallback(
        async (participationId: number, reason?: string): Promise<boolean> => {
            if (!user?.id) return false;

            // 1. SNAPSHOT — on sauvegarde l'état actuel
            const previousBookings = bookings;

            // 2. OPTIMISTIC UPDATE — on met à jour l'UI immédiatement
            setBookings((prev) =>
                prev.map((booking) =>
                    booking.participationId === participationId
                        ? { ...booking, participantStatus: "CANCELLED" as const }
                        : booking,
                ),
            );

            try {
                // 3. APPEL API — on envoie la requête au serveur
                await cancelParticipation(user.id, participationId, reason);
                return true;
            } catch (err: any) {
                // 4. ROLLBACK — l'API a échoué, on restaure l'état précédent
                setBookings(previousBookings);
                console.error("Erreur annulation:", err);
                setError(
                    err.response?.data?.message || "Impossible d'annuler la réservation",
                );
                return false;
            }
        },
        [user?.id, bookings],
    );

  /**
   * Modifier les notes
   */
  const updateNotes = useCallback(
    async (participationId: number, notes: string): Promise<boolean> => {
      if (!user?.id) return false;

      setIsUpdatingNotes(true);

      const saveBookings = bookings;

        // Mettre à jour localement
        setBookings((prev) =>
            prev.map((booking) =>
                booking.participationId === participationId
                    ? {
                        ...booking,
                        participantsNotes: notes,
                    }
                    : booking,
            ),
        );

      try {
        await updateBookingNotes(user.id, participationId, notes);
        return true;
      } catch (err: any) {
          setBookings(saveBookings)
        console.error("Erreur modification notes:", err);
        setError(
          err.response?.data?.message || "Impossible de modifier les notes",
        );
        return false;
      } finally {
        setIsUpdatingNotes(false);
      }
    },
    [user?.id, bookings],
  );

  // Charger au montage
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Grouper les réservations
  const groupedBookings = groupBookings(bookings);

  return {
    bookings,
    groupedBookings,
    isLoading,
    isRefreshing,
    isCancelling,
    isUpdatingNotes,
    error,
    refresh,
    cancel,
    updateNotes,
  };
};
