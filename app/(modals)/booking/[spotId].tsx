// ============================================
// 🛹 SOSKATE - BOOKING SCREEN (UPDATED)
// ============================================
// Écran principal de réservation (modal)
// Utilise l'endpoint /available-slots du backend

import React, { useEffect, useMemo, useState, useCallback } from "react";

import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import * as Icons from "phosphor-react-native";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/src/shared/theme";
import Typo from "@/src/shared/ui/typography/Typo";

// Booking components
import BookingStepper from "@/src/features/booking/components/BookingStepper";
import WeekCalendar from "@/src/features/booking/components/WeekCalendar";
import DurationPicker from "@/src/features/booking/components/DurationPicker";
import TimeSlotList from "@/src/features/booking/components/TimeSlotList";
import BookingSummary from "@/src/features/booking/components/BookingSummary";

// Hooks
import { useBookingFlow } from "@/src/features/booking/hooks/useBookingFlow";
import { useAvailability } from "@/src/features/booking/hooks/useAvailability";

// Types & services
import { BookingParams, formatDuration } from "@/src/features/booking/types/booking.types";
import { createBooking } from "@/src/shared/services/bookingService";
import { useAuth } from "@/src/shared/contexts/AuthContext";
import { TimeSlot } from "@/src/shared/services/availableSlotsService";

