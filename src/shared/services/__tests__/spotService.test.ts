import { getAllSpots, getActiveSpots } from "../spotService";
import { ApiError } from "@/src/api/axios/apiError";

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

const mockSpots = [
  { id: 1, name: "Spot Paris", address: "10 rue de Rivoli", active: true },
  { id: 2, name: "Spot Lyon", address: "5 place Bellecour", active: true },
];

describe("spotService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllSpots", () => {
    it("returns array of spots", async () => {
      mockGet.mockResolvedValue({ data: mockSpots });

      const result = await getAllSpots();
      expect(result).toEqual(mockSpots);
      expect(result).toHaveLength(2);
    });

    it("calls the correct endpoint", async () => {
      mockGet.mockResolvedValue({ data: mockSpots });

      await getAllSpots();
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining("/spots"),
      );
    });

    it("throws ApiError when response is not an array", async () => {
      mockGet.mockResolvedValue({ data: { spots: [] } });

      await expect(getAllSpots()).rejects.toThrow(ApiError);
    });

    it("throws ApiError on network failure", async () => {
      mockGet.mockRejectedValue(new Error("Network error"));

      await expect(getAllSpots()).rejects.toThrow(ApiError);
    });
  });

  describe("getActiveSpots", () => {
    it("returns array of active spots", async () => {
      mockGet.mockResolvedValue({ data: mockSpots });

      const result = await getActiveSpots();
      expect(result).toEqual(mockSpots);
    });

    it("calls the correct endpoint with /active suffix", async () => {
      mockGet.mockResolvedValue({ data: mockSpots });

      await getActiveSpots();
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining("/spots/active"),
      );
    });

    it("throws ApiError when response is not an array", async () => {
      mockGet.mockResolvedValue({ data: "not an array" });

      await expect(getActiveSpots()).rejects.toThrow(ApiError);
    });

    it("throws ApiError on network failure", async () => {
      mockGet.mockRejectedValue(new Error("Network error"));

      await expect(getActiveSpots()).rejects.toThrow(ApiError);
    });
  });
});
