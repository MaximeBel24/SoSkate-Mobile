import { renderHook, act } from "@testing-library/react-native";
import { useBookingFlow } from "../useBookingFlow";
import { BookingParams } from "../../types/booking.types";
import { TimeSlot } from "@/src/shared/types/available-slots.interface";

const mockParams: BookingParams = {
  spotId: 1,
  spotName: "Spot Paris",
  spotAddress: "10 rue de Rivoli",
  instructorId: 5,
  instructorFirstName: "Jean",
  instructorLastName: "Dupont",
  serviceId: 3,
  serviceName: "Initiation",
  basePriceCents: 3000,
  maxParticipants: 5,
};

const mockSlot: TimeSlot = {
  id: "2026-01-29-14:00-0",
  startTime: "14:00",
  endTime: "15:30",
  available: true,
};

describe("useBookingFlow", () => {
  describe("initial state", () => {
    it("starts with default values", () => {
      const { result } = renderHook(() => useBookingFlow());
      expect(result.current.state.params).toBeNull();
      expect(result.current.state.selectedDate).toBeNull();
      expect(result.current.state.selectedDuration).toBeNull();
      expect(result.current.state.selectedSlot).toBeNull();
      expect(result.current.state.participantsNotes).toBe("");
      expect(result.current.state.currentStep).toBe("date");
      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.error).toBeNull();
    });

    it("starts at step index 0", () => {
      const { result } = renderHook(() => useBookingFlow());
      expect(result.current.currentStepIndex).toBe(0);
    });

    it("isFirstStep returns true initially", () => {
      const { result } = renderHook(() => useBookingFlow());
      expect(result.current.isFirstStep()).toBe(true);
    });

    it("isLastStep returns false initially", () => {
      const { result } = renderHook(() => useBookingFlow());
      expect(result.current.isLastStep()).toBe(false);
    });
  });

  describe("SET_PARAMS", () => {
    it("sets booking params", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.setParams(mockParams));
      expect(result.current.state.params).toEqual(mockParams);
    });
  });

  describe("SELECT_DATE", () => {
    it("sets selected date", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.selectDate("2026-01-29"));
      expect(result.current.state.selectedDate).toBe("2026-01-29");
    });

    it("resets selected slot when date changes", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.selectSlot(mockSlot));
      act(() => result.current.selectDate("2026-01-30"));
      expect(result.current.state.selectedSlot).toBeNull();
    });

    it("clears error when date is selected", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.setError("Some error"));
      act(() => result.current.selectDate("2026-01-29"));
      expect(result.current.state.error).toBeNull();
    });
  });

  describe("SELECT_DURATION", () => {
    it("sets selected duration", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.selectDuration(120));
      expect(result.current.state.selectedDuration).toBe(120);
    });

    it("resets selected slot when duration changes", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.selectSlot(mockSlot));
      act(() => result.current.selectDuration(90));
      expect(result.current.state.selectedSlot).toBeNull();
    });
  });

  describe("SELECT_SLOT", () => {
    it("sets selected slot", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.selectSlot(mockSlot));
      expect(result.current.state.selectedSlot).toEqual(mockSlot);
    });
  });

  describe("SET_NOTES", () => {
    it("sets participants notes", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.setNotes("Débutant complet"));
      expect(result.current.state.participantsNotes).toBe("Débutant complet");
    });
  });

  describe("step navigation", () => {
    it("NEXT_STEP advances to the next step", () => {
      const { result } = renderHook(() => useBookingFlow());
      expect(result.current.state.currentStep).toBe("date");
      act(() => result.current.nextStep());
      expect(result.current.state.currentStep).toBe("slot");
      act(() => result.current.nextStep());
      expect(result.current.state.currentStep).toBe("summary");
    });

    it("NEXT_STEP does not go past last step", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.nextStep());
      act(() => result.current.nextStep());
      act(() => result.current.nextStep()); // extra
      expect(result.current.state.currentStep).toBe("summary");
    });

    it("PREV_STEP goes back to previous step", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.nextStep());
      act(() => result.current.nextStep());
      act(() => result.current.prevStep());
      expect(result.current.state.currentStep).toBe("slot");
    });

    it("PREV_STEP does not go before first step", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.prevStep());
      expect(result.current.state.currentStep).toBe("date");
    });

    it("GO_TO_STEP jumps to a specific step", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.goToStep("summary"));
      expect(result.current.state.currentStep).toBe("summary");
    });

    it("navigation clears error", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.setError("Some error"));
      act(() => result.current.nextStep());
      expect(result.current.state.error).toBeNull();
    });
  });

  describe("SET_LOADING", () => {
    it("sets loading state", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.setLoading(true));
      expect(result.current.state.isLoading).toBe(true);
      act(() => result.current.setLoading(false));
      expect(result.current.state.isLoading).toBe(false);
    });
  });

  describe("SET_ERROR", () => {
    it("sets error and turns off loading", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.setLoading(true));
      act(() => result.current.setError("Network error"));
      expect(result.current.state.error).toBe("Network error");
      expect(result.current.state.isLoading).toBe(false);
    });

    it("can clear error by setting null", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.setError("Some error"));
      act(() => result.current.setError(null));
      expect(result.current.state.error).toBeNull();
    });
  });

  describe("RESET", () => {
    it("resets to initial state", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => {
        result.current.setParams(mockParams);
        result.current.selectDate("2026-01-29");
        result.current.selectDuration(120);
        result.current.selectSlot(mockSlot);
        result.current.setNotes("Hello");
        result.current.nextStep();
      });
      act(() => result.current.reset());
      expect(result.current.state.params).toBeNull();
      expect(result.current.state.selectedDate).toBeNull();
      expect(result.current.state.currentStep).toBe("date");
    });
  });

  describe("canGoNext", () => {
    it("returns false on date step without a date", () => {
      const { result } = renderHook(() => useBookingFlow());
      expect(result.current.canGoNext()).toBe(false);
    });

    it("returns true on date step with a date selected", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.selectDate("2026-01-29"));
      expect(result.current.canGoNext()).toBe(true);
    });

    it("returns false on slot step without duration and slot", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.nextStep()); // go to "slot"
      expect(result.current.canGoNext()).toBe(false);
    });

    it("returns false on slot step with duration but no slot", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.nextStep());
      act(() => result.current.selectDuration(120));
      expect(result.current.canGoNext()).toBe(false);
    });

    it("returns true on slot step with both duration and slot", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.nextStep());
      act(() => result.current.selectDuration(120));
      act(() => result.current.selectSlot(mockSlot));
      expect(result.current.canGoNext()).toBe(true);
    });

    it("returns true on summary step (always confirmable)", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.goToStep("summary"));
      expect(result.current.canGoNext()).toBe(true);
    });
  });

  describe("canGoPrev", () => {
    it("returns false on first step", () => {
      const { result } = renderHook(() => useBookingFlow());
      expect(result.current.canGoPrev()).toBe(false);
    });

    it("returns true on second step", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.nextStep());
      expect(result.current.canGoPrev()).toBe(true);
    });
  });

  describe("isLastStep / isFirstStep", () => {
    it("isLastStep is true on summary", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.goToStep("summary"));
      expect(result.current.isLastStep()).toBe(true);
    });

    it("isFirstStep is false on slot step", () => {
      const { result } = renderHook(() => useBookingFlow());
      act(() => result.current.nextStep());
      expect(result.current.isFirstStep()).toBe(false);
    });
  });
});
