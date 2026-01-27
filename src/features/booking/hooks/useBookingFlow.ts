// ============================================
// 🛹 SOSKATE - USE BOOKING FLOW HOOK
// ============================================
// Gère l'état complet du flow de réservation

import { useReducer, useCallback } from "react";
import { TimeSlot } from "@/src/shared/services/availableSlotsService";
import {
    BookingFlowState,
    BookingFlowAction,
    BookingParams,
    BookingStep,
    BOOKING_STEPS,
} from "../types/booking.types";

/**
 * État initial du flow
 */
const initialState: BookingFlowState = {
    params: null,
    selectedDate: null,
    selectedDuration: null,
    selectedSlot: null,
    participantsNotes: "",
    currentStep: "date",
    isLoading: false,
    error: null,
};

/**
 * Reducer pour gérer les actions du flow
 */
const bookingFlowReducer = (
    state: BookingFlowState,
    action: BookingFlowAction
): BookingFlowState => {
    switch (action.type) {
        case "SET_PARAMS":
            return {
                ...state,
                params: action.payload,
            };

        case "SELECT_DATE":
            return {
                ...state,
                selectedDate: action.payload,
                // Reset le créneau si on change de date
                selectedSlot: null,
                error: null,
            };

        case "SELECT_DURATION":
            return {
                ...state,
                selectedDuration: action.payload,
                // Reset le créneau si on change de durée (les slots changent)
                selectedSlot: null,
                error: null,
            };

        case "SELECT_SLOT":
            return {
                ...state,
                selectedSlot: action.payload,
                error: null,
            };

        case "SET_NOTES":
            return {
                ...state,
                participantsNotes: action.payload,
            };

        case "NEXT_STEP": {
            const currentIndex = BOOKING_STEPS.findIndex(
                (s) => s.key === state.currentStep
            );
            const nextIndex = Math.min(currentIndex + 1, BOOKING_STEPS.length - 1);
            return {
                ...state,
                currentStep: BOOKING_STEPS[nextIndex].key,
                error: null,
            };
        }

        case "PREV_STEP": {
            const currentIndex = BOOKING_STEPS.findIndex(
                (s) => s.key === state.currentStep
            );
            const prevIndex = Math.max(currentIndex - 1, 0);
            return {
                ...state,
                currentStep: BOOKING_STEPS[prevIndex].key,
                error: null,
            };
        }

        case "GO_TO_STEP":
            return {
                ...state,
                currentStep: action.payload,
                error: null,
            };

        case "SET_LOADING":
            return {
                ...state,
                isLoading: action.payload,
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };

        case "RESET":
            return initialState;

        default:
            return state;
    }
};

/**
 * Hook principal pour le flow de réservation
 */
export const useBookingFlow = () => {
    const [state, dispatch] = useReducer(bookingFlowReducer, initialState);

    // Actions
    const setParams = useCallback((params: BookingParams) => {
        dispatch({ type: "SET_PARAMS", payload: params });
    }, []);

    const selectDate = useCallback((date: string) => {
        dispatch({ type: "SELECT_DATE", payload: date });
    }, []);

    const selectDuration = useCallback((duration: number) => {
        dispatch({ type: "SELECT_DURATION", payload: duration });
    }, []);

    const selectSlot = useCallback((slot: TimeSlot) => {
        dispatch({ type: "SELECT_SLOT", payload: slot });
    }, []);

    const setNotes = useCallback((notes: string) => {
        dispatch({ type: "SET_NOTES", payload: notes });
    }, []);

    const nextStep = useCallback(() => {
        dispatch({ type: "NEXT_STEP" });
    }, []);

    const prevStep = useCallback(() => {
        dispatch({ type: "PREV_STEP" });
    }, []);

    const goToStep = useCallback((step: BookingStep) => {
        dispatch({ type: "GO_TO_STEP", payload: step });
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        dispatch({ type: "SET_LOADING", payload: loading });
    }, []);

    const setError = useCallback((error: string | null) => {
        dispatch({ type: "SET_ERROR", payload: error });
    }, []);

    const reset = useCallback(() => {
        dispatch({ type: "RESET" });
    }, []);

    // Computed values
    const currentStepIndex = BOOKING_STEPS.findIndex(
        (s) => s.key === state.currentStep
    );

    const canGoNext = (): boolean => {
        switch (state.currentStep) {
            case "date":
                return state.selectedDate !== null;
            case "slot":
                return (
                    state.selectedDuration !== null && state.selectedSlot !== null
                );
            case "summary":
                return true; // Toujours possible de confirmer
            default:
                return false;
        }
    };

    const canGoPrev = (): boolean => {
        return currentStepIndex > 0;
    };

    const isLastStep = (): boolean => {
        return currentStepIndex === BOOKING_STEPS.length - 1;
    };

    const isFirstStep = (): boolean => {
        return currentStepIndex === 0;
    };

    return {
        state,
        // Actions
        setParams,
        selectDate,
        selectDuration,
        selectSlot,
        setNotes,
        nextStep,
        prevStep,
        goToStep,
        setLoading,
        setError,
        reset,
        // Computed
        currentStepIndex,
        canGoNext,
        canGoPrev,
        isLastStep,
        isFirstStep,
    };
};

export type UseBookingFlowReturn = ReturnType<typeof useBookingFlow>;