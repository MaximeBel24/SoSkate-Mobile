import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useMyBookings } from "../useMyBookings";

// Mock services
jest.mock("@/src/shared/services/myBookingService");
jest.mock("@/src/shared/contexts/AuthContext");
jest.mock("@/src/api/axios/getErrorMessage", () => ({
  getErrorMessage: jest.fn(
    (_err: unknown, fallback: string) => fallback ?? "Erreur",
  ),
}));

import * as myBookingService from "@/src/shared/services/myBookingService";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { MyBookingResponse } from "../../types/my-bookings.types";

const mockUseAuth = useAuth as jest.Mock;
const mockGetMyBookings = myBookingService.getMyBookings as jest.Mock;
const mockCancelParticipation =
  myBookingService.cancelParticipation as jest.Mock;
const mockUpdateBookingNotes =
  myBookingService.updateBookingNotes as jest.Mock;

const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

const mockBookings: MyBookingResponse[] = [
  {
    participationId: 1,
    participantStatus: "CONFIRMED",
    joinedAt: "2026-01-01T00:00:00",
    bookingId: 10,
    startTime: futureDate,
    endTime: futureDate,
    durationMinutes: 60,
    bookingStatus: "CONFIRMED",
    participantsNotes: "Débutant",
    instructorId: 5,
    instructorFirstname: "Jean",
    instructorLastname: "Dupont",
    spotId: 1,
    spotName: "Spot Paris",
    spotAddress: "10 rue de Rivoli",
    spotCity: "Paris",
    serviceId: 3,
    serviceName: "Initiation",
    basePriceCents: 3000,
    totalPriceCents: 3000,
  },
  {
    participationId: 2,
    participantStatus: "CONFIRMED",
    joinedAt: "2026-01-02T00:00:00",
    bookingId: 11,
    startTime: futureDate,
    endTime: futureDate,
    durationMinutes: 90,
    bookingStatus: "PENDING",
    participantsNotes: null,
    instructorId: 6,
    instructorFirstname: "Marie",
    instructorLastname: "Martin",
    spotId: 2,
    spotName: "Spot Lyon",
    spotAddress: "5 place Bellecour",
    spotCity: "Lyon",
    serviceId: 4,
    serviceName: "Perfectionnement",
    basePriceCents: 4500,
    totalPriceCents: 6750,
  },
];

describe("useMyBookings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: { id: 42 } });
    mockGetMyBookings.mockResolvedValue(mockBookings);
    mockCancelParticipation.mockResolvedValue(undefined);
    mockUpdateBookingNotes.mockResolvedValue(mockBookings[0]);
  });

  it("fetches bookings on mount", async () => {
    const { result } = renderHook(() => useMyBookings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetMyBookings).toHaveBeenCalledWith(42);
    expect(result.current.bookings).toHaveLength(2);
  });

  it("does not fetch if user is null", async () => {
    mockUseAuth.mockReturnValue({ user: null });
    const { result } = renderHook(() => useMyBookings());

    // Give it a tick
    await act(async () => {});

    expect(mockGetMyBookings).not.toHaveBeenCalled();
  });

  it("sets error on fetch failure", async () => {
    mockGetMyBookings.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useMyBookings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(
      "Impossible de charger vos réservations",
    );
  });

  describe("refresh", () => {
    it("refreshes bookings with isRefreshing flag", async () => {
      const { result } = renderHook(() => useMyBookings());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updatedBookings = [mockBookings[0]];
      mockGetMyBookings.mockResolvedValue(updatedBookings);

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.bookings).toHaveLength(1);
    });
  });

  describe("cancel", () => {
    it("performs optimistic update on cancel", async () => {
      const { result } = renderHook(() => useMyBookings());

      await waitFor(() => {
        expect(result.current.bookings).toHaveLength(2);
      });

      await act(async () => {
        const success = await result.current.cancel(1, "Changed plans");
        expect(success).toBe(true);
      });

      expect(mockCancelParticipation).toHaveBeenCalledWith(
        42,
        1,
        "Changed plans",
      );
      // The booking should be optimistically updated
      const cancelled = result.current.bookings.find(
        (b) => b.participationId === 1,
      );
      expect(cancelled?.participantStatus).toBe("CANCELLED");
    });

    it("rolls back on cancel failure", async () => {
      const { result } = renderHook(() => useMyBookings());

      await waitFor(() => {
        expect(result.current.bookings).toHaveLength(2);
      });

      mockCancelParticipation.mockRejectedValue(new Error("Server error"));

      await act(async () => {
        const success = await result.current.cancel(1);
        expect(success).toBe(false);
      });

      // Should be rolled back to original
      const booking = result.current.bookings.find(
        (b) => b.participationId === 1,
      );
      expect(booking?.participantStatus).toBe("CONFIRMED");
      expect(result.current.error).toBeTruthy();
    });

    it("returns false if user is null", async () => {
      mockUseAuth.mockReturnValue({ user: null });
      const { result } = renderHook(() => useMyBookings());

      await act(async () => {});

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.cancel(1);
      });

      expect(success).toBe(false);
      expect(mockCancelParticipation).not.toHaveBeenCalled();
    });
  });

  describe("updateNotes", () => {
    it("performs optimistic update on notes change", async () => {
      const { result } = renderHook(() => useMyBookings());

      await waitFor(() => {
        expect(result.current.bookings).toHaveLength(2);
      });

      await act(async () => {
        const success = await result.current.updateNotes(1, "Nouveau texte");
        expect(success).toBe(true);
      });

      expect(mockUpdateBookingNotes).toHaveBeenCalledWith(
        42,
        1,
        "Nouveau texte",
      );
      const updated = result.current.bookings.find(
        (b) => b.participationId === 1,
      );
      expect(updated?.participantsNotes).toBe("Nouveau texte");
    });

    it("rolls back on updateNotes failure", async () => {
      const { result } = renderHook(() => useMyBookings());

      await waitFor(() => {
        expect(result.current.bookings).toHaveLength(2);
      });

      mockUpdateBookingNotes.mockRejectedValue(new Error("Server error"));

      await act(async () => {
        const success = await result.current.updateNotes(1, "New notes");
        expect(success).toBe(false);
      });

      // Rolled back to original
      const booking = result.current.bookings.find(
        (b) => b.participationId === 1,
      );
      expect(booking?.participantsNotes).toBe("Débutant");
      expect(result.current.error).toBeTruthy();
    });

    it("returns false if user is null", async () => {
      mockUseAuth.mockReturnValue({ user: null });
      const { result } = renderHook(() => useMyBookings());

      await act(async () => {});

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.updateNotes(1, "notes");
      });

      expect(success).toBe(false);
    });
  });

  describe("groupedBookings", () => {
    it("groups bookings into upcoming and past", async () => {
      const { result } = renderHook(() => useMyBookings());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Both bookings have future dates, so they should be in upcoming
      expect(result.current.groupedBookings.upcoming.length).toBeGreaterThan(0);
    });
  });
});
