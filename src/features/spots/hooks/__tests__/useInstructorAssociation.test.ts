import { renderHook, act, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useInstructorAssociation } from "../useInstructorAssociation";

jest.mock("@/src/shared/services/instructorSpotsService");
jest.mock("@/src/api/axios/getErrorMessage", () => ({
  getErrorMessage: jest.fn(
    (_err: unknown, fallback: string) => fallback ?? "Erreur",
  ),
}));

import {
  getInstructorSpots,
  addSpotToInstructor,
  removeSpotFromInstructor,
} from "@/src/shared/services/instructorSpotsService";

const mockGetInstructorSpots = getInstructorSpots as jest.Mock;
const mockAddSpotToInstructor = addSpotToInstructor as jest.Mock;
const mockRemoveSpotFromInstructor = removeSpotFromInstructor as jest.Mock;

const defaultProps = {
  spotId: 1,
  spotName: "Spot Paris",
  instructorId: 5,
  isInstructor: true,
  isExpanded: false,
  onReloadInstructors: jest.fn().mockResolvedValue(undefined),
};

describe("useInstructorAssociation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetInstructorSpots.mockResolvedValue([]);
    mockAddSpotToInstructor.mockResolvedValue(undefined);
    mockRemoveSpotFromInstructor.mockResolvedValue(undefined);
    jest.spyOn(Alert, "alert").mockImplementation();
  });

  it("checks association on mount for instructors", async () => {
    mockGetInstructorSpots.mockResolvedValue([
      { spot: { id: 1, name: "Spot Paris" } },
      { spot: { id: 2, name: "Spot Lyon" } },
    ]);

    const { result } = renderHook(() =>
      useInstructorAssociation(defaultProps),
    );

    await waitFor(() => {
      expect(result.current.checkingAssociation).toBe(false);
    });

    expect(mockGetInstructorSpots).toHaveBeenCalledWith(5);
    expect(result.current.isAssociatedToSpot).toBe(true);
  });

  it("sets isAssociatedToSpot to false when not associated", async () => {
    mockGetInstructorSpots.mockResolvedValue([
      { spot: { id: 99, name: "Other Spot" } },
    ]);

    const { result } = renderHook(() =>
      useInstructorAssociation(defaultProps),
    );

    await waitFor(() => {
      expect(result.current.checkingAssociation).toBe(false);
    });

    expect(result.current.isAssociatedToSpot).toBe(false);
  });

  it("skips check if not an instructor", async () => {
    const { result } = renderHook(() =>
      useInstructorAssociation({ ...defaultProps, isInstructor: false }),
    );

    await waitFor(() => {
      expect(result.current.checkingAssociation).toBe(false);
    });

    expect(mockGetInstructorSpots).not.toHaveBeenCalled();
    expect(result.current.isAssociatedToSpot).toBe(false);
  });

  it("skips check if instructorId is null", async () => {
    const { result } = renderHook(() =>
      useInstructorAssociation({
        ...defaultProps,
        instructorId: null,
      }),
    );

    await waitFor(() => {
      expect(result.current.checkingAssociation).toBe(false);
    });

    expect(mockGetInstructorSpots).not.toHaveBeenCalled();
  });

  it("handles association check error gracefully", async () => {
    mockGetInstructorSpots.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() =>
      useInstructorAssociation(defaultProps),
    );

    await waitFor(() => {
      expect(result.current.checkingAssociation).toBe(false);
    });

    expect(result.current.isAssociatedToSpot).toBe(false);
  });

  describe("handleAssociateToSpot", () => {
    it("shows Alert confirmation dialog", () => {
      const { result } = renderHook(() =>
        useInstructorAssociation(defaultProps),
      );

      act(() => {
        result.current.handleAssociateToSpot();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        "S'associer a ce spot",
        expect.stringContaining("Spot Paris"),
        expect.any(Array),
      );
    });

    it("does nothing if instructorId is null", () => {
      const { result } = renderHook(() =>
        useInstructorAssociation({ ...defaultProps, instructorId: null }),
      );

      act(() => {
        result.current.handleAssociateToSpot();
      });

      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  describe("handleRemoveFromSpot", () => {
    it("shows Alert confirmation dialog", () => {
      const { result } = renderHook(() =>
        useInstructorAssociation(defaultProps),
      );

      act(() => {
        result.current.handleRemoveFromSpot();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        "Se retirer de ce spot",
        expect.stringContaining("Spot Paris"),
        expect.any(Array),
      );
    });

    it("does nothing if instructorId is null", () => {
      const { result } = renderHook(() =>
        useInstructorAssociation({ ...defaultProps, instructorId: null }),
      );

      act(() => {
        result.current.handleRemoveFromSpot();
      });

      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });
});
