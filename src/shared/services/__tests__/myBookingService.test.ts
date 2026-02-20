import {
  getMyBookings,
  cancelParticipation,
  updateBookingNotes,
} from "../myBookingService";

jest.mock("@/src/api/axios/axiosConfig", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

import apiClient from "@/src/api/axios/axiosConfig";

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;

const mockBookingResponse = {
  participationId: 1,
  participantStatus: "CONFIRMED",
  joinedAt: "2026-01-01T00:00:00",
  bookingId: 10,
  startTime: "2026-02-15T14:00:00",
  endTime: "2026-02-15T15:00:00",
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
};

describe("myBookingService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMyBookings", () => {
    it("returns customer bookings", async () => {
      mockGet.mockResolvedValue({ data: [mockBookingResponse] });

      const result = await getMyBookings(42);
      expect(result).toHaveLength(1);
      expect(result[0].participationId).toBe(1);
    });

    it("calls correct endpoint with customerId", async () => {
      mockGet.mockResolvedValue({ data: [] });

      await getMyBookings(42);
      expect(mockGet).toHaveBeenCalledWith("/customers/42/my-bookings");
    });

    it("throws ApiError on failure", async () => {
      const { ApiError } = require("@/src/api/axios/apiError");
      mockGet.mockRejectedValue(new Error("Server error"));

      await expect(getMyBookings(42)).rejects.toThrow(ApiError);
    });
  });

  describe("cancelParticipation", () => {
    it("calls cancel endpoint with reason", async () => {
      mockPost.mockResolvedValue({});

      await cancelParticipation(42, 1, "Changed plans");
      expect(mockPost).toHaveBeenCalledWith(
        "/customers/42/participations/1/cancel",
        { reason: "Changed plans" },
      );
    });

    it("calls cancel endpoint without reason (empty object)", async () => {
      mockPost.mockResolvedValue({});

      await cancelParticipation(42, 1);
      expect(mockPost).toHaveBeenCalledWith(
        "/customers/42/participations/1/cancel",
        {},
      );
    });

    it("throws ApiError on failure", async () => {
      const { ApiError } = require("@/src/api/axios/apiError");
      mockPost.mockRejectedValue(new Error("Server error"));

      await expect(cancelParticipation(42, 1)).rejects.toThrow(ApiError);
    });
  });

  describe("updateBookingNotes", () => {
    it("returns updated booking response", async () => {
      const updated = { ...mockBookingResponse, participantsNotes: "Updated" };
      mockPatch.mockResolvedValue({ data: updated });

      const result = await updateBookingNotes(42, 1, "Updated");
      expect(result.participantsNotes).toBe("Updated");
    });

    it("calls correct endpoint with notes payload", async () => {
      mockPatch.mockResolvedValue({ data: mockBookingResponse });

      await updateBookingNotes(42, 1, "New notes");
      expect(mockPatch).toHaveBeenCalledWith(
        "/customers/42/participations/1/notes",
        { notes: "New notes" },
      );
    });

    it("throws ApiError on failure", async () => {
      const { ApiError } = require("@/src/api/axios/apiError");
      mockPatch.mockRejectedValue(new Error("Server error"));

      await expect(updateBookingNotes(42, 1, "notes")).rejects.toThrow(
        ApiError,
      );
    });
  });
});
