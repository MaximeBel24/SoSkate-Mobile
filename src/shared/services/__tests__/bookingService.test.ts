import { createBooking, getInstructorBookings } from "../bookingService";

jest.mock("@/src/api/axios/axiosConfig", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

import apiClient from "@/src/api/axios/axiosConfig";

const mockPost = apiClient.post as jest.Mock;
const mockGet = apiClient.get as jest.Mock;

describe("bookingService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBooking", () => {
    const bookingData = {
      instructorId: 5,
      spotId: 1,
      serviceId: 3,
      date: "2026-02-15",
      startTime: "14:00",
      durationMinutes: 60,
      participantsNotes: "Débutant",
    };
    const bookingResponse = { id: 100, ...bookingData, status: "PENDING" };

    it("returns booking response", async () => {
      mockPost.mockResolvedValue({ data: bookingResponse });

      const result = await createBooking(bookingData as any);
      expect(result).toEqual(bookingResponse);
    });

    it("calls correct endpoint", async () => {
      mockPost.mockResolvedValue({ data: bookingResponse });

      await createBooking(bookingData as any);
      expect(mockPost).toHaveBeenCalledWith(
        "/bookings",
        bookingData,
      );
    });

    it("throws ApiError on failure", async () => {
      const { ApiError } = require("@/src/api/axios/apiError");
      mockPost.mockRejectedValue(new Error("Server error"));

      await expect(createBooking(bookingData as any)).rejects.toThrow(
        ApiError,
      );
    });
  });

  describe("getInstructorBookings", () => {
    const instructorBookings = [
      { id: 1, startTime: "2026-02-15T14:00:00", status: "CONFIRMED" },
      { id: 2, startTime: "2026-02-16T10:00:00", status: "PENDING" },
    ];

    it("returns instructor bookings", async () => {
      mockGet.mockResolvedValue({ data: instructorBookings });

      const result = await getInstructorBookings(5);
      expect(result).toEqual(instructorBookings);
    });

    it("calls correct endpoint with instructorId", async () => {
      mockGet.mockResolvedValue({ data: instructorBookings });

      await getInstructorBookings(5);
      expect(mockGet).toHaveBeenCalledWith("/instructors/5/bookings");
    });

    it("throws ApiError when response is not an array", async () => {
      const { ApiError } = require("@/src/api/axios/apiError");
      mockGet.mockResolvedValue({ data: { invalid: true } });

      await expect(getInstructorBookings(5)).rejects.toThrow(ApiError);
    });

    it("throws ApiError on failure", async () => {
      const { ApiError } = require("@/src/api/axios/apiError");
      mockGet.mockRejectedValue(new Error("Server error"));

      await expect(getInstructorBookings(5)).rejects.toThrow(ApiError);
    });
  });
});
