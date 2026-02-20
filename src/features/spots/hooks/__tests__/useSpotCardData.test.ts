import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useSpotCardData } from "../useSpotCardData";

jest.mock("@/src/shared/services/photoService");
jest.mock("@/src/shared/services/serviceService");
jest.mock("@/src/shared/services/instructorSpotsService");

import { getSpotPhotos } from "@/src/shared/services/photoService";
import { getActiveServices } from "@/src/shared/services/serviceService";
import { getInstructorsBySpot } from "@/src/shared/services/instructorSpotsService";

const mockGetSpotPhotos = getSpotPhotos as jest.Mock;
const mockGetActiveServices = getActiveServices as jest.Mock;
const mockGetInstructorsBySpot = getInstructorsBySpot as jest.Mock;

const mockPhotos = [
  { id: 1, url: "https://example.com/1.jpg", thumbnailUrl: "https://example.com/1-thumb.jpg" },
  { id: 2, url: "https://example.com/2.jpg", thumbnailUrl: "https://example.com/2-thumb.jpg" },
];

const mockServices = [
  { id: 1, name: "Initiation", active: true },
  { id: 2, name: "Perfectionnement", active: true },
];

const mockInstructors = [
  { id: 1, firstName: "Jean", lastName: "Dupont" },
  { id: 2, firstName: "Marie", lastName: "Martin" },
];

describe("useSpotCardData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSpotPhotos.mockResolvedValue(mockPhotos);
    mockGetActiveServices.mockResolvedValue(mockServices);
    mockGetInstructorsBySpot.mockResolvedValue(mockInstructors);
  });

  it("loads photos on mount", async () => {
    const { result } = renderHook(() => useSpotCardData(1, false));

    await waitFor(() => {
      expect(result.current.loadingPhotos).toBe(false);
    });

    expect(mockGetSpotPhotos).toHaveBeenCalledWith(1);
    expect(result.current.photos).toHaveLength(2);
    expect(result.current.photos[0]).toEqual({
      id: 1,
      url: "https://example.com/1.jpg",
      thumbnailUrl: "https://example.com/1-thumb.jpg",
    });
  });

  it("does NOT load services/instructors when not expanded", async () => {
    renderHook(() => useSpotCardData(1, false));

    await waitFor(() => {
      expect(mockGetSpotPhotos).toHaveBeenCalled();
    });

    expect(mockGetActiveServices).not.toHaveBeenCalled();
    expect(mockGetInstructorsBySpot).not.toHaveBeenCalled();
  });

  it("loads services and instructors when expanded", async () => {
    const { result } = renderHook(() => useSpotCardData(1, true));

    await waitFor(() => {
      expect(result.current.servicesLoaded).toBe(true);
    });

    expect(mockGetActiveServices).toHaveBeenCalled();
    expect(mockGetInstructorsBySpot).toHaveBeenCalledWith(1);
    expect(result.current.services).toHaveLength(2);
    expect(result.current.instructors).toHaveLength(2);
  });

  it("loads services/instructors when isExpanded changes to true", async () => {
    const { result, rerender } = renderHook(
      ({ spotId, isExpanded }) => useSpotCardData(spotId, isExpanded),
      { initialProps: { spotId: 1, isExpanded: false } },
    );

    await waitFor(() => {
      expect(result.current.loadingPhotos).toBe(false);
    });

    expect(mockGetActiveServices).not.toHaveBeenCalled();

    rerender({ spotId: 1, isExpanded: true });

    await waitFor(() => {
      expect(result.current.servicesLoaded).toBe(true);
      expect(result.current.instructorsLoaded).toBe(true);
    });
  });

  it("sets photos to empty array on error", async () => {
    mockGetSpotPhotos.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useSpotCardData(1, false));

    await waitFor(() => {
      expect(result.current.loadingPhotos).toBe(false);
    });

    expect(result.current.photos).toEqual([]);
  });

  it("sets services to empty array on error", async () => {
    mockGetActiveServices.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useSpotCardData(1, true));

    await waitFor(() => {
      expect(result.current.loadingServices).toBe(false);
    });

    expect(result.current.services).toEqual([]);
  });

  it("sets instructors to empty array on error", async () => {
    mockGetInstructorsBySpot.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useSpotCardData(1, true));

    await waitFor(() => {
      expect(result.current.loadingInstructors).toBe(false);
    });

    expect(result.current.instructors).toEqual([]);
  });

  it("can manually load instructors", async () => {
    const { result } = renderHook(() => useSpotCardData(1, false));

    await waitFor(() => {
      expect(result.current.loadingPhotos).toBe(false);
    });

    await act(async () => {
      await result.current.loadInstructors();
    });

    expect(mockGetInstructorsBySpot).toHaveBeenCalledWith(1);
    expect(result.current.instructorsLoaded).toBe(true);
  });

  it("transforms photo responses correctly", async () => {
    const fullPhotoResponse = [
      {
        id: 5,
        url: "https://cdn.example.com/photo.jpg",
        thumbnailUrl: "https://cdn.example.com/photo-thumb.jpg",
        extraField: "should be stripped",
      },
    ];
    mockGetSpotPhotos.mockResolvedValue(fullPhotoResponse);
    const { result } = renderHook(() => useSpotCardData(1, false));

    await waitFor(() => {
      expect(result.current.loadingPhotos).toBe(false);
    });

    expect(result.current.photos).toEqual([
      {
        id: 5,
        url: "https://cdn.example.com/photo.jpg",
        thumbnailUrl: "https://cdn.example.com/photo-thumb.jpg",
      },
    ]);
  });
});
