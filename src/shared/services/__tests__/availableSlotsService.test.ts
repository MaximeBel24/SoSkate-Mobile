import { getAvailableSlots } from "../availableSlotsService";
import apiClient from "@/src/api/axios/axiosConfig";
import { AvailableSlotsApiResponse } from "@/src/shared/types/available-slots.interface";

jest.mock("@/src/api/axios/axiosConfig", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockGet = apiClient.get as jest.Mock;

describe("getAvailableSlots", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const apiResponse: AvailableSlotsApiResponse = {
    instructorId: 1,
    spotId: 2,
    date: "2026-01-29",
    durationMinutes: 60,
    slots: [
      { startTime: "09:00:00", endTime: "10:00:00", available: true },
      { startTime: "10:00:00", endTime: "11:00:00", available: false },
      { startTime: "11:00:00", endTime: "12:00:00", available: true },
      { startTime: "14:00:00", endTime: "15:00:00", available: true },
    ],
  };

  it("filters only available slots", async () => {
    mockGet.mockResolvedValue({ data: apiResponse });
    const slots = await getAvailableSlots(1, 2, "2026-01-29", 60);
    expect(slots).toHaveLength(3);
    expect(slots.every((s) => s.available)).toBe(true);
  });

  it("formats HH:MM:SS to HH:MM", async () => {
    mockGet.mockResolvedValue({ data: apiResponse });
    const slots = await getAvailableSlots(1, 2, "2026-01-29", 60);
    expect(slots[0].startTime).toBe("09:00");
    expect(slots[0].endTime).toBe("10:00");
  });

  it("keeps HH:MM as-is", async () => {
    const responseWithShortTime: AvailableSlotsApiResponse = {
      ...apiResponse,
      slots: [{ startTime: "14:00", endTime: "15:30", available: true }],
    };
    mockGet.mockResolvedValue({ data: responseWithShortTime });
    const slots = await getAvailableSlots(1, 2, "2026-01-29", 60);
    expect(slots[0].startTime).toBe("14:00");
    expect(slots[0].endTime).toBe("15:30");
  });

  it("generates correct IDs with date-startTime-index format", async () => {
    mockGet.mockResolvedValue({ data: apiResponse });
    const slots = await getAvailableSlots(1, 2, "2026-01-29", 60);
    expect(slots[0].id).toBe("2026-01-29-09:00:00-0");
    expect(slots[1].id).toBe("2026-01-29-11:00:00-1");
    expect(slots[2].id).toBe("2026-01-29-14:00:00-2");
  });

  it("calls apiClient.get with correct params", async () => {
    mockGet.mockResolvedValue({ data: apiResponse });
    await getAvailableSlots(5, 10, "2026-02-15", 120);
    expect(mockGet).toHaveBeenCalledWith("/instructors/5/bookable", {
      params: { spotId: 10, date: "2026-02-15", durationMinutes: 120 },
    });
  });

  it("returns empty array when all slots are unavailable", async () => {
    const allUnavailable: AvailableSlotsApiResponse = {
      ...apiResponse,
      slots: [
        { startTime: "09:00:00", endTime: "10:00:00", available: false },
        { startTime: "10:00:00", endTime: "11:00:00", available: false },
      ],
    };
    mockGet.mockResolvedValue({ data: allUnavailable });
    const slots = await getAvailableSlots(1, 2, "2026-01-29", 60);
    expect(slots).toHaveLength(0);
  });

  it("returns empty array when no slots exist", async () => {
    const noSlots: AvailableSlotsApiResponse = {
      ...apiResponse,
      slots: [],
    };
    mockGet.mockResolvedValue({ data: noSlots });
    const slots = await getAvailableSlots(1, 2, "2026-01-29", 60);
    expect(slots).toHaveLength(0);
  });

  it("throws ApiError on network failure", async () => {
    const { ApiError } = require("@/src/api/axios/apiError");
    mockGet.mockRejectedValue(new Error("Network Error"));
    await expect(getAvailableSlots(1, 2, "2026-01-29", 60)).rejects.toThrow(
      ApiError,
    );
  });
});