export default function BookingScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    // Constante pour le délai minimum de réservation (en jours)
    const MIN_BOOKING_DAYS_AHEAD = 3;

    // Récupérer les paramètres de navigation
    const params = useLocalSearchParams<{
        spotId: string;
        spotName: string;
        spotAddress: string;
        instructorId: string;
        instructorFirstName: string;
        instructorLastName: string;
        serviceId: string;
        serviceName: string;
        basePriceCents: string;
        maxParticipants: string;
    }>();

    // State pour le submit et les créneaux
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [isLoadingSlotsLocal, setIsLoadingSlotsLocal] = useState(false);

    // Booking flow state
    const {
        state,
        setParams,
        selectDate,
        selectDuration,
        selectSlot,
        setNotes,
        nextStep,
        prevStep,
        canGoNext,
        isLastStep,
        isFirstStep,
    } = useBookingFlow();

    // Availability hook - maintenant avec spotId
    const {
        isLoading: isLoadingAvailability,
        hasAvailabilityForDate,
        fetchSlotsForDate,
        getAvailableDurationsForDate,
    } = useAvailability({
        instructorId: parseInt(params.instructorId || "0", 10),
        spotId: parseInt(params.spotId || "0", 10),
    });

    // Initialiser les params au montage
    useEffect(() => {
        if (params.spotId) {
            const bookingParams: BookingParams = {
                spotId: parseInt(params.spotId, 10),
                spotName: params.spotName || "",
                spotAddress: params.spotAddress || "",
                instructorId: parseInt(params.instructorId || "0", 10),
                instructorFirstName: params.instructorFirstName || "",
                instructorLastName: params.instructorLastName || "",
                serviceId: parseInt(params.serviceId || "0", 10),
                serviceName: params.serviceName || "",
                basePriceCents: parseInt(params.basePriceCents || "0", 10),
                maxParticipants: parseInt(params.maxParticipants || "1", 10),
            };
            setParams(bookingParams);
        }
    }, []);

    // Charger les créneaux quand la date OU la durée change
    const loadSlots = useCallback(async () => {
        if (!state.selectedDate || !state.selectedDuration) {
            setAvailableSlots([]);
            return;
        }

        setIsLoadingSlotsLocal(true);
        try {
            const slots = await fetchSlotsForDate(
                state.selectedDate,
                state.selectedDuration
            );
            setAvailableSlots(slots);
        } catch (error) {
            console.error("Erreur chargement créneaux:", error);
            setAvailableSlots([]);
        } finally {
            setIsLoadingSlotsLocal(false);
        }
    }, [state.selectedDate, state.selectedDuration, fetchSlotsForDate]);

    // Déclencher le chargement des créneaux
    useEffect(() => {
        loadSlots();
    }, [loadSlots]);

    // Durées disponibles pour la date sélectionnée
    const availableDurations = useMemo(() => {
        if (!state.selectedDate) {
            return [];
        }
        return getAvailableDurationsForDate(state.selectedDate);
    }, [state.selectedDate, getAvailableDurationsForDate]);

    // Handlers
    const handleClose = () => {
        router.back();
    };

    const handleNext = () => {
        if (isLastStep()) {
            handleSubmit();
        } else {
            nextStep();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    };

    const handleBack = () => {
        if (isFirstStep()) {
            handleClose();
        } else {
            prevStep();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handleSlotSelect = (slot: TimeSlot) => {
        // Passer directement le slot au flow
        selectSlot(slot);
    };

    const handleSubmit = async () => {
        if (
            !state.params ||
            !state.selectedDate ||
            !state.selectedDuration ||
            !state.selectedSlot
        ) {
            return;
        }

        if (!user?.id) {
            Alert.alert("Erreur", "Vous devez être connecté pour réserver");
            return;
        }

        setIsSubmitting(true);

        try {
            // Construire le startTime ISO
            const startTimeISO = `${state.selectedDate}T${state.selectedSlot.startTime}:00`;

            const bookingData = {
                instructorId: state.params.instructorId,
                spotId: state.params.spotId,
                serviceId: state.params.serviceId,
                startTime: startTimeISO,
                durationMinutes: state.selectedDuration,
                numberOfParticipants: state.params.maxParticipants,
                participantsNotes: state.participantsNotes || null,
            };

            await createBooking(user.id, bookingData);

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Succès
            Alert.alert(
                "Réservation confirmée ! 🛹",
                `Votre cours de ${formatDuration(state.selectedDuration)} avec ${state.params.instructorFirstName} est réservé pour le ${formatDate(state.selectedDate)} à ${state.selectedSlot.startTime}.`,
                [
                    {
                        text: "Super !",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error: any) {
            console.error("Erreur création réservation:", error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            const message =
                error.response?.data?.message ||
                "Une erreur est survenue lors de la réservation";
            Alert.alert("Erreur", message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Formater une date pour l'affichage
    const formatDate = (dateString: string): string => {
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
        });
    };

    // Calculer la date minimum de réservation (J+3)
    const getMinBookingDate = (): string => {
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + MIN_BOOKING_DAYS_AHEAD);

        const year = minDate.getFullYear();
        const month = String(minDate.getMonth() + 1).padStart(2, "0");
        const day = String(minDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // Label du bouton principal
    const getButtonLabel = (): string => {
        if (isSubmitting) return "Réservation...";
        if (isLastStep()) return "Confirmer la réservation";
        return "Continuer";
    };

    // Rendu du contenu selon l'étape
    const renderStepContent = () => {
        switch (state.currentStep) {
            case "date":
                return (
                    <Animated.View entering={FadeIn} style={styles.stepContent}>
                        <View style={styles.stepHeader}>
                            <Typo size={20} fontWeight="700" color={colors.text.primary}>
                                Choisissez une date
                            </Typo>
                            <Typo size={14} color={colors.text.secondary}>
                                Sélectionnez le jour de votre cours
                            </Typo>
                        </View>

                        {isLoadingAvailability ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={colors.accent.primary} />
                                <Typo size={14} color={colors.text.muted}>
                                    Chargement des disponibilités...
                                </Typo>
                            </View>
                        ) : (
                            <WeekCalendar
                                selectedDate={state.selectedDate}
                                onSelectDate={selectDate}
                                hasAvailability={hasAvailabilityForDate}
                                minDate={getMinBookingDate()}
                            />
                        )}
                    </Animated.View>
                );

            case "slot":
                return (
                    <Animated.View
                        entering={SlideInRight.springify()}
                        style={styles.stepContent}
                    >
                        <View style={styles.stepHeader}>
                            <Typo size={20} fontWeight="700" color={colors.text.primary}>
                                Durée et créneau
                            </Typo>
                            <Typo size={14} color={colors.text.secondary}>
                                {state.selectedDate && formatDate(state.selectedDate)}
                            </Typo>
                        </View>

                        <DurationPicker
                            selectedDuration={state.selectedDuration}
                            onSelectDuration={selectDuration}
                            availableDurations={availableDurations}
                            showPricePreview
                            basePriceCents={state.params?.basePriceCents}
                        />

                        {state.selectedDuration && (
                            <TimeSlotList
                                slots={availableSlots}
                                selectedSlot={state.selectedSlot}
                                onSelectSlot={handleSlotSelect}
                                isLoading={isLoadingSlotsLocal}
                            />
                        )}
                    </Animated.View>
                );

            case "summary":
                return (
                    <Animated.View
                        entering={SlideInRight.springify()}
                        style={styles.stepContent}
                    >
                        {state.params &&
                            state.selectedDate &&
                            state.selectedDuration &&
                            state.selectedSlot && (
                                <BookingSummary
                                    params={state.params}
                                    selectedDate={state.selectedDate}
                                    selectedDuration={state.selectedDuration}
                                    selectedSlot={state.selectedSlot}
                                    notes={state.participantsNotes}
                                    onNotesChange={setNotes}
                                />
                            )}
                    </Animated.View>
                );

            default:
                return null;
        }
    };

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background.primary }]}
        >
            {/* Header */}
            <View
                style={[
                    styles.header,
                    {
                        paddingTop: insets.top + 8,
                        borderBottomColor: colors.border.subtle,
                    },
                ]}
            >
                <Pressable onPress={handleBack} style={styles.headerButton}>
                    <Icons.CaretLeftIcon
                        size={24}
                        color={colors.text.primary}
                        weight="bold"
                    />
                </Pressable>

                <View style={styles.headerTitleContainer}>
                    <Typo size={16} fontWeight="600" color={colors.text.primary}>
                        Réservation
                    </Typo>
                    {state.params && (
                        <Typo size={12} color={colors.text.secondary} numberOfLines={1}>
                            {state.params.spotName}
                        </Typo>
                    )}
                </View>

                <Pressable onPress={handleClose} style={styles.headerButton}>
                    <Icons.XIcon size={24} color={colors.text.primary} weight="bold" />
                </Pressable>
            </View>

            {/* Stepper */}
            <BookingStepper currentStep={state.currentStep} />

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 100 },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {renderStepContent()}
            </ScrollView>

            {/* Footer avec bouton */}
            <View
                style={[
                    styles.footer,
                    {
                        paddingBottom: insets.bottom + 16,
                        backgroundColor: colors.background.primary,
                        borderTopColor: colors.border.subtle,
                    },
                ]}
            >
                <Pressable
                    style={[
                        styles.button,
                        {
                            backgroundColor: canGoNext()
                                ? colors.accent.primary
                                : colors.border.default,
                        },
                    ]}
                    onPress={handleNext}
                    disabled={!canGoNext() || isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color={colors.constant.white} />
                    ) : (
                        <>
                            <Typo
                                size={16}
                                fontWeight="700"
                                color={
                                    canGoNext() ? colors.constant.white : colors.text.muted
                                }
                            >
                                {getButtonLabel()}
                            </Typo>
                            {!isLastStep() && (
                                <Icons.ArrowRightIcon
                                    size={20}
                                    color={
                                        canGoNext() ? colors.constant.white : colors.text.muted
                                    }
                                    weight="bold"
                                />
                            )}
                        </>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: "center",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    stepContent: {
        gap: 24,
    },
    stepHeader: {
        gap: 4,
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        gap: 12,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 16,
        borderRadius: 14,
    },
});